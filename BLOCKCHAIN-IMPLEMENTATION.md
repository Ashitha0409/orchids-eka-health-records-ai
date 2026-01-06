# 💰 MetaMask Escrow Payment Simulation

## Overview

This implementation provides a **simplified MetaMask-based payment simulation** for the medicine ordering system. Instead of complex blockchain integrations (Cardano/Polygon), we use a simulated escrow system that demonstrates the payment flow while persisting all data in localStorage.

## 🎯 Features

### 1. useMetaMask Hook (`src/hooks/use-metamask.ts`)

A custom React hook that:
- Connects to `window.ethereum` (MetaMask)
- Stores `walletAddress` and `network` in React state
- Manages a **fake balance** (stored in localStorage, default: ₹10,000)
- Provides escrow helpers:
  - `lockAmount(amount)` - Lock funds when placing order
  - `releaseAmount(amount)` - Release to pharmacy on collection
  - `refundAmount(amount)` - Full refund on cancellation
  - `chargePenalty(amount)` - Apply penalty for no-show

### 2. Order Status Flow

```
PendingPayment → PaidLocked → Preparing → OutForDelivery → Delivered
                                                        ↳ Cancelled
                                                        ↳ NoShow
```

| Status | Description | Escrow State |
|--------|-------------|--------------|
| `pending_payment` | Waiting for payment | - |
| `paid_locked` | Payment locked in escrow | 🔒 Locked |
| `preparing` | Pharmacy preparing order | 🔒 Locked |
| `out_for_delivery` | Order out for delivery | 🔒 Locked |
| `delivered` | Collected by customer | ✅ Released to Pharmacy |
| `cancelled` | Order cancelled | 💰 Refunded (full/partial) |
| `no_show` | Customer didn't collect | ⚠️ Penalty Applied |

### 3. Escrow Operations

#### On "Place Order"
```typescript
await lockAmount(order.totalWithDelivery);
// Stores escrowLockedAmount in order object
// Deducts from fake balance
```

#### On "Mark as Collected"
```typescript
await releaseAmount(escrowLockedAmount);
// Simulates payment to pharmacy
// Order status → Delivered
```

#### On Cancellation
```typescript
// Before preparation: Full refund
await refundAmount(escrowLockedAmount);

// During preparation: 50% penalty
const refund = escrowLockedAmount * 0.5;
await refundAmount(refund);
```

#### On No-Show
```typescript
const PENALTY_RATE = 0.15; // 15%
const penalty = escrowLockedAmount * PENALTY_RATE;
const refund = escrowLockedAmount * (1 - PENALTY_RATE);
await chargePenalty(escrowLockedAmount);
// Returns { penaltyAmount, refundAmount }
```

## 📁 File Structure

```
src/
├── hooks/
│   └── use-metamask.ts          # MetaMask hook with escrow simulation
├── app/
│   ├── api/orders/
│   │   └── route.ts             # Orders API with escrow fields
│   └── patient-dashboard/
│       └── medications/
│           └── page.tsx         # Checkout page with MetaMask integration
```

## 🔧 localStorage Keys

| Key | Description |
|-----|-------------|
| `metamask_wallet_address` | Connected wallet address |
| `metamask_network` | Current network name |
| `metamask_fake_balance` | Simulated balance (₹) |
| `metamask_transactions` | Transaction history |
| `userOrders` | Saved orders with escrow data |

## 💻 Usage

### Connect Wallet
```tsx
const { connect, isConnected, walletAddress, balance } = useMetaMask();

<Button onClick={connect}>
  Connect MetaMask
</Button>
```

### Place Order with Escrow
```tsx
const { lockAmount, walletAddress } = useMetaMask();

const placeOrder = async () => {
  // Lock payment
  await lockAmount(totalWithDelivery, orderId);
  
  // Create order with escrow fields
  const order = {
    ...orderData,
    walletAddress,
    escrowLockedAmount: totalWithDelivery,
    escrowStatus: 'locked',
  };
};
```

### Handle Collection
```tsx
const { releaseAmount } = useMetaMask();

const handleMarkCollected = async (order) => {
  await releaseAmount(order.escrowLockedAmount, order.id);
  // Update order status to 'delivered'
};
```

### Handle No-Show
```tsx
const { chargePenalty, PENALTY_RATE } = useMetaMask();

const handleNoShow = async (order) => {
  const result = await chargePenalty(order.escrowLockedAmount, order.id);
  // result.penaltyAmount = 15% of locked amount
  // result.refundAmount = 85% refunded to user
};
```

## 🎨 UI Components

### Wallet Tab
- Shows connected wallet info
- Balance display
- Add funds (demo)
- Transaction history
- Escrow explanation

### Order Details
- Escrow status badge
- Locked amount
- Refund/penalty amounts
- Collection deadline

### Action Buttons
- "Mark as Collected" → Release escrow
- "Mark No-Show" → Apply penalty
- "Cancel Order" → Full/partial refund

## ⚙️ Configuration

```typescript
// In use-metamask.ts
const DEFAULT_BALANCE = 10000; // ₹10,000 starting balance
const PENALTY_RATE = 0.15;     // 15% no-show penalty

// In orders API
const COLLECTION_WINDOW_HOURS = 24; // Hours to collect order
```

## 🧪 Demo Features

The Wallet tab includes demo buttons:
- **Add ₹1000** - Add fake funds
- **Reset Balance** - Reset to ₹10,000
- **Simulate Next Status** - Progress order through status flow

## 📋 Order Object Structure

```typescript
interface Order {
  id: string;
  items: CartItem[];
  pharmacy: Pharmacy;
  totalAmount: number;
  totalWithDelivery: number;
  deliveryFee: number;
  status: OrderStatus;
  
  // Escrow fields
  walletAddress: string;
  escrowLockedAmount: number;
  escrowTransactionId: string;
  escrowStatus: 'locked' | 'released' | 'refunded' | 'partial_refund' | 'penalty_applied';
  collectionDeadline: string;
  refundAmount?: number;
  penaltyAmount?: number;
}
```

## 🔐 Security Notes

This is a **simulation** for demonstration purposes. In production:
- Replace fake balance with real blockchain wallet balance
- Use actual smart contracts for escrow
- Implement proper transaction signing
- Add server-side validation
- Use secure payment gateways

## 🚀 Future Enhancements

1. **Real Blockchain Integration**
   - Deploy escrow smart contract on testnet
   - Integrate with actual MATIC/ETH balance

2. **Push Notifications**
   - Order status updates
   - Collection reminders

3. **Karma Points System**
   - Reward reliable collectors
   - Penalize repeated no-shows

4. **Pharmacy Dashboard**
   - Order management
   - Escrow release confirmation
