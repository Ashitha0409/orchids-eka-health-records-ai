import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// Order status flow: PendingPayment → PaidLocked → Preparing → OutForDelivery → Delivered | Cancelled | NoShow
export type OrderStatus = 
  | 'pending_payment'  // Waiting for MetaMask escrow lock
  | 'paid_locked'      // Escrow locked, waiting for pharmacy confirmation
  | 'preparing'        // Pharmacy is preparing the order
  | 'out_for_delivery' // Order is out for delivery
  | 'delivered'        // Order delivered and collected
  | 'cancelled'        // Order cancelled (full or partial refund based on timing)
  | 'no_show';         // Customer did not collect (penalty applied)

const PENALTY_RATE = 0.15; // 15% penalty for no-show
const COLLECTION_WINDOW_HOURS = 24; // Hours within which order must be collected

export async function GET(request: NextRequest) {
  try {
    const db = await getDatabase();
    
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const status = searchParams.get('status');
    const orderId = searchParams.get('orderId');
    
    // Get single order by ID
    if (orderId) {
      const order = await db.collection('orders').findOne({ _id: new ObjectId(orderId) });
      if (!order) {
        return NextResponse.json(
          { success: false, error: 'Order not found' },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true, data: order });
    }
    
    let query: Record<string, unknown> = {};
    if (userId) query.customerId = userId;
    if (status) query.status = status;
    
    const orders = await db.collection('orders').find(query).sort({ orderDate: -1 }).toArray();
    
    return NextResponse.json({ 
      success: true, 
      data: orders 
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const db = await getDatabase();
    
    const body = await request.json();
    const {
      items,
      pharmacy,
      customerPhone,
      totalAmount,
      deliveryFee = 50,
      prescriptionImage,
      customerId,
      walletAddress,
      escrowLockedAmount,
      escrowTransactionId,
    } = body;
    
    // Validate required fields
    if (!items || !pharmacy || !customerPhone || !totalAmount) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate MetaMask escrow fields
    if (!walletAddress || !escrowLockedAmount) {
      return NextResponse.json(
        { success: false, error: 'MetaMask wallet and escrow amount required' },
        { status: 400 }
      );
    }

    const totalWithDelivery = totalAmount + deliveryFee;
    const collectionDeadline = new Date(Date.now() + COLLECTION_WINDOW_HOURS * 60 * 60 * 1000);
    
    const order = {
      items,
      pharmacy,
      customerPhone,
      totalAmount,
      deliveryFee,
      totalWithDelivery,
      prescriptionImage,
      customerId,
      
      // MetaMask escrow fields
      walletAddress,
      escrowLockedAmount,
      escrowTransactionId,
      escrowStatus: 'locked' as const,
      
      // Order status
      status: 'paid_locked' as OrderStatus, // Start with paid_locked since escrow is already done
      
      // Timestamps
      orderDate: new Date(),
      estimatedDelivery: pharmacy.deliveryTime || '30 mins',
      collectionDeadline: collectionDeadline.toISOString(),
      createdAt: new Date(),
      updatedAt: new Date(),
      
      // Refund/penalty tracking
      refundAmount: null,
      penaltyAmount: null,
      penaltyRate: PENALTY_RATE,
    };
    
    const result = await db.collection('orders').insertOne(order);
    const savedOrder = { ...order, _id: result.insertedId };
    
    return NextResponse.json({ 
      success: true, 
      data: savedOrder 
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create order' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const db = await getDatabase();
    
    const body = await request.json();
    const { orderId, action, updates } = body;
    
    if (!orderId) {
      return NextResponse.json(
        { success: false, error: 'Order ID is required' },
        { status: 400 }
      );
    }

    const order = await db.collection('orders').findOne({ _id: new ObjectId(orderId) });
    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    let updateData: Record<string, unknown> = {
      ...updates,
      updatedAt: new Date(),
    };

    // Handle different actions
    switch (action) {
      case 'confirm_preparing':
        // Pharmacy confirms and starts preparing
        if (order.status !== 'paid_locked') {
          return NextResponse.json(
            { success: false, error: 'Order must be in paid_locked status to start preparing' },
            { status: 400 }
          );
        }
        updateData.status = 'preparing';
        updateData.preparingStartedAt = new Date();
        break;

      case 'out_for_delivery':
        // Order is ready and out for delivery
        if (order.status !== 'preparing') {
          return NextResponse.json(
            { success: false, error: 'Order must be in preparing status' },
            { status: 400 }
          );
        }
        updateData.status = 'out_for_delivery';
        updateData.outForDeliveryAt = new Date();
        break;

      case 'mark_collected':
        // Customer collected the order - release escrow to pharmacy
        if (order.status !== 'out_for_delivery') {
          return NextResponse.json(
            { success: false, error: 'Order must be out for delivery to mark as collected' },
            { status: 400 }
          );
        }
        updateData.status = 'delivered';
        updateData.deliveredAt = new Date();
        updateData.escrowStatus = 'released';
        updateData.escrowReleasedAt = new Date();
        break;

      case 'cancel':
        // Cancel order - refund based on status
        const canCancelWithFullRefund = ['pending_payment', 'paid_locked'].includes(order.status);
        const canCancelWithPartialRefund = order.status === 'preparing';
        
        if (!canCancelWithFullRefund && !canCancelWithPartialRefund) {
          return NextResponse.json(
            { success: false, error: 'Order cannot be cancelled at this stage' },
            { status: 400 }
          );
        }
        
        updateData.status = 'cancelled';
        updateData.cancelledAt = new Date();
        
        if (canCancelWithFullRefund) {
          // Full refund before preparation
          updateData.escrowStatus = 'refunded';
          updateData.refundAmount = order.escrowLockedAmount;
          updateData.penaltyAmount = 0;
        } else {
          // Partial refund (50% penalty) if cancelled during preparation
          const partialPenalty = order.escrowLockedAmount * 0.5;
          updateData.escrowStatus = 'partial_refund';
          updateData.refundAmount = order.escrowLockedAmount - partialPenalty;
          updateData.penaltyAmount = partialPenalty;
        }
        break;

      case 'mark_no_show':
        // Customer didn't collect - apply penalty
        if (order.status !== 'out_for_delivery') {
          return NextResponse.json(
            { success: false, error: 'Can only mark no-show for orders out for delivery' },
            { status: 400 }
          );
        }
        
        const penaltyAmount = order.escrowLockedAmount * PENALTY_RATE;
        const refundAmount = order.escrowLockedAmount * (1 - PENALTY_RATE);
        
        updateData.status = 'no_show';
        updateData.noShowAt = new Date();
        updateData.escrowStatus = 'penalty_applied';
        updateData.penaltyAmount = penaltyAmount;
        updateData.refundAmount = refundAmount;
        break;

      case 'update_status':
        // Generic status update
        if (updates?.status) {
          updateData.status = updates.status;
        }
        break;

      default:
        // Just apply updates
        break;
    }
    
    const result = await db.collection('orders').findOneAndUpdate(
      { _id: new ObjectId(orderId) },
      { $set: updateData },
      { returnDocument: 'after' }
    );
    
    if (!result) {
      return NextResponse.json(
        { success: false, error: 'Failed to update order' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      data: result,
      action,
      message: getActionMessage(action)
    });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update order' },
      { status: 500 }
    );
  }
}

function getActionMessage(action: string): string {
  const messages: Record<string, string> = {
    confirm_preparing: 'Order confirmed and preparation started',
    out_for_delivery: 'Order is now out for delivery',
    mark_collected: 'Order delivered! Escrow released to pharmacy',
    cancel: 'Order cancelled. Refund processed.',
    mark_no_show: 'No-show recorded. Penalty applied and partial refund processed.',
  };
  return messages[action] || 'Order updated';
}
