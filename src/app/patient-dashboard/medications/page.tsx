"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Plus,
  Upload,
  Search,
  MapPin,
  Phone,
  Clock,
  Star,
  ShoppingCart,
  Camera,
  Package,
  Truck,
  CheckCircle2,
  Filter,
  Heart,
  Shield,
  Pill,
  X,
  Plus as PlusIcon,
  PhoneCall,
  Package2,
  Activity,
  Zap,
  FileText,
  CheckCircle,
  XCircle,
  Loader2,
  MapPinIcon,
  Wallet,
  AlertTriangle,
  RefreshCw,
  Ban,
  DollarSign,
  Lock,
  Unlock,
} from "lucide-react";
import { toast } from "sonner";
import { useMetaMask } from "@/hooks/use-metamask";

interface Medicine {
  id: string;
  name: string;
  brand: string;
  price: number;
  image: string;
  inStock: boolean;
  rating: number;
  category: string;
  requiresPrescription: boolean;
  dosage: string;
  packSize: string;
  pharmacyName: string;
  manufacturer: string;
  description: string;
}

interface CartItem {
  medicine: Medicine;
  quantity: number;
  quantityType: 'single' | 'double' | 'half';
  prescriptionImage?: string;
}

type OrderStatus = 
  | 'pending_payment'
  | 'paid_locked'
  | 'preparing'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'
  | 'no_show';

interface Order {
  id: string;
  _id?: string;
  items: CartItem[];
  pharmacy: Pharmacy;
  customerPhone: string;
  totalAmount: number;
  totalWithDelivery: number;
  deliveryFee: number;
  status: OrderStatus;
  orderDate: string;
  estimatedDelivery: string;
  prescriptionImage?: string;
  // Escrow fields
  walletAddress?: string;
  escrowLockedAmount?: number;
  escrowTransactionId?: string;
  escrowStatus?: 'locked' | 'released' | 'refunded' | 'partial_refund' | 'penalty_applied';
  collectionDeadline?: string;
  refundAmount?: number;
  penaltyAmount?: number;
}

interface Pharmacy {
  id: string;
  name: string;
  image: string;
  rating: number;
  distance: number;
  address: string;
  isOpen: boolean;
  deliveryTime: string;
  phone: string;
}

const DELIVERY_FEE = 50;

export default function MedicationsSection() {
  const [activeTab, setActiveTab] = useState("list");
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [prescriptionDialogOpen, setPrescriptionDialogOpen] = useState(false);
  const [quantityDialogOpen, setQuantityDialogOpen] = useState(false);
  const [phoneDialogOpen, setPhoneDialogOpen] = useState(false);
  const [orderDetailDialogOpen, setOrderDetailDialogOpen] = useState(false);
  const [walletDialogOpen, setWalletDialogOpen] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
  const [selectedPharmacy, setSelectedPharmacy] = useState<Pharmacy | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [prescriptionImage, setPrescriptionImage] = useState<string | null>(null);
  const [customerPhone, setCustomerPhone] = useState("");
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);

  // MetaMask hook
  const {
    walletAddress,
    network,
    balance,
    isConnected,
    isMetaMaskInstalled,
    isLoading: isMetaMaskLoading,
    transactions,
    connect: connectWallet,
    disconnect: disconnectWallet,
    lockAmount,
    releaseAmount,
    refundAmount,
    chargePenalty,
    addFunds,
    resetBalance,
    PENALTY_RATE,
  } = useMetaMask();

  const categories = [
    { id: "all", name: "All Medicines", icon: Pill },
    { id: "pain-relief", name: "Pain Relief", icon: Shield },
    { id: "vitamins", name: "Vitamins", icon: Heart },
    { id: "diabetes", name: "Diabetes", icon: Activity },
    { id: "heart", name: "Heart Care", icon: Heart },
    { id: "antibiotics", name: "Antibiotics", icon: Zap },
    { id: "cold-fever", name: "Cold & Fever", icon: Zap },
    { id: "digestive", name: "Digestive Health", icon: Activity },
  ];

  useEffect(() => {
    const extendedMedicines: Medicine[] = [
      {
        id: "1",
        name: "Paracetamol 500mg",
        brand: "Crocin",
        price: 25,
        image: "/api/placeholder/100/100",
        inStock: true,
        rating: 4.5,
        category: "pain-relief",
        requiresPrescription: false,
        dosage: "500mg",
        packSize: "15 tablets",
        pharmacyName: "MedPlus",
        manufacturer: "GSK",
        description: "Fever and pain relief medicine"
      },
      {
        id: "2",
        name: "Vitamin D3 60K IU",
        brand: "Uprise D3",
        price: 85,
        image: "/api/placeholder/100/100",
        inStock: true,
        rating: 4.3,
        category: "vitamins",
        requiresPrescription: false,
        dosage: "60K IU",
        packSize: "4 capsules",
        pharmacyName: "Apollo Pharmacy",
        manufacturer: "Alkem",
        description: "Bone health and immunity booster"
      },
      {
        id: "3",
        name: "Metformin 500mg",
        brand: "Glucophage",
        price: 45,
        image: "/api/placeholder/100/100",
        inStock: true,
        rating: 4.2,
        category: "diabetes",
        requiresPrescription: true,
        dosage: "500mg",
        packSize: "30 tablets",
        pharmacyName: "1mg Pharmacy",
        manufacturer: "Merck",
        description: "Blood sugar control medication"
      },
      {
        id: "4",
        name: "Amoxicillin 250mg",
        brand: "Amoxil",
        price: 120,
        image: "/api/placeholder/100/100",
        inStock: true,
        rating: 4.1,
        category: "antibiotics",
        requiresPrescription: true,
        dosage: "250mg",
        packSize: "10 capsules",
        pharmacyName: "Apollo Pharmacy",
        manufacturer: "Cipla",
        description: "Bacterial infection treatment"
      },
      {
        id: "5",
        name: "Aspirin 75mg",
        brand: "Disprin",
        price: 15,
        image: "/api/placeholder/100/100",
        inStock: true,
        rating: 4.0,
        category: "heart",
        requiresPrescription: false,
        dosage: "75mg",
        packSize: "14 tablets",
        pharmacyName: "MedPlus",
        manufacturer: "GSK",
        description: "Heart health and blood thinner"
      },
    ];

    const mockPharmacies: Pharmacy[] = [
      {
        id: "1",
        name: "MedPlus",
        image: "/api/placeholder/80/80",
        rating: 4.5,
        distance: 0.8,
        address: "Near City Mall, MG Road",
        isOpen: true,
        deliveryTime: "15 mins",
        phone: "+91-9876543210",
      },
      {
        id: "2",
        name: "Apollo Pharmacy",
        image: "/api/placeholder/80/80",
        rating: 4.3,
        distance: 1.2,
        address: "Commercial Street",
        isOpen: true,
        deliveryTime: "25 mins",
        phone: "+91-9876543211",
      },
      {
        id: "3",
        name: "1mg Pharmacy",
        image: "/api/placeholder/80/80",
        rating: 4.1,
        distance: 1.8,
        address: "Brigade Road",
        isOpen: true,
        deliveryTime: "30 mins",
        phone: "+91-9876543212",
      },
    ];

    setMedicines(extendedMedicines);
    setPharmacies(mockPharmacies);

    // Load orders from localStorage
    const savedOrders = localStorage.getItem("userOrders");
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("userOrders", JSON.stringify(orders));
  }, [orders]);

  const totalCartAmount = cart.reduce((sum, item) => {
    const multiplier = item.quantityType === 'double' ? 1.8 : item.quantityType === 'half' ? 0.6 : 1;
    return sum + (item.medicine.price * multiplier * item.quantity);
  }, 0);

  const totalWithDelivery = totalCartAmount + DELIVERY_FEE;

  const filteredMedicines = medicines.filter(medicine => {
    const matchesSearch = medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          medicine.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          medicine.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || medicine.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (medicine: Medicine, quantityType: 'single' | 'double' | 'half') => {
    setCart(prev => {
      const existing = prev.find(item => 
        item.medicine.id === medicine.id && item.quantityType === quantityType
      );
      if (existing) {
        return prev.map(item =>
          item.medicine.id === medicine.id && item.quantityType === quantityType
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { medicine, quantity: 1, quantityType }];
    });
    toast.success(`${medicine.name} (${quantityType}) added to cart!`);
    setQuantityDialogOpen(false);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPrescriptionImage(e.target?.result as string);
        toast.success("Prescription uploaded successfully!");
      };
      reader.readAsDataURL(file);
    }
  };

  const openQuantityDialog = (medicine: Medicine) => {
    setSelectedMedicine(medicine);
    setQuantityDialogOpen(true);
  };

  const handleConnectWallet = async () => {
    try {
      await connectWallet();
      toast.success("Wallet connected successfully!");
      setWalletDialogOpen(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to connect wallet");
    }
  };

  const placeOrderWithPharmacy = (pharmacy: Pharmacy) => {
    if (!prescriptionImage || cart.length === 0) {
      toast.error("Please upload prescription and add medicines first!");
      return;
    }
    
    if (!isConnected) {
      toast.error("Please connect your MetaMask wallet first!");
      setWalletDialogOpen(true);
      return;
    }

    if (balance < totalWithDelivery) {
      toast.error(`Insufficient balance! You have ₹${balance.toFixed(0)}, need ₹${totalWithDelivery.toFixed(0)}`);
      return;
    }

    setSelectedPharmacy(pharmacy);
    setPhoneDialogOpen(true);
  };

  const confirmOrder = async () => {
    if (!customerPhone || !selectedPharmacy || customerPhone.length < 10) {
      toast.error("Please provide valid phone number!");
      return;
    }

    if (!isConnected || !walletAddress) {
      toast.error("Please connect MetaMask wallet first!");
      return;
    }

    setIsProcessingOrder(true);

    try {
      // Lock amount in escrow
      const escrowTxId = `tx_${Date.now()}`;
      await lockAmount(totalWithDelivery, escrowTxId);

      const newOrder: Order = {
        id: `order-${Date.now()}`,
        items: [...cart],
        pharmacy: selectedPharmacy,
        customerPhone: customerPhone,
        totalAmount: totalCartAmount,
        totalWithDelivery: totalWithDelivery,
        deliveryFee: DELIVERY_FEE,
        status: 'paid_locked',
        orderDate: new Date().toISOString(),
        estimatedDelivery: selectedPharmacy.deliveryTime,
        prescriptionImage: prescriptionImage || undefined,
        // Escrow fields
        walletAddress: walletAddress,
        escrowLockedAmount: totalWithDelivery,
        escrowTransactionId: escrowTxId,
        escrowStatus: 'locked',
        collectionDeadline: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      };

      setOrders(prev => [...prev, newOrder]);
      setCart([]);
      setPrescriptionImage(null);
      setCustomerPhone("");
      setPhoneDialogOpen(false);
      
      toast.success(
        `Order placed! ₹${totalWithDelivery.toFixed(0)} locked in escrow. Collect within 24hrs.`,
        { duration: 5000 }
      );
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to process payment");
    } finally {
      setIsProcessingOrder(false);
    }
  };

  // Order actions
  const handleCancelOrder = async (order: Order) => {
    if (!['pending_payment', 'paid_locked', 'preparing'].includes(order.status)) {
      toast.error("Order cannot be cancelled at this stage");
      return;
    }

    setIsProcessingOrder(true);
    try {
      const escrowAmount = order.escrowLockedAmount || 0;
      
      if (order.status === 'paid_locked') {
        // Full refund before preparation
        await refundAmount(escrowAmount, order.id);
        toast.success(`Order cancelled! Full refund of ₹${escrowAmount.toFixed(0)} processed.`);
      } else if (order.status === 'preparing') {
        // Partial refund (50% penalty)
        const penaltyAmt = escrowAmount * 0.5;
        const refundAmt = escrowAmount - penaltyAmt;
        await refundAmount(refundAmt, order.id);
        toast.warning(`Order cancelled! ₹${refundAmt.toFixed(0)} refunded (50% penalty applied).`);
      }

      setOrders(prev => prev.map(o => 
        o.id === order.id 
          ? { 
              ...o, 
              status: 'cancelled' as OrderStatus,
              escrowStatus: order.status === 'paid_locked' ? 'refunded' : 'partial_refund',
              refundAmount: order.status === 'paid_locked' ? escrowAmount : escrowAmount * 0.5,
              penaltyAmount: order.status === 'paid_locked' ? 0 : escrowAmount * 0.5,
            }
          : o
      ));
      setOrderDetailDialogOpen(false);
    } catch (error) {
      toast.error("Failed to cancel order");
    } finally {
      setIsProcessingOrder(false);
    }
  };

  const handleMarkCollected = async (order: Order) => {
    if (order.status !== 'out_for_delivery') {
      toast.error("Order must be out for delivery to mark as collected");
      return;
    }

    setIsProcessingOrder(true);
    try {
      // Release escrow to pharmacy
      await releaseAmount(order.escrowLockedAmount || 0, order.id);
      
      setOrders(prev => prev.map(o => 
        o.id === order.id 
          ? { ...o, status: 'delivered' as OrderStatus, escrowStatus: 'released' }
          : o
      ));
      
      toast.success("Order marked as delivered! Escrow released to pharmacy.");
      setOrderDetailDialogOpen(false);
    } catch (error) {
      toast.error("Failed to process collection");
    } finally {
      setIsProcessingOrder(false);
    }
  };

  const handleMarkNoShow = async (order: Order) => {
    if (order.status !== 'out_for_delivery') {
      toast.error("Can only mark no-show for orders out for delivery");
      return;
    }

    setIsProcessingOrder(true);
    try {
      const escrowAmount = order.escrowLockedAmount || 0;
      const result = await chargePenalty(escrowAmount, order.id);
      
      setOrders(prev => prev.map(o => 
        o.id === order.id 
          ? { 
              ...o, 
              status: 'no_show' as OrderStatus,
              escrowStatus: 'penalty_applied',
              penaltyAmount: result.penaltyAmount,
              refundAmount: result.refundAmount,
            }
          : o
      ));
      
      toast.warning(
        `No-show recorded! Penalty: ₹${result.penaltyAmount.toFixed(0)}, Refund: ₹${result.refundAmount.toFixed(0)}`,
        { duration: 5000 }
      );
      setOrderDetailDialogOpen(false);
    } catch (error) {
      toast.error("Failed to process no-show");
    } finally {
      setIsProcessingOrder(false);
    }
  };

  // Simulate status progression (for demo purposes)
  const simulateNextStatus = (order: Order) => {
    const statusFlow: Record<string, OrderStatus> = {
      'paid_locked': 'preparing',
      'preparing': 'out_for_delivery',
    };
    
    const nextStatus = statusFlow[order.status];
    if (nextStatus) {
      setOrders(prev => prev.map(o => 
        o.id === order.id ? { ...o, status: nextStatus } : o
      ));
      toast.success(`Order status updated to: ${getStatusText(nextStatus)}`);
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'pending_payment': return 'bg-gray-100 text-gray-800';
      case 'paid_locked': return 'bg-blue-100 text-blue-800';
      case 'preparing': return 'bg-orange-100 text-orange-800';
      case 'out_for_delivery': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-emerald-100 text-emerald-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'no_show': return 'bg-amber-100 text-amber-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: OrderStatus) => {
    const icons = {
      pending_payment: <Wallet className="h-6 w-6" />,
      paid_locked: <Lock className="h-6 w-6" />,
      preparing: <Activity className="h-6 w-6" />,
      out_for_delivery: <Truck className="h-6 w-6" />,
      delivered: <CheckCircle2 className="h-6 w-6" />,
      cancelled: <XCircle className="h-6 w-6" />,
      no_show: <AlertTriangle className="h-6 w-6" />
    };
    return icons[status] || <Clock className="h-6 w-6" />;
  };

  const getStatusText = (status: OrderStatus) => {
    const texts = {
      pending_payment: 'Pending Payment',
      paid_locked: 'Payment Locked',
      preparing: 'Preparing',
      out_for_delivery: 'Out for Delivery',
      delivered: 'Delivered & Collected',
      cancelled: 'Cancelled',
      no_show: 'No Show'
    };
    return texts[status] || 'Processing';
  };

  const getEscrowStatusBadge = (order: Order) => {
    if (!order.escrowStatus) return null;
    
    const badges: Record<string, { color: string; text: string }> = {
      locked: { color: 'bg-blue-500', text: '🔒 Escrow Locked' },
      released: { color: 'bg-emerald-500', text: '✅ Released to Pharmacy' },
      refunded: { color: 'bg-green-500', text: '💰 Fully Refunded' },
      partial_refund: { color: 'bg-yellow-500', text: '⚠️ Partial Refund' },
      penalty_applied: { color: 'bg-red-500', text: '❌ Penalty Applied' },
    };
    
    const badge = badges[order.escrowStatus];
    if (!badge) return null;
    
    return (
      <Badge className={`${badge.color} text-white`}>
        {badge.text}
      </Badge>
    );
  };

  return (
    <div className="space-y-8 p-6 lg:p-8 bg-gradient-to-br from-indigo-50 via-white to-blue-50 rounded-3xl border border-indigo-100">
      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-3xl lg:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            💊 Medicines
          </h2>
          <p className="text-xl text-muted-foreground mt-1">Order from nearby pharmacies with MetaMask escrow protection</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          {/* Wallet Status */}
          {isConnected ? (
            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-2xl">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <div className="text-sm">
                <p className="font-medium text-emerald-700">₹{balance.toFixed(0)}</p>
                <p className="text-xs text-emerald-600">{walletAddress?.slice(0, 6)}...{walletAddress?.slice(-4)}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={disconnectWallet} className="h-8 px-2">
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button 
              variant="outline" 
              className="gap-2 rounded-2xl h-12 border-purple-200 hover:bg-purple-50"
              onClick={() => setWalletDialogOpen(true)}
            >
              <Wallet className="h-4 w-4" />
              Connect Wallet
            </Button>
          )}
          <Button 
            variant="outline" 
            className="gap-2 rounded-2xl h-12 flex-1 sm:flex-none"
            onClick={() => setPrescriptionDialogOpen(true)}
          >
            <Camera className="h-4 w-4" />
            Upload Prescription
          </Button>
          <Button className="gap-2 rounded-2xl h-12 bg-gradient-to-r from-primary to-primary/80 shadow-lg flex-1 sm:flex-none">
            <ShoppingCart className="h-4 w-4" />
            Cart ({cart.length}) ₹{totalCartAmount.toFixed(0)}
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 bg-white/50 backdrop-blur-sm border rounded-3xl p-1 shadow-lg">
          <TabsTrigger value="list" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary/80 data-[state=active]:shadow-lg rounded-2xl py-3">
            Medicine List
          </TabsTrigger>
          <TabsTrigger value="pharmacies" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary/80 data-[state=active]:shadow-lg rounded-2xl py-3">
            Pharmacies
          </TabsTrigger>
          <TabsTrigger value="orders" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-green-600 data-[state=active]:shadow-lg rounded-2xl py-3">
            Orders ({orders.length})
          </TabsTrigger>
          <TabsTrigger value="cart" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-orange-600 data-[state=active]:shadow-lg rounded-2xl py-3">
            Cart ({cart.length})
          </TabsTrigger>
          <TabsTrigger value="wallet" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-600 data-[state=active]:shadow-lg rounded-2xl py-3">
            💰 Wallet
          </TabsTrigger>
        </TabsList>

        {/* Medicine List Tab */}
        <TabsContent value="list" className="mt-6">
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex gap-2 flex-1">
              <Input
                placeholder="Search Paracetamol, Crocin, Vitamins..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="rounded-2xl flex-1"
              />
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48 rounded-2xl">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
            {filteredMedicines.map((medicine) => (
              <Card key={medicine.id} className="group hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden border-0 bg-white/70 backdrop-blur-sm hover:bg-white">
                <CardHeader className="p-0 relative overflow-hidden">
                  <img 
                    src={medicine.image} 
                    alt={medicine.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {medicine.requiresPrescription && (
                    <Badge className="absolute top-3 right-3 bg-gradient-to-r from-orange-500 to-red-500 shadow-lg">
                      Rx Required
                    </Badge>
                  )}
                </CardHeader>
                <CardContent className="p-6 pt-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-4 w-4 ${i < Math.floor(medicine.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`} 
                        />
                      ))}
                      <span className="text-sm font-medium ml-1">{medicine.rating}</span>
                    </div>
                  </div>
                  <h3 className="font-bold text-xl leading-tight mb-1 group-hover:text-primary transition-colors">{medicine.name}</h3>
                  <p className="text-sm font-medium text-muted-foreground mb-2">{medicine.brand}</p>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-4">{medicine.description}</p>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-primary">₹{medicine.price}</span>
                      <Badge variant="secondary" className="text-xs">{medicine.packSize}</Badge>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Pill className="h-3 w-3" />
                      {medicine.dosage} | {medicine.manufacturer}
                    </div>
                  </div>
                  <Button 
                    onClick={() => openQuantityDialog(medicine)}
                    className="w-full rounded-2xl h-12 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg font-semibold group-hover:shadow-xl transition-all"
                    disabled={!medicine.inStock}
                  >
                    <PlusIcon className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                    {medicine.inStock ? 'Add to Cart' : 'Out of Stock'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Pharmacies Tab */}
        <TabsContent value="pharmacies" className="mt-6">
          {/* MetaMask Connection Banner */}
          {!isConnected && (
            <Card className="mb-6 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-100 rounded-2xl">
                    <Wallet className="h-8 w-8 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-purple-900">Connect MetaMask for Secure Payments</h3>
                    <p className="text-sm text-purple-700">Your payment is locked in escrow until you collect your order. Auto-refund if not collected!</p>
                  </div>
                  <Button 
                    onClick={() => setWalletDialogOpen(true)}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl"
                  >
                    Connect Wallet
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {pharmacies.map((pharmacy) => (
              <Card key={pharmacy.id} className="group hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 bg-white/70 backdrop-blur-sm hover:bg-white border-0">
                <CardHeader className="p-0 overflow-hidden rounded-t-2xl">
                  <img 
                    src={pharmacy.image} 
                    alt={pharmacy.name}
                    className="w-full h-40 object-cover group-hover:scale-105 transition-transform"
                  />
                </CardHeader>
                <CardContent className="p-6 pt-0">
                  <div className="flex items-center gap-2 mb-3">
                    <h3 className="font-bold text-xl flex-1">{pharmacy.name}</h3>
                    <div className="flex items-center gap-1 text-yellow-500">
                      <Star className="h-5 w-5 fill-current" />
                      <span className="font-semibold">{pharmacy.rating}</span>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm mb-6">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{pharmacy.distance}km away</span>
                    </div>
                    <div className="flex items-center gap-2 text-emerald-600 font-semibold">
                      <Clock className="h-4 w-4" />
                      {pharmacy.deliveryTime}
                    </div>
                  </div>
                  {prescriptionImage && cart.length > 0 ? (
                    <div className="space-y-3">
                      <Button 
                        onClick={() => placeOrderWithPharmacy(pharmacy)}
                        disabled={!isConnected || balance < totalWithDelivery || isMetaMaskLoading}
                        className="w-full rounded-2xl h-12 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 shadow-xl font-semibold disabled:opacity-50"
                      >
                        {isMetaMaskLoading ? (
                          <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        ) : (
                          <Lock className="h-5 w-5 mr-2" />
                        )}
                        {!isConnected ? 'Connect Wallet First' : 
                         balance < totalWithDelivery ? 'Insufficient Balance' :
                         `Lock ₹${totalWithDelivery.toFixed(0)} in Escrow`}
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full rounded-2xl h-11 border-2 border-indigo-200 hover:border-indigo-300"
                        onClick={() => {
                          toast.info(`Calling ${pharmacy.name} at ${pharmacy.phone}...`);
                          window.open(`tel:${pharmacy.phone}`, '_blank');
                        }}
                      >
                        <PhoneCall className="h-4 w-4 mr-2" />
                        Call Before Confirm
                      </Button>
                    </div>
                  ) : (
                    <Button 
                      variant="outline" 
                      className="w-full rounded-2xl h-12"
                      onClick={() => setPrescriptionDialogOpen(true)}
                    >
                      {prescriptionImage ? 'Add Medicines First' : 'Upload Prescription First'}
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Orders Tab */}
        <TabsContent value="orders" className="mt-6">
          {orders.length === 0 ? (
            <Card className="text-center p-16 bg-gradient-to-r from-gray-50 to-gray-100">
              <ShoppingCart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">No orders yet</h3>
              <p className="text-muted-foreground mb-6">Start browsing medicines to place your first order</p>
              <Button className="rounded-2xl" onClick={() => setActiveTab('list')}>
                Browse Medicines
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {orders.slice().reverse().map((order) => (
                <Card 
                  key={order.id}
                  className="group hover:shadow-xl cursor-pointer transition-all border-0 bg-white/70 backdrop-blur-sm hover:bg-white"
                  onClick={() => {
                    setSelectedOrder(order);
                    setOrderDetailDialogOpen(true);
                  }}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-2 rounded-xl ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                      </div>
                      <div className="text-right">
                        <Badge className="bg-gradient-to-r from-primary to-primary/80 shadow">
                          ₹{order.totalWithDelivery?.toFixed(0) || order.totalAmount?.toFixed(0)}
                        </Badge>
                        {order.escrowStatus && (
                          <div className="mt-1">
                            {getEscrowStatusBadge(order)}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2 mb-4">
                      <h3 className="font-bold text-lg">{order.pharmacy.name}</h3>
                      <p className="text-sm text-muted-foreground">{order.estimatedDelivery}</p>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Items: {order.items.length}</span>
                      <span className="font-semibold">{getStatusText(order.status)}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Cart Tab */}
        <TabsContent value="cart" className="mt-6">
          {cart.length === 0 ? (
            <div className="text-center p-16">
              <ShoppingCart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">Your cart is empty</h3>
              <Button className="rounded-2xl" onClick={() => setActiveTab('list')}>
                Start Shopping
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="text-2xl font-bold">Shopping Cart ({cart.length})</h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {cart.map((item, index) => (
                  <div key={`${item.medicine.id}-${item.quantityType}`} className="p-4 border rounded-2xl flex items-center gap-4 hover:bg-gray-50 transition-colors">
                    <img 
                      src={item.medicine.image} 
                      alt={item.medicine.name}
                      className="w-16 h-16 object-cover rounded-xl"
                    />
                    <div className="flex-1 space-y-1">
                      <h4 className="font-semibold">{item.medicine.name}</h4>
                      <p className="text-sm text-muted-foreground">{item.medicine.brand}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.quantity} × {item.quantityType.toUpperCase()} ({item.medicine.dosage})
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">
                        ₹{Math.round(item.medicine.price * (item.quantityType === 'double' ? 1.8 : item.quantityType === 'half' ? 0.6 : 1) * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <Card className="bg-gradient-to-r from-gray-50 to-gray-100">
                <CardContent className="p-6">
                  <div className="space-y-3 text-2xl">
                    <div className="flex justify-between font-bold">
                      <span>Total ({cart.length} items)</span>
                      <span>₹{totalCartAmount.toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between text-lg text-muted-foreground">
                      <span>Delivery Fee</span>
                      <span>₹{DELIVERY_FEE}</span>
                    </div>
                    <div className="h-px bg-muted my-3" />
                    <div className="flex justify-between text-3xl font-bold text-primary">
                      <span>Grand Total</span>
                      <span>₹{totalWithDelivery.toFixed(0)}</span>
                    </div>
                  </div>
                  {isConnected ? (
                    <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                      <div className="flex items-center gap-2 text-emerald-700">
                        <Wallet className="h-5 w-5" />
                        <span className="font-medium">Wallet Balance: ₹{balance.toFixed(0)}</span>
                        {balance < totalWithDelivery && (
                          <Badge variant="destructive" className="ml-auto">Insufficient</Badge>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                      <div className="flex items-center gap-2 text-amber-700">
                        <AlertTriangle className="h-5 w-5" />
                        <span className="font-medium">Connect MetaMask wallet to proceed</span>
                      </div>
                    </div>
                  )}
                  <Button 
                    className="w-full mt-6 rounded-2xl h-14 bg-gradient-to-r from-primary to-primary/90 shadow-xl text-lg font-bold"
                    onClick={() => setActiveTab('pharmacies')}
                  >
                    Proceed to Checkout
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        {/* Wallet Tab */}
        <TabsContent value="wallet" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Wallet Info Card */}
            <Card className="bg-gradient-to-br from-purple-500 to-pink-600 text-white">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Wallet className="h-8 w-8" />
                  <h3 className="text-2xl font-bold">MetaMask Wallet</h3>
                </div>
                {isConnected ? (
                  <div className="space-y-4">
                    <div>
                      <p className="text-purple-200 text-sm">Balance</p>
                      <p className="text-4xl font-bold">₹{balance.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-purple-200 text-sm">Address</p>
                      <p className="font-mono text-sm bg-white/20 px-3 py-2 rounded-xl">
                        {walletAddress}
                      </p>
                    </div>
                    <div>
                      <p className="text-purple-200 text-sm">Network</p>
                      <p className="font-medium">{network}</p>
                    </div>
                    <div className="flex gap-2 pt-4">
                      <Button 
                        variant="secondary" 
                        className="flex-1 rounded-xl"
                        onClick={() => addFunds(1000)}
                      >
                        <DollarSign className="h-4 w-4 mr-2" />
                        Add ₹1000 (Demo)
                      </Button>
                      <Button 
                        variant="secondary" 
                        className="flex-1 rounded-xl"
                        onClick={resetBalance}
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Reset Balance
                      </Button>
                    </div>
                    <Button 
                      variant="outline" 
                      className="w-full rounded-xl bg-white/10 border-white/30 hover:bg-white/20"
                      onClick={disconnectWallet}
                    >
                      Disconnect Wallet
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-purple-200 mb-4">Connect your wallet to manage payments</p>
                    <Button 
                      className="rounded-xl bg-white text-purple-600 hover:bg-purple-50"
                      onClick={handleConnectWallet}
                      disabled={isMetaMaskLoading}
                    >
                      {isMetaMaskLoading ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Wallet className="h-4 w-4 mr-2" />
                      )}
                      Connect MetaMask
                    </Button>
                    {!isMetaMaskInstalled && (
                      <p className="text-xs text-purple-200 mt-4">
                        MetaMask not detected. Please install the extension.
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Transactions Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Transaction History
                </CardTitle>
              </CardHeader>
              <CardContent>
                {transactions.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Clock className="h-12 w-12 mx-auto mb-2 opacity-30" />
                    <p>No transactions yet</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-80 overflow-y-auto">
                    {transactions.slice().reverse().map((tx) => (
                      <div key={tx.id} className="flex items-center gap-3 p-3 border rounded-xl">
                        <div className={`p-2 rounded-xl ${
                          tx.type === 'lock' ? 'bg-blue-100 text-blue-600' :
                          tx.type === 'release' ? 'bg-emerald-100 text-emerald-600' :
                          tx.type === 'refund' ? 'bg-green-100 text-green-600' :
                          'bg-red-100 text-red-600'
                        }`}>
                          {tx.type === 'lock' ? <Lock className="h-4 w-4" /> :
                           tx.type === 'release' ? <Unlock className="h-4 w-4" /> :
                           tx.type === 'refund' ? <RefreshCw className="h-4 w-4" /> :
                           <AlertTriangle className="h-4 w-4" />}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium capitalize">{tx.type}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(tx.timestamp).toLocaleString()}
                          </p>
                        </div>
                        <p className={`font-bold ${
                          tx.type === 'lock' || tx.type === 'penalty' ? 'text-red-600' : 'text-emerald-600'
                        }`}>
                          {tx.type === 'lock' || tx.type === 'penalty' ? '-' : '+'}₹{tx.amount.toFixed(0)}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Escrow Info Card */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-600" />
                  How Escrow Protection Works
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-xl">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Lock className="h-6 w-6 text-blue-600" />
                    </div>
                    <h4 className="font-semibold">1. Lock Payment</h4>
                    <p className="text-xs text-muted-foreground mt-1">Your payment is locked when you place an order</p>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-xl">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Package className="h-6 w-6 text-orange-600" />
                    </div>
                    <h4 className="font-semibold">2. Preparation</h4>
                    <p className="text-xs text-muted-foreground mt-1">Pharmacy prepares your order</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-xl">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Truck className="h-6 w-6 text-purple-600" />
                    </div>
                    <h4 className="font-semibold">3. Delivery</h4>
                    <p className="text-xs text-muted-foreground mt-1">Order is delivered to you</p>
                  </div>
                  <div className="text-center p-4 bg-emerald-50 rounded-xl">
                    <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Unlock className="h-6 w-6 text-emerald-600" />
                    </div>
                    <h4 className="font-semibold">4. Release</h4>
                    <p className="text-xs text-muted-foreground mt-1">Payment released to pharmacy on collection</p>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-amber-800">No-Show Protection</h4>
                      <p className="text-sm text-amber-700">
                        If you don't collect your order within 24 hours, a {(PENALTY_RATE * 100).toFixed(0)}% penalty is applied and {((1 - PENALTY_RATE) * 100).toFixed(0)}% is refunded.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Wallet Connect Dialog */}
      <Dialog open={walletDialogOpen} onOpenChange={setWalletDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              Connect MetaMask Wallet
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Wallet className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Secure Escrow Payments</h3>
              <p className="text-sm text-muted-foreground">
                Connect your MetaMask wallet to lock payments in escrow. 
                Funds are released to pharmacy only after you collect your order.
              </p>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-xl">
                <CheckCircle className="h-5 w-5 text-emerald-600" />
                <span className="text-sm">Full refund if cancelled before preparation</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl">
                <Shield className="h-5 w-5 text-blue-600" />
                <span className="text-sm">24-hour collection window with protection</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-xl">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
                <span className="text-sm">{(PENALTY_RATE * 100).toFixed(0)}% penalty for no-show, rest refunded</span>
              </div>
            </div>

            <Button 
              className="w-full h-14 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-lg font-bold"
              onClick={handleConnectWallet}
              disabled={isMetaMaskLoading || !isMetaMaskInstalled}
            >
              {isMetaMaskLoading ? (
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              ) : (
                <Wallet className="h-5 w-5 mr-2" />
              )}
              {!isMetaMaskInstalled ? 'Install MetaMask Extension' : 'Connect MetaMask'}
            </Button>
            
            {!isMetaMaskInstalled && (
              <p className="text-xs text-center text-muted-foreground">
                <a href="https://metamask.io/download/" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">
                  Download MetaMask
                </a>
                {" "}browser extension to continue
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Prescription Upload Dialog */}
      <Dialog open={prescriptionDialogOpen} onOpenChange={setPrescriptionDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Upload Prescription</DialogTitle>
            <p className="text-sm text-muted-foreground">Required for prescription medicines</p>
          </DialogHeader>
          <div className="space-y-4">
            <div className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all ${prescriptionImage ? 'border-green-300 bg-green-50/50' : 'border-gray-300 hover:border-primary/50'}`}>
              {prescriptionImage ? (
                <div className="space-y-4">
                  <div className="relative">
                    <img 
                      src={prescriptionImage} 
                      alt="Prescription" 
                      className="w-full max-h-64 object-contain rounded-xl shadow-lg"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      className="absolute -top-2 -right-2 rounded-full w-9 h-9 p-0"
                      onClick={() => setPrescriptionImage(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1">Retake Photo</Button>
                    <Button className="flex-1 bg-emerald-500 hover:bg-emerald-600">✅ Uploaded</Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <Upload className="w-16 h-16 mx-auto text-gray-400" />
                  <div>
                    <h3 className="text-xl font-bold mb-2">Drop your prescription here</h3>
                    <p className="text-muted-foreground">Take a clear photo of your prescription for verification</p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="prescription-upload"
                  />
                  <Button 
                    className="w-full rounded-xl h-12"
                    onClick={() => document.getElementById('prescription-upload')?.click()}
                  >
                    📷 Choose from Gallery
                  </Button>
                </div>
              )}
            </div>
            <Button 
              className="w-full rounded-xl h-12"
              onClick={() => {
                setPrescriptionDialogOpen(false);
                setActiveTab('pharmacies');
              }}
              disabled={!prescriptionImage}
            >
              Continue to Pharmacies
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Quantity Selection Dialog */}
      <Dialog open={quantityDialogOpen} onOpenChange={setQuantityDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Select Quantity</DialogTitle>
          </DialogHeader>
          {selectedMedicine && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 border rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50">
                <img 
                  src={selectedMedicine.image} 
                  alt={selectedMedicine.name}
                  className="w-20 h-20 object-cover rounded-lg shadow-md"
                />
                <div className="space-y-1">
                  <h3 className="font-semibold text-lg leading-tight">{selectedMedicine.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedMedicine.brand}</p>
                  <p className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full w-fit">
                    {selectedMedicine.pharmacyName}
                  </p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="text-center space-y-1">
                  <p className="text-sm text-muted-foreground">Select quantity type</p>
                </div>
                {[
                  { type: 'single' as const, label: '1 Tablet', multiplier: 1 },
                  { type: 'double' as const, label: '2 Tablets', multiplier: 1.8 },
                  { type: 'half' as const, label: '½ Tablet', multiplier: 0.6 },
                ].map(({ type, label, multiplier }) => {
                  const price = Math.round(selectedMedicine.price * multiplier);
                  return (
                    <Button
                      key={type}
                      variant="outline"
                      className="w-full justify-between h-14 rounded-2xl border-2 hover:border-primary group"
                      onClick={() => addToCart(selectedMedicine, type)}
                    >
                      <div>
                        <div className="font-medium">{label}</div>
                        <div className="text-xs text-muted-foreground">{selectedMedicine.dosage}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg">₹{price}</div>
                        <div className="text-xs text-muted-foreground">
                          per {type === 'half' ? 'half' : type}
                        </div>
                      </div>
                    </Button>
                  );
                })}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Phone Confirmation Dialog */}
      <Dialog open={phoneDialogOpen} onOpenChange={setPhoneDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Order Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-xl">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Package2 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">{selectedPharmacy?.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedPharmacy?.deliveryTime}</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Items ({cart.length})</span>
                  <span>₹{totalCartAmount.toFixed(0)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Delivery</span>
                  <span>₹{DELIVERY_FEE}</span>
                </div>
                <div className="h-px bg-muted my-2" />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total to Lock</span>
                  <span>₹{totalWithDelivery.toFixed(0)}</span>
                </div>
              </div>
            </div>

            {/* Escrow Info */}
            <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl">
              <div className="flex items-center gap-2 text-purple-700 text-sm">
                <Lock className="h-4 w-4" />
                <span>Amount will be locked in escrow until collection</span>
              </div>
            </div>
            
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+91 98765 43210"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2 pt-4">
              <Button
                variant="outline"
                className="flex-1 rounded-xl"
                onClick={() => setPhoneDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl"
                onClick={confirmOrder}
                disabled={!customerPhone || customerPhone.length < 10 || isProcessingOrder}
              >
                {isProcessingOrder ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Lock className="h-4 w-4 mr-2" />
                )}
                Lock ₹{totalWithDelivery.toFixed(0)}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Order Details Dialog */}
      <Dialog open={orderDetailDialogOpen} onOpenChange={setOrderDetailDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order #{selectedOrder?.id.slice(-6)}</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-2xl ${getStatusColor(selectedOrder.status)}`}>
                    {getStatusIcon(selectedOrder.status)}
                  </div>
                  <div>
                    <p className="font-semibold">{getStatusText(selectedOrder.status)}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(selectedOrder.orderDate).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant={selectedOrder.status === 'delivered' ? "default" : "secondary"}>
                    ₹{selectedOrder.totalWithDelivery?.toFixed(0) || selectedOrder.totalAmount?.toFixed(0)}
                  </Badge>
                  {selectedOrder.escrowStatus && (
                    <div className="mt-1">
                      {getEscrowStatusBadge(selectedOrder)}
                    </div>
                  )}
                </div>
              </div>

              {/* Escrow Details */}
              {selectedOrder.escrowLockedAmount && (
                <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
                  <CardContent className="p-4">
                    <h4 className="font-semibold flex items-center gap-2 mb-3">
                      <Wallet className="h-4 w-4" />
                      Escrow Details
                    </h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Locked Amount</p>
                        <p className="font-bold">₹{selectedOrder.escrowLockedAmount.toFixed(0)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Wallet</p>
                        <p className="font-mono text-xs">{selectedOrder.walletAddress?.slice(0, 10)}...</p>
                      </div>
                      {selectedOrder.refundAmount !== null && selectedOrder.refundAmount !== undefined && (
                        <div>
                          <p className="text-muted-foreground">Refund Amount</p>
                          <p className="font-bold text-green-600">₹{selectedOrder.refundAmount.toFixed(0)}</p>
                        </div>
                      )}
                      {selectedOrder.penaltyAmount !== null && selectedOrder.penaltyAmount !== undefined && selectedOrder.penaltyAmount > 0 && (
                        <div>
                          <p className="text-muted-foreground">Penalty</p>
                          <p className="font-bold text-red-600">₹{selectedOrder.penaltyAmount.toFixed(0)}</p>
                        </div>
                      )}
                    </div>
                    {selectedOrder.collectionDeadline && (
                      <div className="mt-3 pt-3 border-t border-purple-200">
                        <p className="text-xs text-muted-foreground">
                          Collection Deadline: {new Date(selectedOrder.collectionDeadline).toLocaleString()}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <img 
                      src={selectedOrder.pharmacy.image} 
                      alt={selectedOrder.pharmacy.name}
                      className="w-14 h-14 rounded-xl object-cover"
                    />
                    <div className="space-y-1 flex-1">
                      <h3 className="font-semibold">{selectedOrder.pharmacy.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPinIcon className="h-4 w-4" />
                        {selectedOrder.pharmacy.address}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {selectedOrder.estimatedDelivery}
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="gap-1">
                      <Phone className="h-4 w-4" />
                      Call
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-3">
                <h4 className="font-semibold flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Order Items ({selectedOrder.items.length})
                </h4>
                {selectedOrder.items.map((item) => (
                  <div key={item.medicine.id} className="p-4 border rounded-xl flex items-center gap-4">
                    <img 
                      src={item.medicine.image} 
                      alt={item.medicine.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1 space-y-1">
                      <p className="font-medium">{item.medicine.name}</p>
                      <p className="text-sm text-muted-foreground">{item.medicine.brand}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.quantity} × {item.quantityType} ({item.medicine.dosage})
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">₹{(item.medicine.price * (item.quantityType === 'double' ? 1.8 : item.quantityType === 'half' ? 0.6 : 1) * item.quantity).toFixed(0)}</p>
                    </div>
                  </div>
                ))}
              </div>

              {selectedOrder.prescriptionImage && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-sm">
                      <FileText className="h-4 w-4" />
                      Prescription
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <img 
                      src={selectedOrder.prescriptionImage} 
                      alt="Prescription"
                      className="w-full max-h-64 object-contain rounded-xl"
                    />
                  </CardContent>
                </Card>
              )}

              {/* Action Buttons */}
              <div className="space-y-3 pt-4 border-t">
                {/* Simulate Status Progression (Demo) */}
                {['paid_locked', 'preparing'].includes(selectedOrder.status) && (
                  <Button 
                    variant="outline" 
                    className="w-full rounded-xl"
                    onClick={() => simulateNextStatus(selectedOrder)}
                  >
                    <Activity className="h-4 w-4 mr-2" />
                    Simulate Next Status (Demo)
                  </Button>
                )}

                {/* Mark as Collected */}
                {selectedOrder.status === 'out_for_delivery' && (
                  <Button 
                    className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-green-600"
                    onClick={() => handleMarkCollected(selectedOrder)}
                    disabled={isProcessingOrder}
                  >
                    {isProcessingOrder ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                    )}
                    Mark as Collected (Release Escrow)
                  </Button>
                )}

                {/* Mark No-Show */}
                {selectedOrder.status === 'out_for_delivery' && (
                  <Button 
                    variant="outline"
                    className="w-full rounded-xl border-amber-300 text-amber-700 hover:bg-amber-50"
                    onClick={() => handleMarkNoShow(selectedOrder)}
                    disabled={isProcessingOrder}
                  >
                    {isProcessingOrder ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 mr-2" />
                    )}
                    Mark No-Show ({(PENALTY_RATE * 100).toFixed(0)}% Penalty)
                  </Button>
                )}

                {/* Cancel Order */}
                {['pending_payment', 'paid_locked', 'preparing'].includes(selectedOrder.status) && (
                  <Button 
                    variant="destructive"
                    className="w-full rounded-xl"
                    onClick={() => handleCancelOrder(selectedOrder)}
                    disabled={isProcessingOrder}
                  >
                    {isProcessingOrder ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Ban className="h-4 w-4 mr-2" />
                    )}
                    Cancel Order {selectedOrder.status === 'preparing' ? '(50% Penalty)' : '(Full Refund)'}
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
