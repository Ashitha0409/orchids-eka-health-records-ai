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
} from "lucide-react";
import { toast } from "sonner";

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

interface Order {
  id: string;
  items: CartItem[];
  pharmacy: Pharmacy;
  customerPhone: string;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';
  orderDate: string;
  estimatedDelivery: string;
  prescriptionImage?: string;
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
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
  const [selectedPharmacy, setSelectedPharmacy] = useState<Pharmacy | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [prescriptionImage, setPrescriptionImage] = useState<string | null>(null);
  const [customerPhone, setCustomerPhone] = useState("");

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

  const placeOrderWithPharmacy = (pharmacy: Pharmacy) => {
    if (!prescriptionImage || cart.length === 0) {
      toast.error("Please upload prescription and add medicines first!");
      return;
    }
    setSelectedPharmacy(pharmacy);
    setPhoneDialogOpen(true);
  };

  const confirmOrder = () => {
    if (!customerPhone || !selectedPharmacy || customerPhone.length < 10) {
      toast.error("Please provide valid phone number!");
      return;
    }

    const newOrder: Order = {
      id: `order-${Date.now()}`,
      items: [...cart],
      pharmacy: selectedPharmacy,
      customerPhone: customerPhone,
      totalAmount: totalCartAmount,
      status: 'pending',
      orderDate: new Date().toISOString(),
      estimatedDelivery: selectedPharmacy.deliveryTime,
      prescriptionImage: prescriptionImage
    };

    setOrders(prev => [...prev, newOrder]);
    setCart([]);
    setPrescriptionImage(null);
    setCustomerPhone("");
    setPhoneDialogOpen(false);
    toast.success(`Order #${newOrder.id.slice(-6)} placed with ${selectedPharmacy.name}!`);
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'preparing': return 'bg-orange-100 text-orange-800';
      case 'out_for_delivery': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-emerald-100 text-emerald-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: Order['status']) => {
    const icons = {
      pending: <Loader2 className="h-6 w-6 animate-spin" />,
      confirmed: <CheckCircle className="h-6 w-6" />,
      preparing: <Activity className="h-6 w-6" />,
      'out_for_delivery': <Truck className="h-6 w-6" />,
      delivered: <CheckCircle2 className="h-6 w-6" />,
      cancelled: <XCircle className="h-6 w-6" />
    };
    return icons[status] || <Clock className="h-6 w-6" />;
  };

  const getStatusText = (status: Order['status']) => {
    const texts = {
      pending: 'Order Received',
      confirmed: 'Confirmed',
      preparing: 'Preparing',
      'out_for_delivery': 'Out for Delivery',
      delivered: 'Delivered',
      cancelled: 'Cancelled'
    };
    return texts[status] || 'Processing';
  };

  return (
    <div className="space-y-8 p-6 lg:p-8 bg-gradient-to-br from-indigo-50 via-white to-blue-50 rounded-3xl border border-indigo-100">
      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-3xl lg:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            💊 Medicines
          </h2>
          <p className="text-xl text-muted-foreground mt-1">Order from nearby pharmacies with prescription upload</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
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
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 bg-white/50 backdrop-blur-sm border rounded-3xl p-1 shadow-lg">
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
                        className="w-full rounded-2xl h-12 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 shadow-xl font-semibold"
                      >
                        <CheckCircle2 className="h-5 w-5 mr-2" />
                        Confirm Order ₹{(totalCartAmount + 50).toFixed(0)}
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
                  <CardContent className="p-6 pt-0">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-2 rounded-xl ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                      </div>
                      <Badge className="bg-gradient-to-r from-primary to-primary/80 shadow">
                        ₹{order.totalAmount.toFixed(0)}
                      </Badge>
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
                      <span>₹50</span>
                    </div>
                    <div className="h-px bg-muted my-3" />
                    <div className="flex justify-between text-3xl font-bold text-primary">
                      <span>Grand Total</span>
                      <span>₹{(totalCartAmount + 50).toFixed(0)}</span>
                    </div>
                  </div>
                  <Button className="w-full mt-6 rounded-2xl h-14 bg-gradient-to-r from-primary to-primary/90 shadow-xl text-lg font-bold">
                    Proceed to Checkout
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>

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
                  <span>₹50</span>
                </div>
                <div className="h-px bg-muted my-2" />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>₹{(totalCartAmount + 50).toFixed(0)}</span>
                </div>
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
                disabled={!customerPhone || customerPhone.length < 10}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Place Order ₹{(totalCartAmount + 50).toFixed(0)}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Order Details Dialog */}
      <Dialog open={orderDetailDialogOpen} onOpenChange={setOrderDetailDialogOpen}>
        <DialogContent className="max-w-2xl">
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
                <Badge variant={selectedOrder.status === 'delivered' ? "default" : "secondary"}>
                  ₹{selectedOrder.totalAmount.toFixed(0)}
                </Badge>
              </div>

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
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
