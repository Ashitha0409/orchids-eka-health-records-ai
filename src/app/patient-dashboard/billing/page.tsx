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
} from "lucide-react";
import { mockBills } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export default function BillingPage() {
  const [typeFilter, setTypeFilter] = useState("all");

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

      <div className="grid gap-6 lg:grid-cols-3">
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
