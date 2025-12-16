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
  Globe,
  Mic,
  Users,
  Plus,
  Trash2,
  Edit,
  Smartphone,
  Mail,
  MessageSquare,
} from "lucide-react";
import { mockPatient } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export default function PatientSettingsPage() {
  const [notifications, setNotifications] = useState({
    email: true,
    sms: true,
    push: true,
    whatsapp: false,
  });

  const [voiceSettings, setVoiceSettings] = useState({
    speed: "normal",
    gender: "female",
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">
          Settings
        </h1>
        <p className="text-muted-foreground">
          Manage your account preferences
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
                  Update your personal details
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  defaultValue={mockPatient.name}
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  defaultValue={mockPatient.email}
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  defaultValue={mockPatient.phone}
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dob">Date of Birth</Label>
                <Input
                  id="dob"
                  type="date"
                  defaultValue={mockPatient.dateOfBirth}
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="blood">Blood Group</Label>
                <Select defaultValue={mockPatient.bloodGroup}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map((bg) => (
                      <SelectItem key={bg} value={bg}>{bg}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button className="mt-4 rounded-xl bg-primary text-white">
              Save Changes
            </Button>
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
                  Choose how you want to be notified
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {[
                { key: "email", label: "Email Notifications", icon: Mail, desc: "Receive updates via email" },
                { key: "sms", label: "SMS Notifications", icon: Smartphone, desc: "Get text message alerts" },
                { key: "push", label: "Push Notifications", icon: Bell, desc: "Browser push notifications" },
                { key: "whatsapp", label: "WhatsApp", icon: MessageSquare, desc: "Messages on WhatsApp" },
              ].map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between rounded-xl border border-border p-4"
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-foreground">{item.label}</p>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
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

          <div className="rounded-2xl border border-border bg-white p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/10">
                <Mic className="h-5 w-5 text-success" />
              </div>
              <div>
                <h2 className="font-display font-semibold text-foreground">
                  Voice Settings
                </h2>
                <p className="text-sm text-muted-foreground">
                  Customize AI voice assistant
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Voice Speed</Label>
                <Select
                  value={voiceSettings.speed}
                  onValueChange={(v) => setVoiceSettings({ ...voiceSettings, speed: v })}
                >
                  <SelectTrigger className="rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="slow">Slow</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="fast">Fast</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Voice Gender</Label>
                <Select
                  value={voiceSettings.gender}
                  onValueChange={(v) => setVoiceSettings({ ...voiceSettings, gender: v })}
                >
                  <SelectTrigger className="rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="male">Male</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-white p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-warning/10">
                  <Users className="h-5 w-5 text-warning" />
                </div>
                <h2 className="font-display font-semibold text-foreground">
                  Family Members
                </h2>
              </div>
              <Button size="sm" variant="outline" className="gap-1 rounded-xl">
                <Plus className="h-4 w-4" />
                Add
              </Button>
            </div>

            <div className="space-y-3">
              {mockPatient.familyMembers?.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between rounded-xl border border-border p-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted font-medium text-muted-foreground text-sm">
                      {member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <p className="font-medium text-foreground text-sm">{member.name}</p>
                      <p className="text-xs text-muted-foreground">{member.relationship}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-destructive">
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-white p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted">
                <Globe className="h-5 w-5 text-muted-foreground" />
              </div>
              <h2 className="font-display font-semibold text-foreground">
                Language
              </h2>
            </div>

            <Select defaultValue="en">
              <SelectTrigger className="rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Spanish</SelectItem>
                <SelectItem value="hi">Hindi</SelectItem>
                <SelectItem value="zh">Chinese</SelectItem>
              </SelectContent>
            </Select>
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
              <Button variant="outline" className="w-full justify-start gap-2 rounded-xl text-destructive hover:text-destructive">
                Delete Account
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
