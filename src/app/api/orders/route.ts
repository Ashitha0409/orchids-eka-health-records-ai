import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request: NextRequest) {
  try {
    const db = await connectToDatabase();
    
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const status = searchParams.get('status');
    
    let query: any = {};
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
    const db = await connectToDatabase();
    
    const body = await request.json();
    const {
      items,
      pharmacy,
      customerPhone,
      totalAmount,
      prescriptionImage,
      customerId,
      blockchainEscrowId,
      status = 'pending'
    } = body;
    
    // Validate required fields
    if (!items || !pharmacy || !customerPhone || !totalAmount) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    const order = {
      items,
      pharmacy,
      customerPhone,
      totalAmount,
      prescriptionImage,
      customerId,
      blockchainEscrowId,
      status,
      orderDate: new Date(),
      estimatedDelivery: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutes
      createdAt: new Date(),
      updatedAt: new Date(),
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
    const db = await connectToDatabase();
    
    const body = await request.json();
    const { orderId, status, updates } = body;
    
    if (!orderId) {
      return NextResponse.json(
        { success: false, error: 'Order ID is required' },
        { status: 400 }
      );
    }
    
    const updateData = {
      ...updates,
      status,
      updatedAt: new Date(),
      ...(status === 'delivered' && { deliveredAt: new Date() }),
      ...(status === 'cancelled' && { cancelledAt: new Date() }),
    };
    
    const result = await db.collection('orders').findOneAndUpdate(
      { _id: new ObjectId(orderId) },
      { $set: updateData },
      { returnDocument: 'after' }
    );
    
    if (!result) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      data: result 
    });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update order' },
      { status: 500 }
    );
  }
}
