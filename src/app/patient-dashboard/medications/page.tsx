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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Plus,
  Search,
  MapPin,
  Clock,
  Star,
  Pill,
  Shield,
  Heart,
  Activity,
  Zap,
  Loader2,
  Wallet,
  Bell,
  Volume2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Languages,
  PlayCircle,
  ShoppingCart,
  Package,
  History,
  ShieldCheck,
  UserCog
} from "lucide-react";
import { toast } from "sonner";
import { useMetaMask } from "@/hooks/use-metamask";

// --- Interfaces ---

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

interface Reminder {
  id: string;
  medicineName: string;
  time: string; // HH:MM format
  dosage: string;
  image?: string;
  enabled: boolean;
}

interface CartItem {
  medicine: Medicine;
  quantity: number;
  quantityType: 'half' | 'full' | 'double';
}

interface Order {
  id: string;
  items: CartItem[];
  total: number;
  platformFee?: number; // Added
  date: string;
  status: 'ordered' | 'delivered';
}

const SUPPORTED_LANGUAGES = [
  { code: 'en-US', name: 'English', label: 'Time to take your medication' },
  { code: 'hi-IN', name: 'Hindi', label: 'दवा लेने का समय हो गया है' },
  { code: 'es-ES', name: 'Spanish', label: 'Es hora de tomar su medicina' },
  { code: 'fr-FR', name: 'French', label: 'Il est temps de prendre vos médicaments' },
  { code: 'te-IN', name: 'Telugu', label: 'మందులు వేసుకునే సమయం అయ్యింది' },
  { code: 'ta-IN', name: 'Tamil', label: 'மருந்து எடுத்துக்கொள்ளும் நேரம்' },
  { code: 'kn-IN', name: 'Kannada', label: 'ಔಷಧಿ ತೆಗೆದುಕೊಳ್ಳುವ ಸಮಯವಾಗಿದೆ' },
];

export default function MedicationsSection() {
  const [activeTab, setActiveTab] = useState("list");
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [walletDialogOpen, setWalletDialogOpen] = useState(false);

  // Cart & Orders State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedQuantities, setSelectedQuantities] = useState<Record<string, 'half' | 'full' | 'double'>>({});

  // Reminder State
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [newReminderMed, setNewReminderMed] = useState("");
  const [newReminderTime, setNewReminderTime] = useState("");
  const [newReminderDosage, setNewReminderDosage] = useState("");
  const [newReminderImage, setNewReminderImage] = useState<string | undefined>(undefined);
  const [audioLanguage, setAudioLanguage] = useState("en-US");
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);

  // MetaMask hook
  const {
    walletAddress,
    network,
    balance,
    isConnected,
    isMetaMaskInstalled,
    isLoading: isMetaMaskLoading,
    connect: connectWallet,
    disconnect: disconnectWallet,
    lockAmount,
    refundAmount
  } = useMetaMask();

  const SECURITY_DEPOSIT = 100;
  const [isAdminMode, setIsAdminMode] = useState(false); // Admin simulation state

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
    // Load Voices
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      setAvailableVoices(voices);
    };

    if (typeof window !== 'undefined' && window.speechSynthesis) {
      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    // Mock Data and Loaders
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

    const savedReminders = localStorage.getItem("medicationReminders");
    if (savedReminders) setReminders(JSON.parse(savedReminders));

    const savedLang = localStorage.getItem("medicationAudioLanguage");
    if (savedLang) setAudioLanguage(savedLang);

    // Load Cart/Orders
    const savedCart = localStorage.getItem("medicationCart");
    if (savedCart) setCart(JSON.parse(savedCart));
    const savedOrders = localStorage.getItem("medicationOrders");
    if (savedOrders) setOrders(JSON.parse(savedOrders));

  }, []);

  // Persistence Effects
  useEffect(() => localStorage.setItem("medicationReminders", JSON.stringify(reminders)), [reminders]);
  useEffect(() => localStorage.setItem("medicationAudioLanguage", audioLanguage), [audioLanguage]);
  useEffect(() => localStorage.setItem("medicationCart", JSON.stringify(cart)), [cart]);
  useEffect(() => localStorage.setItem("medicationOrders", JSON.stringify(orders)), [orders]);

  // Check Reminders Effect
  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

      reminders.forEach(reminder => {
        if (reminder.enabled && reminder.time === currentTime && now.getSeconds() === 0) {
          triggerAlarm(reminder);
        }
      });
    };

    const interval = setInterval(checkReminders, 1000);
    return () => clearInterval(interval);
  }, [reminders, audioLanguage]);

  const playChime = () => {
    // Create a simple oscillator beep/chime
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;

    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    // Nice "Ding" sound settings
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.3);

    gain.gain.setValueAtTime(0.5, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  };

  const getNativeVoice = (langCode: string) => {
    // 1. Try exact match (e.g. 'kn-IN')
    let voice = availableVoices.find(v => v.lang === langCode);

    // 2. Try prefix match (e.g. 'kn')
    if (!voice) {
      const shortCode = langCode.split('-')[0];
      voice = availableVoices.find(v => v.lang.startsWith(shortCode));
    }

    return voice;
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = audioLanguage;
      utterance.rate = 0.9;
      utterance.pitch = 1.0;

      const voice = getNativeVoice(audioLanguage);
      if (voice) {
        utterance.voice = voice;
      }

      window.speechSynthesis.speak(utterance);
    }
  };

  const testVoice = () => {
    const selectedLangObj = SUPPORTED_LANGUAGES.find(l => l.code === audioLanguage);
    const text = selectedLangObj?.label || "Test Audio";

    playChime();

    // Small delay to let chime finish start
    setTimeout(() => {
      speakText(text);
      toast.info(`Playing test audio for ${selectedLangObj?.name}...`);
    }, 500);
  };

  const triggerAlarm = (reminder: Reminder) => {
    const selectedLangObj = SUPPORTED_LANGUAGES.find(l => l.code === audioLanguage) || SUPPORTED_LANGUAGES[0];
    const message = `${selectedLangObj.label}: ${reminder.medicineName}`;

    // 1. Vibration
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate([500, 200, 500, 200, 1000]);
    }

    // 2. Chime + Audio/Speech
    playChime();
    setTimeout(() => {
      speakText(message);
    }, 500);

    // 3. Visual Toast
    toast("Medication Reminder!", {
      description: message,
      icon: <Bell className="h-5 w-5 text-primary animate-bounce" />,
      duration: 10000,
      action: {
        label: "I took it",
        onClick: () => {
          window.speechSynthesis.cancel();
          toast.success("Medication mocked as taken!");
        }
      }
    });
  };

  // Ecommerce Logic
  const handleQuantityChange = (medId: string, val: 'half' | 'full' | 'double') => {
    setSelectedQuantities(prev => ({ ...prev, [medId]: val }));
  };

  const addToCart = (medicine: Medicine) => {
    const qtyType = selectedQuantities[medicine.id] || 'full';
    let multiplier = 1;
    if (qtyType === 'half') multiplier = 0.5;
    if (qtyType === 'double') multiplier = 2;

    const newItem: CartItem = {
      medicine,
      quantityType: qtyType,
      quantity: 1
    };

    setCart(prev => [...prev, newItem]);
    toast.success(`Added ${medicine.name} (${qtyType}) to cart`);
  };

  const removeFromCart = (index: number) => {
    setCart(prev => prev.filter((_, i) => i !== index));
  };

  const placeOrder = async () => {
    if (cart.length === 0) return;

    if (!isConnected) {
      toast.error("Please connect your wallet first to pay the security deposit.");
      setWalletDialogOpen(true);
      return;
    }

    // Calculate total bill (user still pays this normally at shop, but deposit is separate/part of it)
    // User requirement: "remove 100 rs ... get it back".
    // This implies the 100rs is a BOND.

    const total = cart.reduce((sum, item) => {
      let mult = 1;
      if (item.quantityType === 'half') mult = 0.5;
      if (item.quantityType === 'double') mult = 2;
      return sum + (item.medicine.price * mult);
    }, 0);

    if (balance < SECURITY_DEPOSIT) {
      toast.error(`Insufficient wallet balance. You need ₹${SECURITY_DEPOSIT} for the security deposit.`);
      return;
    }

    try {
      // Lock FIXED amount
      const success = await lockAmount(SECURITY_DEPOSIT);
      if (!success) throw new Error("Transaction failed");

      const newOrder: Order = {
        id: Date.now().toString(),
        items: [...cart],
        total,
        date: new Date().toLocaleDateString(),
        status: 'ordered'
      };

      setOrders(prev => [newOrder, ...prev]);
      setCart([]);
      setActiveTab("orders");
      toast.success(`Order placed! Security deposit of ₹${SECURITY_DEPOSIT} locked.`);

    } catch (error) {
      toast.error("Failed to process security deposit. Please try again.");
    }
  };

  const handleCollectOrder = async (orderId: string) => {
    try {
      // Refund FIXED amount
      const success = await refundAmount(SECURITY_DEPOSIT);
      if (!success) throw new Error("Refund failed");

      setOrders(prev => prev.map(order =>
        order.id === orderId ? { ...order, status: 'delivered' } : order
      ));
      toast.success(`Order collected! Deposit of ₹${SECURITY_DEPOSIT} refunded.`);
    } catch (error) {
      toast.error("Failed to process refund. Please try again.");
    }
  };

  const filteredMedicines = medicines.filter(medicine => {
    const matchesSearch = medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      medicine.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      medicine.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || medicine.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddReminder = () => {
    if (!newReminderMed || !newReminderTime) {
      toast.error("Please fill in medicine name and time");
      return;
    }

    const reminder: Reminder = {
      id: Date.now().toString(),
      medicineName: newReminderMed,
      time: newReminderTime,
      dosage: newReminderDosage || "As prescribed",
      image: newReminderImage,
      enabled: true
    };

    setReminders(prev => [...prev, reminder]);
    setNewReminderMed("");
    setNewReminderTime("");
    setNewReminderDosage("");
    setNewReminderImage(undefined);
    toast.success("Reminder set successfully!");
  };

  const handleDeleteReminder = (id: string) => {
    setReminders(prev => prev.filter(r => r.id !== id));
    toast.success("Reminder deleted");
  };

  const quickAddReminder = (medicine: Medicine) => {
    setNewReminderMed(medicine.name);
    setNewReminderDosage(medicine.dosage);
    setNewReminderImage(medicine.image);
    setActiveTab("timings");
    toast.info("Set a time for your medication");
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

  return (
    <div className="space-y-8 p-6 lg:p-8 bg-gradient-to-br from-indigo-50 via-white to-blue-50 rounded-3xl border border-indigo-100">
      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-3xl lg:text-4xl font-bold text-black">
            💊 Medicines & Timings
          </h2>
          <p className="text-xl text-muted-foreground mt-1">Manage your medication schedule and find pharmacies</p>
        </div>
        <div className="flex gap-3 items-center">
          {/* Cart Button */}
          <Button
            className="rounded-2xl relative bg-white text-primary border border-primary/20 hover:bg-primary/5"
            variant="outline"
            onClick={() => setActiveTab("cart")}
          >
            <ShoppingCart className="h-5 w-5" />
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {cart.length}
              </span>
            )}
          </Button>

          {isConnected ? (
            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-2xl">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <div className="text-sm">
                <p className="font-medium text-emerald-700">₹{balance.toFixed(0)}</p>
                <p className="text-xs text-emerald-600">{walletAddress?.slice(0, 6)}...{walletAddress?.slice(-4)}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={disconnectWallet} className="h-8 px-2">
                <Wallet className="h-4 w-4" />
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
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 bg-muted/50 p-1 rounded-xl">
          <TabsTrigger
            value="list"
            className="rounded-lg py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
          >
            Medicine List
          </TabsTrigger>
          <TabsTrigger
            value="pharmacies"
            className="rounded-lg py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
          >
            Pharmacies
          </TabsTrigger>

          <TabsTrigger
            value="timings"
            className="rounded-lg py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
          >
            Timings
          </TabsTrigger>
          <TabsTrigger
            value="wallet"
            className="rounded-lg py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
          >
            Wallet
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
                    <Badge className="absolute top-3 right-3 bg-red-500 shadow-lg">
                      Rx Required
                    </Badge>
                  )}
                </CardHeader>
                <CardContent className="p-6 pt-0">
                  <div className="mt-4 flex items-center justify-between">
                    <h3 className="font-bold text-xl">{medicine.name}</h3>
                    <div className="flex items-center gap-1 text-yellow-500">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="text-sm font-medium">{medicine.rating}</span>
                    </div>
                  </div>
                  <p className="text-sm font-medium text-muted-foreground">{medicine.brand}</p>
                  <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{medicine.description}</p>

                  <div className="flex items-center justify-between mt-4 mb-4">
                    <span className="text-2xl font-bold text-primary">₹{medicine.price}</span>
                    <Badge variant="secondary">{medicine.packSize}</Badge>
                  </div>

                  {/* Quantity and Actions */}
                  <div className="space-y-3">
                    <Select
                      value={selectedQuantities[medicine.id] || 'full'}
                      onValueChange={(val: any) => handleQuantityChange(medicine.id, val)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Quantity" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="half">Half Sheet (50% Price)</SelectItem>
                        <SelectItem value="full">Full Sheet (Standard)</SelectItem>
                        <SelectItem value="double">2 Sheets (2x Price)</SelectItem>
                      </SelectContent>
                    </Select>

                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        className="w-full"
                        onClick={() => addToCart(medicine)}
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Add
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full border-orange-200 text-orange-700 hover:bg-orange-50 hover:border-orange-300"
                        onClick={() => quickAddReminder(medicine)}
                      >
                        <Clock className="h-4 w-4 mr-2" />
                        Remind
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Cart Tab */}
        <TabsContent value="cart" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-6 w-6 text-primary" />
                Your Cart
              </CardTitle>
            </CardHeader>
            <CardContent>
              {cart.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-20" />
                  <p>Your cart is empty.</p>
                  <Button variant="link" onClick={() => setActiveTab('list')}>Browse Medicines</Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {cart.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
                      <div className="flex items-center gap-4">
                        <img src={item.medicine.image} alt={item.medicine.name} className="w-16 h-16 rounded-lg object-cover" />
                        <div>
                          <h4 className="font-bold">{item.medicine.name}</h4>
                          <Badge variant="outline" className="capitalize">{item.quantityType} Sheet</Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-bold text-lg">
                          ₹{(item.medicine.price * (item.quantityType === 'half' ? 0.5 : item.quantityType === 'double' ? 2 : 1)).toFixed(0)}
                        </span>
                        <Button variant="ghost" size="icon" onClick={() => removeFromCart(idx)} className="text-red-500">
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  <div className="pt-6 border-t space-y-3">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Subtotal</span>
                      <span>₹{cart.reduce((sum, item) => sum + (item.medicine.price * (item.quantityType === 'half' ? 0.5 : item.quantityType === 'double' ? 2 : 1)), 0).toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Platform Fee (5%)</span>
                      <span>₹{(cart.reduce((sum, item) => sum + (item.medicine.price * (item.quantityType === 'half' ? 0.5 : item.quantityType === 'double' ? 2 : 1)), 0) * 0.05).toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-xl pt-2 border-t border-dashed">
                      <span>Total Bill</span>
                      <span>₹{(cart.reduce((sum, item) => sum + (item.medicine.price * (item.quantityType === 'half' ? 0.5 : item.quantityType === 'double' ? 2 : 1)), 0) * 1.05).toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-emerald-600 bg-emerald-50 p-2 rounded-lg mt-2">
                      <span className="flex items-center gap-1"><ShieldCheck className="h-3 w-3" /> Security Deposit (Refundable)</span>
                      <span className="font-bold">₹{SECURITY_DEPOSIT}</span>
                    </div>
                  </div>

                  <div className="flex justify-end mt-4">
                    <Button size="lg" onClick={placeOrder} className="px-8 w-full sm:w-auto">
                      Place Order
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Orders Tab */}
        <TabsContent value="orders" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>My Orders</CardTitle>
                <CardDescription>
                  A ₹{SECURITY_DEPOSIT} security deposit is locked for each order and refunded upon collection.
                </CardDescription>
              </div>

              {/* Admin Toggle Simulation */}
              <div className="flex items-center gap-2 bg-muted/50 p-2 rounded-xl border">
                <UserCog className={`h-4 w-4 ${isAdminMode ? 'text-primary' : 'text-muted-foreground'}`} />
                <Label htmlFor="admin-mode" className="text-sm cursor-pointer select-none">Admin Mode</Label>
                <input
                  id="admin-mode"
                  type="checkbox"
                  checked={isAdminMode}
                  onChange={(e) => setIsAdminMode(e.target.checked)}
                  className="h-4 w-4 accent-primary"
                />
              </div>
            </CardHeader>
            <CardContent>
              {orders.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Package className="h-12 w-12 mx-auto mb-4 opacity-20" />
                  <p>No orders history found.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map(order => (
                    <div key={order.id} className="p-4 border rounded-xl flex flex-col sm:flex-row items-center justify-between hover:bg-muted/10 transition-colors gap-4">
                      <div>
                        <p className="font-bold">Order #{order.id.slice(-6)}</p>
                        <p className="text-sm text-muted-foreground">
                          {order.date} • {order.items.length} items • Total Bill: ₹{order.total.toFixed(0)}
                        </p>
                        <div className="text-xs mt-1 text-emerald-600 font-bold flex items-center gap-1">
                          <ShieldCheck className="h-3 w-3" />
                          {order.status === 'delivered' ? `Deposit ₹${SECURITY_DEPOSIT} Refunded` : `Deposit ₹${SECURITY_DEPOSIT} Locked`}
                        </div>
                      </div>
                      <div className="text-right flex items-center gap-4">
                        <div>
                          <Badge variant="secondary" className={order.status === 'delivered' ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}>
                            {order.status === 'delivered' ? 'Collected' : 'Pending Collection'}
                          </Badge>
                        </div>

                        {/* Only show Collect Button in Admin Mode */}
                        {isAdminMode && order.status !== 'delivered' && (
                          <Button
                            size="sm"
                            className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
                            onClick={() => handleCollectOrder(order.id)}
                          >
                            Admin: Verify & Refund
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pharmacies Tab */}
        <TabsContent value="pharmacies" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {pharmacies.map((pharmacy) => (
              <Card key={pharmacy.id} className="group hover:shadow-xl transition-all duration-300 bg-white/70 backdrop-blur-sm hover:bg-white border-0">
                <CardHeader className="p-0 overflow-hidden rounded-t-2xl">
                  <img
                    src={pharmacy.image}
                    alt={pharmacy.name}
                    className="w-full h-40 object-cover group-hover:scale-105 transition-transform"
                  />
                </CardHeader>
                <CardContent className="p-6">
                  <h3 className="font-bold text-xl mb-2">{pharmacy.name}</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{pharmacy.distance}km away</span>
                    </div>
                    <div className="flex items-center gap-2 text-emerald-600 font-semibold">
                      <Clock className="h-4 w-4" />
                      {pharmacy.deliveryTime} delivery
                    </div>
                  </div>
                  <Button className="w-full mt-4 rounded-xl" variant="outline">
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Timings Tab */}
        <TabsContent value="timings" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Add Reminder Form */}
            <Card className="lg:col-span-1 h-fit">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Add New Reminder
                </CardTitle>
                <CardDescription>
                  Set a time to take your medicine. We'll alert you.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Language Selection */}
                <div className="space-y-3 p-4 bg-muted/30 rounded-xl border">
                  <div className="flex items-center justify-between">
                    <Label className="flex items-center gap-2 text-primary font-semibold">
                      <Languages className="h-4 w-4" />
                      Audio Language
                    </Label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={testVoice}
                      className="h-8 gap-2 bg-white"
                    >
                      <PlayCircle className="h-3 w-3" />
                      Test Voice
                    </Button>
                  </div>

                  <Select value={audioLanguage} onValueChange={setAudioLanguage}>
                    <SelectTrigger className="w-full bg-white">
                      <SelectValue placeholder="Select Language" />
                    </SelectTrigger>
                    <SelectContent>
                      {SUPPORTED_LANGUAGES.map((lang) => (
                        <SelectItem key={lang.code} value={lang.code}>
                          {lang.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Native Voice Status Indicator */}
                  {availableVoices.length > 0 && (
                    <div className="flex items-center gap-2 text-xs">
                      {getNativeVoice(audioLanguage) ? (
                        <><CheckCircle2 className="h-3 w-3 text-emerald-600" /><span className="text-emerald-600">Native voice available</span></>
                      ) : (
                        <><AlertCircle className="h-3 w-3 text-amber-500" /><span className="text-amber-500">Native voice not found - using default</span></>
                      )}
                    </div>
                  )}

                  <p className="text-xs text-muted-foreground">
                    "Ding" sound plays before the voice alert.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Medicine Name</Label>
                  <div className="flex gap-2">
                    {newReminderImage && (
                      <img src={newReminderImage} alt="Preview" className="w-10 h-10 rounded-lg object-cover bg-white border" />
                    )}
                    <Input
                      placeholder="e.g. Paracetamol"
                      value={newReminderMed}
                      onChange={(e) => setNewReminderMed(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Dosage (Optional)</Label>
                  <Input
                    placeholder="e.g. 1 Tablet after food"
                    value={newReminderDosage}
                    onChange={(e) => setNewReminderDosage(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Time</Label>
                  <Input
                    type="time"
                    value={newReminderTime}
                    onChange={(e) => setNewReminderTime(e.target.value)}
                  />
                </div>
                <Button className="w-full" onClick={handleAddReminder}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Reminder
                </Button>
              </CardContent>
            </Card>

            {/* Reminders List */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Your Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                {reminders.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Bell className="h-12 w-12 mx-auto mb-4 opacity-20" />
                    <p>No reminders set yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reminders.sort((a, b) => a.time.localeCompare(b.time)).map((reminder) => (
                      <div
                        key={reminder.id}
                        className="flex items-center justify-between p-4 bg-white border rounded-2xl shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-primary/10 rounded-xl text-primary font-bold text-lg">
                            {reminder.time}
                          </div>
                          {reminder.image ? (
                            <img src={reminder.image} alt={reminder.medicineName} className="w-12 h-12 rounded-xl object-cover bg-gray-50 border" />
                          ) : (
                            <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center text-orange-500">
                              <Pill className="h-6 w-6" />
                            </div>
                          )}
                          <div>
                            <h4 className="font-bold text-lg">{reminder.medicineName}</h4>
                            <p className="text-sm text-muted-foreground">{reminder.dosage}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleDeleteReminder(reminder.id)}
                          >
                            <Trash2 className="h-5 w-5" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Wallet Tab */}
        <TabsContent value="wallet" className="mt-6">
          <Card className="bg-white border rounded-3xl shadow-sm text-black">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-8 border-b pb-6">
                <div className="p-3 bg-emerald-100 rounded-2xl">
                  <Wallet className="h-8 w-8 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">MetaMask Wallet</h3>
                  <p className="text-muted-foreground">Secure payments for your orders</p>
                </div>
              </div>

              {isConnected ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100">
                      <p className="text-emerald-700 text-sm font-medium mb-1">Available Balance</p>
                      <p className="text-4xl font-bold text-emerald-600">₹{balance.toFixed(2)}</p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <p className="text-muted-foreground text-sm font-medium mb-1">Wallet Address</p>
                        <div className="font-mono text-sm bg-gray-50 px-4 py-3 rounded-xl border border-gray-100 flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-emerald-500" />
                          {walletAddress}
                        </div>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-sm font-medium mb-1">Network</p>
                        <div className="font-medium flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-xl w-fit">
                          <Activity className="h-4 w-4 text-emerald-600" />
                          {network}
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full rounded-xl border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 mt-4"
                    onClick={disconnectWallet}
                  >
                    Disconnect Wallet
                  </Button>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Wallet className="h-8 w-8 text-emerald-600" />
                  </div>
                  <h4 className="text-xl font-bold mb-2">Connect Your Wallet</h4>
                  <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                    Connect your MetaMask wallet to securely manage order payments and receive refunds instantly.
                  </p>
                  <Button
                    className="rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 shadow-md shadow-emerald-200 font-bold px-8 h-12 text-lg"
                    onClick={handleConnectWallet}
                    disabled={isMetaMaskLoading}
                  >
                    {isMetaMaskLoading ? (
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    ) : (
                      <Wallet className="h-5 w-5 mr-2" />
                    )}
                    Connect MetaMask
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>

      {/* Wallet Dialog */}
      <Dialog open={walletDialogOpen} onOpenChange={setWalletDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Connect Wallet</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Button
              className="w-full h-12 rounded-xl bg-orange-500 hover:bg-orange-600"
              onClick={handleConnectWallet}
              disabled={isMetaMaskLoading}
            >
              Connect with MetaMask
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
