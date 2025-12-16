"use client";

import { useState } from "react";
import { MedicationCard } from "@/components/dashboard/medication-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Mic,
  Clock,
  Calendar,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { mockMedications } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const timeSlots = ["6:00 AM", "8:00 AM", "12:00 PM", "2:00 PM", "6:00 PM", "8:00 PM", "10:00 PM"];

const todaySchedule = [
  { time: "8:00 AM", medicine: "Lisinopril", dosage: "10mg", status: "taken" },
  { time: "9:00 AM", medicine: "Vitamin D3", dosage: "2000 IU", status: "taken" },
  { time: "8:00 PM", medicine: "Lisinopril", dosage: "10mg", status: "pending" },
];

export default function MedicationsPage() {
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const activeMedications = mockMedications.filter((m) => m.isActive);
  const pastMedications = mockMedications.filter((m) => !m.isActive);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            Medications
          </h1>
          <p className="text-muted-foreground">
            Track and manage your medications
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2 rounded-xl">
            <Mic className="h-4 w-4" />
            Voice Add
          </Button>
          <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 rounded-xl bg-primary text-white">
                <Plus className="h-4 w-4" />
                Add Medicine
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Medication</DialogTitle>
              </DialogHeader>
              <form className="mt-4 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Medicine Name</Label>
                  <Input id="name" placeholder="e.g., Lisinopril" className="rounded-xl" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dosage">Dosage</Label>
                    <Input id="dosage" placeholder="e.g., 10mg" className="rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="frequency">Frequency</Label>
                    <Select>
                      <SelectTrigger className="rounded-xl">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="once">Once daily</SelectItem>
                        <SelectItem value="twice">Twice daily</SelectItem>
                        <SelectItem value="thrice">Three times daily</SelectItem>
                        <SelectItem value="asneeded">As needed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Timing</Label>
                  <div className="flex flex-wrap gap-2">
                    {timeSlots.map((slot) => (
                      <Badge
                        key={slot}
                        variant="outline"
                        className="cursor-pointer hover:bg-primary hover:text-white"
                      >
                        {slot}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes (optional)</Label>
                  <Input
                    id="notes"
                    placeholder="e.g., Take with food"
                    className="rounded-xl"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 rounded-xl"
                    onClick={() => setAddDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 rounded-xl bg-primary text-white"
                    onClick={(e) => {
                      e.preventDefault();
                      setAddDialogOpen(false);
                    }}
                  >
                    Add Medicine
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-foreground">
            Today&apos;s Schedule
          </h2>
          <Badge variant="outline" className="gap-1">
            <Calendar className="h-3 w-3" />
            December 20, 2024
          </Badge>
        </div>
        <div className="space-y-3">
          {todaySchedule.map((item, index) => (
            <div
              key={index}
              className={cn(
                "flex items-center justify-between rounded-xl border p-4",
                item.status === "taken"
                  ? "border-success/20 bg-success/5"
                  : item.status === "missed"
                  ? "border-destructive/20 bg-destructive/5"
                  : "border-border bg-white"
              )}
            >
              <div className="flex items-center gap-4">
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full",
                    item.status === "taken"
                      ? "bg-success/10"
                      : item.status === "missed"
                      ? "bg-destructive/10"
                      : "bg-muted"
                  )}
                >
                  {item.status === "taken" ? (
                    <CheckCircle2 className="h-5 w-5 text-success" />
                  ) : item.status === "missed" ? (
                    <XCircle className="h-5 w-5 text-destructive" />
                  ) : (
                    <Clock className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-foreground">
                    {item.medicine} - {item.dosage}
                  </p>
                  <p className="text-sm text-muted-foreground">{item.time}</p>
                </div>
              </div>
              {item.status === "pending" && (
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost" className="h-8 gap-1 text-success">
                    <CheckCircle2 className="h-4 w-4" />
                    Taken
                  </Button>
                  <Button size="sm" variant="ghost" className="h-8 gap-1 text-muted-foreground">
                    <XCircle className="h-4 w-4" />
                    Skip
                  </Button>
                </div>
              )}
              {item.status === "taken" && (
                <Badge className="bg-success/10 text-success border-0">Taken</Badge>
              )}
            </div>
          ))}
        </div>
      </div>

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList className="rounded-xl bg-muted p-1">
          <TabsTrigger value="active" className="rounded-lg">
            Active ({activeMedications.length})
          </TabsTrigger>
          <TabsTrigger value="past" className="rounded-lg">
            Past ({pastMedications.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            {activeMedications.map((medication) => (
              <MedicationCard key={medication.id} medication={medication} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="past" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            {pastMedications.map((medication) => (
              <MedicationCard key={medication.id} medication={medication} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
