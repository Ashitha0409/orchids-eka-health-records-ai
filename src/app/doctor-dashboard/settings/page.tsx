"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  User,
  Bell,
  Shield,
  Building2,
  Clock,
  Plus,
  Trash2,
  Edit,
  Smartphone,
  Mail,
  Calendar,
} from "lucide-react";
import { mockDoctor } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export default function DoctorSettingsPage() {
  const [notifications, setNotifications] = useState({
    newAppointment: true,
    cancellation: true,
    reminder: true,
    newPatient: false,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">
          Settings
        </h1>
        <p className="text-muted-foreground">
          Manage your practice preferences
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-border bg-white p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="font-display font-semibold text-foreground">
                  Profile Information
                </h2>
                <p className="text-sm text-muted-foreground">
                  Update your professional details
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  defaultValue={mockDoctor.name}
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  defaultValue={mockDoctor.email}
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  defaultValue={mockDoctor.phone}
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="specialty">Specialty</Label>
                <Input
                  id="specialty"
                  defaultValue={mockDoctor.specialty}
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="registration">Registration Number</Label>
                <Input
                  id="registration"
                  defaultValue={mockDoctor.registrationNumber}
                  className="rounded-xl"
                />
              </div>
            </div>

            <Button className="mt-4 rounded-xl bg-primary text-white">
              Save Changes
            </Button>
          </div>

          <div className="rounded-2xl border border-border bg-white p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/10">
                  <Building2 className="h-5 w-5 text-success" />
                </div>
                <div>
                  <h2 className="font-display font-semibold text-foreground">
                    Clinics & Locations
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Manage your practice locations
                  </p>
                </div>
              </div>
              <Button size="sm" variant="outline" className="gap-1 rounded-xl">
                <Plus className="h-4 w-4" />
                Add Clinic
              </Button>
            </div>

            <div className="space-y-3">
              {mockDoctor.clinics?.map((clinic) => (
                <div
                  key={clinic.id}
                  className="flex items-center justify-between rounded-xl border border-border p-4"
                >
                  <div>
                    <p className="font-medium text-foreground">{clinic.name}</p>
                    <p className="text-sm text-muted-foreground">{clinic.address}</p>
                    <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {clinic.timings}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-white p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-info/10">
                <Bell className="h-5 w-5 text-info" />
              </div>
              <div>
                <h2 className="font-display font-semibold text-foreground">
                  Notifications
                </h2>
                <p className="text-sm text-muted-foreground">
                  Choose what updates you receive
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {[
                { key: "newAppointment", label: "New Appointments", desc: "When a patient books" },
                { key: "cancellation", label: "Cancellations", desc: "When appointments are cancelled" },
                { key: "reminder", label: "Daily Reminders", desc: "Morning schedule summary" },
                { key: "newPatient", label: "New Patients", desc: "When new patients register" },
              ].map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between rounded-xl border border-border p-4"
                >
                  <div>
                    <p className="font-medium text-foreground">{item.label}</p>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                  <Switch
                    checked={notifications[item.key as keyof typeof notifications]}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, [item.key]: checked })
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-white p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-warning/10">
                <Calendar className="h-5 w-5 text-warning" />
              </div>
              <h2 className="font-display font-semibold text-foreground">
                Appointment Settings
              </h2>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Default Duration</Label>
                <Select defaultValue="30">
                  <SelectTrigger className="rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="45">45 minutes</SelectItem>
                    <SelectItem value="60">60 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Buffer Time</Label>
                <Select defaultValue="5">
                  <SelectTrigger className="rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">No buffer</SelectItem>
                    <SelectItem value="5">5 minutes</SelectItem>
                    <SelectItem value="10">10 minutes</SelectItem>
                    <SelectItem value="15">15 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <Label>Allow Online Booking</Label>
                <Switch defaultChecked />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-white p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-destructive/10">
                <Shield className="h-5 w-5 text-destructive" />
              </div>
              <h2 className="font-display font-semibold text-foreground">
                Security
              </h2>
            </div>

            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start gap-2 rounded-xl">
                Change Password
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2 rounded-xl">
                Two-Factor Auth
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2 rounded-xl">
                Active Sessions
              </Button>
            </div>
          </div>

          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6">
            <h3 className="font-display font-semibold text-foreground">
              Need Help?
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Contact our support team for assistance with your account.
            </p>
            <Button className="mt-4 w-full rounded-xl bg-primary text-white">
              Contact Support
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
