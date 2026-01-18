"use client";

import { useState } from "react";
import { BillCard } from "@/components/dashboard/bill-card";
import { StatCard } from "@/components/dashboard/stat-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Receipt,
  DollarSign,
  Clock,
  CheckCircle2,
  Download,
  Filter,
  TrendingUp,
  Shield,
  ShieldCheck, // Added
  Package, // Added
  UserCog, // Added
  ShoppingCart // Added
} from "lucide-react";
import { mockBills } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { useMetaMask } from "@/hooks/use-metamask"; // Added
import { toast } from "sonner"; // Added
import { Label } from "@/components/ui/label"; // Ensure Label is imported
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"; // Ensure Card components are imported
import { Input } from "@/components/ui/input"; // Ensure Input is imported

// Shared Interfaces (duplicated for speed, ideally in a types file)
interface Medicine {
  id: string;
  name: string;
  brand: string;
  price: number;
  image: string;
  // ... other fields optional for billing view
}

interface CartItem {
  medicine: Medicine;
  quantity: number;
  quantityType: 'half' | 'full' | 'double';
}

interface Order {
  id: string;
  items: CartItem[];
  total: number; // This is the Bill Total
  platformFee?: number; // Added
  date: string;
  status: 'ordered' | 'delivered';
}

export default function BillingPage() {
  const [typeFilter, setTypeFilter] = useState("all");

  // Medication Orders State
  const [medOrders, setMedOrders] = useState<Order[]>([]);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const SECURITY_DEPOSIT = 100;

  const { refundAmount } = useMetaMask();

  const paidBills = mockBills.filter((b) => b.status === "paid");
  const unpaidBills = mockBills.filter((b) => b.status === "unpaid");
  const pendingBills = mockBills.filter((b) => b.status === "claim-pending");

  const totalSpent = paidBills.reduce((acc, b) => acc + b.amount, 0);
  const totalPending = unpaidBills.reduce((acc, b) => acc + b.amount, 0);
  const totalInsurance = mockBills.reduce(
    (acc, b) => acc + (b.insuranceCovered || 0),
    0
  );

  const filteredBills =
    typeFilter === "all"
      ? mockBills
      : mockBills.filter((b) => b.type === typeFilter);

  // Load Medication Orders
  useState(() => {
    // Only access localStorage on client
    if (typeof window !== 'undefined') {
      const savedOrders = localStorage.getItem("medicationOrders");
      if (savedOrders) setMedOrders(JSON.parse(savedOrders));
    }
  });

  // Handle Collection/Refund
  const handleCollectOrder = async (orderId: string) => {
    try {
      const success = await refundAmount(SECURITY_DEPOSIT);
      if (!success) throw new Error("Refund failed");

      const updatedOrders = medOrders.map(order =>
        order.id === orderId ? { ...order, status: 'delivered' } : order
      ) as Order[];

      setMedOrders(updatedOrders);
      localStorage.setItem("medicationOrders", JSON.stringify(updatedOrders));
      toast.success(`Order collected! Deposit of ₹${SECURITY_DEPOSIT} refunded.`);
    } catch (error) {
      toast.error("Failed to process refund. Please try again.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            Billing & Expenses
          </h1>
          <p className="text-muted-foreground">
            Track your medical expenses and insurance claims
          </p>
        </div>
        <Button variant="outline" className="gap-2 rounded-xl">
          <Download className="h-4 w-4" />
          Export Report
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Spent"
          value={`$${totalSpent.toFixed(0)}`}
          subtitle="This month"
          icon={DollarSign}
          variant="primary"
        />
        <StatCard
          title="Pending Payment"
          value={`$${totalPending.toFixed(0)}`}
          subtitle={`${unpaidBills.length} bills`}
          icon={Clock}
          variant="warning"
        />
        <StatCard
          title="Insurance Covered"
          value={`$${totalInsurance.toFixed(0)}`}
          subtitle="Total savings"
          icon={Shield}
          variant="success"
        />
        <StatCard
          title="Bills Paid"
          value={paidBills.length}
          subtitle="This month"
          icon={CheckCircle2}
          variant="info"
        />
      </div>

      {/* Medication Orders Section (Moved from Medications Page) */}
      <div className="rounded-2xl border border-indigo-100 bg-white p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <div>
            <h2 className="font-display text-lg font-semibold text-foreground flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-indigo-600" />
              Medication Orders
            </h2>
            <p className="text-sm text-muted-foreground">
              Manage your pharmacy orders and refundable deposits
            </p>
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
        </div>

        {medOrders.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground bg-muted/10 rounded-xl">
            <Package className="h-10 w-10 mx-auto mb-3 opacity-20" />
            <p>No medication orders found.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {medOrders.map(order => (
              <div key={order.id} className="p-4 border rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between hover:bg-muted/5 transition-colors gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-foreground">Order #{order.id.slice(-6)}</p>
                    <Badge variant="outline" className="text-xs">{order.date}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {order.items.length} items • Bill: ₹{order.total.toFixed(0)}
                    {order.platformFee ? ` (incl. ₹${order.platformFee.toFixed(0)} fee)` : ''}
                  </p>
                  <div className="text-xs mt-2 text-emerald-600 font-bold flex items-center gap-1 bg-emerald-50 w-fit px-2 py-1 rounded-md">
                    <ShieldCheck className="h-3 w-3" />
                    {order.status === 'delivered' ? `Deposit ₹${SECURITY_DEPOSIT} Refunded` : `Deposit ₹${SECURITY_DEPOSIT} Locked`}
                  </div>
                </div>
                <div className="text-right flex items-center gap-4 w-full md:w-auto justify-end">
                  <div>
                    <Badge className={cn("px-3 py-1", order.status === 'delivered' ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-emerald-200" : "bg-amber-100 text-amber-700 hover:bg-amber-200 border-amber-200")}>
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
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* ... existing chart logic ... */}

        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-border bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold text-foreground">
                Monthly Spending
              </h2>
              <Select defaultValue="dec">
                <SelectTrigger className="w-32 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dec">December</SelectItem>
                  <SelectItem value="nov">November</SelectItem>
                  <SelectItem value="oct">October</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end justify-between gap-2 h-48">
              {["Hospital", "Lab", "Pharmacy", "Consultation"].map((cat, i) => {
                const heights = [70, 40, 20, 50];
                return (
                  <div key={cat} className="flex flex-1 flex-col items-center gap-2">
                    <div
                      className="w-full rounded-t-lg bg-gradient-to-t from-primary to-teal-400"
                      style={{ height: `${heights[i]}%` }}
                    />
                    <span className="text-xs text-muted-foreground">{cat}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-foreground">
              All Bills
            </h2>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-40 rounded-xl">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="hospital">Hospital</SelectItem>
                <SelectItem value="lab">Lab</SelectItem>
                <SelectItem value="pharmacy">Pharmacy</SelectItem>
                <SelectItem value="consultation">Consultation</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            {filteredBills.map((bill) => (
              <BillCard key={bill.id} bill={bill} />
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-white p-6">
            <h3 className="font-display text-lg font-semibold text-foreground">
              Payment Summary
            </h3>
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Total Bills</span>
                <span className="font-medium">{mockBills.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Paid</span>
                <Badge className="bg-success/10 text-success border-0">
                  {paidBills.length}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Unpaid</span>
                <Badge className="bg-destructive/10 text-destructive border-0">
                  {unpaidBills.length}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Claim Pending</span>
                <Badge className="bg-warning/10 text-warning border-0">
                  {pendingBills.length}
                </Badge>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-gradient-to-br from-primary/5 to-teal-50 p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground">Spending Insight</p>
                <p className="text-sm text-muted-foreground">
                  Your medical expenses decreased by 15% compared to last month
                </p>
              </div>
            </div>
          </div>

          {unpaidBills.length > 0 && (
            <div className="rounded-2xl border border-warning/30 bg-warning/5 p-6">
              <h3 className="font-display font-semibold text-foreground">
                Action Required
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                You have {unpaidBills.length} unpaid bill(s) totaling $
                {totalPending.toFixed(2)}
              </p>
              <Button className="mt-4 w-full gap-2 rounded-xl bg-warning text-white hover:bg-warning/90">
                Pay Now
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
