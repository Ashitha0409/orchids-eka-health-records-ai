"use client";

import { useState } from "react";
import { AppointmentCard } from "@/components/dashboard/appointment-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CalendarIcon,
  Clock,
  Users,
  CheckCircle2,
  XCircle,
  Plus,
  Filter,
} from "lucide-react";
import { mockAppointments } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export default function DoctorAppointmentsPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [statusFilter, setStatusFilter] = useState("all");

  const todayAppointments = mockAppointments.filter(
    (a) => a.date === "2024-12-20" && a.doctorId === "d1"
  );
  const upcomingAppointments = mockAppointments.filter(
    (a) =>
      (a.status === "confirmed" || a.status === "pending") && a.doctorId === "d1"
  );
  const pastAppointments = mockAppointments.filter(
    (a) =>
      (a.status === "completed" || a.status === "cancelled" || a.status === "missed") &&
      a.doctorId === "d1"
  );

  const stats = {
    total: todayAppointments.length,
    confirmed: todayAppointments.filter((a) => a.status === "confirmed").length,
    completed: todayAppointments.filter((a) => a.status === "completed").length,
    pending: todayAppointments.filter((a) => a.status === "pending").length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            Appointments
          </h1>
          <p className="text-muted-foreground">
            Manage your appointment schedule
          </p>
        </div>
        <Button className="gap-2 rounded-xl bg-primary text-white">
          <Plus className="h-4 w-4" />
          New Appointment
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-border bg-white p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Total Today</span>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="mt-2 font-display text-2xl font-bold text-foreground">
            {stats.total}
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-white p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Confirmed</span>
            <CheckCircle2 className="h-4 w-4 text-success" />
          </div>
          <p className="mt-2 font-display text-2xl font-bold text-success">
            {stats.confirmed}
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-white p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Completed</span>
            <Users className="h-4 w-4 text-info" />
          </div>
          <p className="mt-2 font-display text-2xl font-bold text-info">
            {stats.completed}
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-white p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Pending</span>
            <Clock className="h-4 w-4 text-warning" />
          </div>
          <p className="mt-2 font-display text-2xl font-bold text-warning">
            {stats.pending}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="today" className="space-y-4">
            <div className="flex items-center justify-between">
              <TabsList className="rounded-xl bg-muted p-1">
                <TabsTrigger value="today" className="rounded-lg">
                  Today
                </TabsTrigger>
                <TabsTrigger value="upcoming" className="rounded-lg">
                  Upcoming
                </TabsTrigger>
                <TabsTrigger value="past" className="rounded-lg">
                  Past
                </TabsTrigger>
              </TabsList>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40 rounded-xl">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <TabsContent value="today" className="space-y-3">
              {todayAppointments.length > 0 ? (
                todayAppointments.map((appointment) => (
                  <div key={appointment.id} className="relative">
                    <AppointmentCard appointment={appointment} showPatient />
                    <div className="absolute right-4 top-4 flex gap-2">
                      <Button size="sm" variant="ghost" className="h-8 gap-1 text-success">
                        <CheckCircle2 className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-8 gap-1 text-destructive">
                        <XCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/20 py-16">
                  <CalendarIcon className="h-12 w-12 text-muted-foreground/50" />
                  <p className="mt-4 font-medium text-muted-foreground">
                    No appointments today
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="upcoming" className="space-y-3">
              {upcomingAppointments.map((appointment) => (
                <AppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                  showPatient
                />
              ))}
            </TabsContent>

            <TabsContent value="past" className="space-y-3">
              {pastAppointments.map((appointment) => (
                <AppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                  showPatient
                />
              ))}
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-white p-4">
            <h3 className="mb-4 font-display font-semibold text-foreground">
              Calendar
            </h3>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="mx-auto"
            />
          </div>

          <div className="rounded-2xl border border-border bg-white p-4">
            <h3 className="mb-4 font-display font-semibold text-foreground">
              Quick Actions
            </h3>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start gap-2 rounded-xl">
                <Plus className="h-4 w-4" />
                Block Time Slot
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2 rounded-xl">
                <CalendarIcon className="h-4 w-4" />
                View Weekly Schedule
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2 rounded-xl">
                <Users className="h-4 w-4" />
                Send Reminders
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
