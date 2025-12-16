"use client";

import { useState } from "react";
import { StatCard } from "@/components/dashboard/stat-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DollarSign,
  TrendingUp,
  Users,
  Receipt,
  Download,
  Filter,
  Calendar,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";

const revenueData = [
  { id: 1, patient: "Sarah Johnson", service: "Consultation", amount: 150, date: "2024-12-20", status: "paid" },
  { id: 2, patient: "Robert Miller", service: "Follow-up", amount: 100, date: "2024-12-20", status: "pending" },
  { id: 3, patient: "Lisa Anderson", service: "Lab Review", amount: 75, date: "2024-12-19", status: "paid" },
  { id: 4, patient: "James Wilson", service: "Consultation", amount: 150, date: "2024-12-18", status: "paid" },
  { id: 5, patient: "Emily Davis", service: "Follow-up", amount: 100, date: "2024-12-18", status: "overdue" },
];

export default function DoctorBillingPage() {
  const [dateFilter, setDateFilter] = useState("today");

  const todayRevenue = 425;
  const monthRevenue = 12850;
  const pendingAmount = 200;
  const patientsToday = 4;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            Billing & Revenue
          </h1>
          <p className="text-muted-foreground">
            Track earnings and manage invoices
          </p>
        </div>
        <Button variant="outline" className="gap-2 rounded-xl">
          <Download className="h-4 w-4" />
          Export Report
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Today's Revenue"
          value={`$${todayRevenue}`}
          subtitle="4 consultations"
          icon={DollarSign}
          variant="primary"
        />
        <StatCard
          title="Monthly Revenue"
          value={`$${monthRevenue.toLocaleString()}`}
          subtitle="December 2024"
          icon={TrendingUp}
          variant="success"
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Pending Payments"
          value={`$${pendingAmount}`}
          subtitle="2 invoices"
          icon={Clock}
          variant="warning"
        />
        <StatCard
          title="Patients Today"
          value={patientsToday}
          subtitle="3 completed"
          icon={Users}
          variant="info"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-border bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold text-foreground">
                Revenue Overview
              </h2>
              <Select defaultValue="week">
                <SelectTrigger className="w-32 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end justify-between gap-2 h-48">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => {
                const heights = [60, 80, 45, 70, 90, 30, 0];
                return (
                  <div key={day} className="flex flex-1 flex-col items-center gap-2">
                    <div
                      className="w-full rounded-t-lg bg-gradient-to-t from-primary to-teal-400"
                      style={{ height: `${heights[i]}%` }}
                    />
                    <span className="text-xs text-muted-foreground">{day}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-foreground">
              Recent Transactions
            </h2>
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-40 rounded-xl">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-2xl border border-border bg-white overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="font-semibold">Patient</TableHead>
                  <TableHead className="font-semibold">Service</TableHead>
                  <TableHead className="font-semibold">Date</TableHead>
                  <TableHead className="font-semibold">Amount</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {revenueData.map((item) => (
                  <TableRow key={item.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{item.patient}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {item.service}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {item.date}
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold">
                      ${item.amount}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-xs capitalize",
                          item.status === "paid"
                            ? "border-success/20 bg-success/10 text-success"
                            : item.status === "pending"
                            ? "border-warning/20 bg-warning/10 text-warning"
                            : "border-destructive/20 bg-destructive/10 text-destructive"
                        )}
                      >
                        {item.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-white p-6">
            <h3 className="font-display text-lg font-semibold text-foreground">
              Today&apos;s Summary
            </h3>
            <div className="mt-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Consultations</span>
                <span className="font-medium">$300</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Follow-ups</span>
                <span className="font-medium">$100</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Procedures</span>
                <span className="font-medium">$0</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Lab Reviews</span>
                <span className="font-medium">$25</span>
              </div>
              <div className="h-px bg-border" />
              <div className="flex items-center justify-between">
                <span className="font-medium text-foreground">Total</span>
                <span className="font-display text-xl font-bold text-primary">
                  $425
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-gradient-to-br from-primary/5 to-teal-50 p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground">Revenue Insight</p>
                <p className="text-sm text-muted-foreground">
                  Your earnings are up 12% compared to last month. Keep it up!
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-white p-6">
            <h3 className="font-display font-semibold text-foreground">
              Quick Actions
            </h3>
            <div className="mt-4 space-y-2">
              <Button variant="outline" className="w-full justify-start gap-2 rounded-xl">
                <Receipt className="h-4 w-4" />
                Create Invoice
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2 rounded-xl">
                <DollarSign className="h-4 w-4" />
                Record Payment
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2 rounded-xl">
                <Download className="h-4 w-4" />
                Download Statement
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
