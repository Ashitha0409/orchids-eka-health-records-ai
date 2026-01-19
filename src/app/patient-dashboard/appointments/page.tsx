"use client";

import { useState } from "react";
import { AppointmentCard } from "@/components/dashboard/appointment-card";
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
import { Calendar } from "@/components/ui/calendar";
import {
  Plus,
  CalendarIcon,
  Video,
  Phone,
  MapPin,
  Bell,
  BellOff,
} from "lucide-react";
import { toast } from "sonner";
import { mockAppointments } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const doctors = [
  { id: "d1", name: "Dr. Michael Chen", specialty: "Internal Medicine" },
  { id: "d2", name: "Dr. Emily Watson", specialty: "General Practice" },
  { id: "d3", name: "Dr. Sarah Kim", specialty: "Cardiology" },
];

const timeSlots = [
  "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM",
];

export default function AppointmentsPage() {
  const [bookDialogOpen, setBookDialogOpen] = useState(false);

  // Data State
  const [appointments, setAppointments] = useState(mockAppointments);

  // Form State
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedMode, setSelectedMode] = useState<string>("in-person");
  const [selectedDoctor, setSelectedDoctor] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [visitReason, setVisitReason] = useState<string>("");
  const [remindersEnabled, setRemindersEnabled] = useState(true);

  // Derived State
  const upcomingAppointments = appointments.filter(
    (a) => a.status === "confirmed" || a.status === "pending"
  );
  const pastAppointments = appointments.filter(
    (a) => a.status === "completed" || a.status === "cancelled" || a.status === "missed"
  );

  const handleBookAppointment = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedDoctor || !selectedDate || !selectedTime || !visitReason) {
      toast.error("Please fill in all details correctly.");
      return;
    }

    const doctor = doctors.find(d => d.id === selectedDoctor);
    if (!doctor) {
      toast.error("Selected doctor not found.");
      return;
    }

    // Formatting Date: mock data is "YYYY-MM-DD".
    const dateStr = selectedDate.toLocaleDateString('en-CA'); // YYYY-MM-DD

    const newAppointment = {
      id: Date.now().toString(),
      patientId: "p1", // Hardcoded for current user
      patientName: "Sarah Johnson",
      doctorId: doctor.id,
      doctorName: doctor.name,
      date: dateStr,
      time: selectedTime,
      mode: selectedMode as "in-person" | "video" | "phone",
      status: "confirmed" as const,
      reason: visitReason,
    };

    setAppointments(prev => [newAppointment, ...prev]);

    toast.success("Appointment booked successfully!", {
      description: `With ${doctor.name} on ${dateStr} at ${selectedTime}`
    });

    // Reset and Close
    setBookDialogOpen(false);
    setSelectedDoctor("");
    setSelectedTime("");
    setVisitReason("");
    setSelectedMode("in-person");
    setSelectedDate(new Date()); // Reset selected date to today
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            Appointments
          </h1>
          <p className="text-muted-foreground">
            Manage your upcoming and past appointments
          </p>
        </div>
        <Dialog open={bookDialogOpen} onOpenChange={setBookDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 rounded-xl bg-primary text-white">
              <Plus className="h-4 w-4" />
              Book Appointment
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Book New Appointment</DialogTitle>
            </DialogHeader>
            <form className="mt-4 space-y-4">
              <div className="space-y-2">
                <Label>Select Doctor</Label>
                <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Choose a doctor" />
                  </SelectTrigger>
                  <SelectContent>
                    {doctors.map((doctor) => (
                      <SelectItem key={doctor.id} value={doctor.id}>
                        <div>
                          <p>{doctor.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {doctor.specialty}
                          </p>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Appointment Mode</Label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: "in-person", label: "In-Person", icon: MapPin },
                    { value: "video", label: "Video", icon: Video },
                    { value: "phone", label: "Phone", icon: Phone },
                  ].map((mode) => (
                    <button
                      key={mode.value}
                      type="button"
                      onClick={() => setSelectedMode(mode.value)}
                      className={cn(
                        "flex flex-col items-center gap-2 rounded-xl border p-3 transition-all",
                        selectedMode === mode.value
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-border hover:border-primary/50"
                      )}
                    >
                      <mode.icon className="h-5 w-5" />
                      <span className="text-xs font-medium">{mode.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Select Date</Label>
                <div className="rounded-xl border p-3">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="mx-auto"
                    disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Select Time</Label>
                <div className="grid grid-cols-4 gap-2">
                  {timeSlots.map((slot) => (
                    <Badge
                      key={slot}
                      variant={selectedTime === slot ? "default" : "outline"}
                      className={cn(
                        "cursor-pointer justify-center py-2 transition-all",
                        selectedTime === slot
                          ? "bg-primary text-white hover:bg-primary/90"
                          : "hover:bg-primary hover:text-white"
                      )}
                      onClick={() => setSelectedTime(slot)}
                    >
                      {slot}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason">Reason for Visit</Label>
                <Input
                  id="reason"
                  placeholder="e.g., Follow-up, Annual checkup"
                  className="rounded-xl"
                  value={visitReason}
                  onChange={(e) => setVisitReason(e.target.value)}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 rounded-xl"
                  onClick={() => setBookDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 rounded-xl bg-primary text-white"
                  onClick={handleBookAppointment}
                >
                  Confirm Booking
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center justify-between rounded-2xl border border-border bg-white p-4">
        <div className="flex items-center gap-3">
          {remindersEnabled ? (
            <Bell className="h-5 w-5 text-primary" />
          ) : (
            <BellOff className="h-5 w-5 text-muted-foreground" />
          )}
          <div>
            <p className="font-medium text-foreground">Appointment Reminders</p>
            <p className="text-sm text-muted-foreground">
              Get notified before your appointments
            </p>
          </div>
        </div>
        <Button
          variant={remindersEnabled ? "default" : "outline"}
          className="rounded-xl"
          onClick={() => setRemindersEnabled(!remindersEnabled)}
        >
          {remindersEnabled ? "Enabled" : "Disabled"}
        </Button>
      </div>

      {/* ... previous content (Reminders Toggle) ... */}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column: Appointment Lists */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="upcoming" className="space-y-4">
            <TabsList className="rounded-xl bg-muted p-1">
              <TabsTrigger value="upcoming" className="rounded-lg">
                Upcoming ({upcomingAppointments.length})
              </TabsTrigger>
              <TabsTrigger value="past" className="rounded-lg">
                Past ({pastAppointments.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="space-y-4">
              {upcomingAppointments.length > 0 ? (
                <div className="space-y-3">
                  {upcomingAppointments.map((appointment) => (
                    <AppointmentCard key={appointment.id} appointment={appointment} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/20 py-16">
                  <CalendarIcon className="h-12 w-12 text-muted-foreground/50" />
                  <p className="mt-4 font-medium text-muted-foreground">
                    No upcoming appointments
                  </p>
                  <Button
                    className="mt-4 gap-2 rounded-xl"
                    onClick={() => setBookDialogOpen(true)}
                  >
                    <Plus className="h-4 w-4" />
                    Book Now
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="past" className="space-y-4">
              <div className="space-y-3">
                {pastAppointments.map((appointment) => (
                  <AppointmentCard key={appointment.id} appointment={appointment} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Column: Calendar */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-white p-4 shadow-sm">
            <h3 className="font-display font-semibold mb-4 flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 text-primary" />
              Calendar
            </h3>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-xl border shadow-sm mx-auto"
              modifiers={{
                appointment: appointments.map(a => new Date(a.date))
              }}
              modifiersStyles={{
                appointment: {
                  backgroundColor: '#ecfdf5', // emerald-50
                  color: '#047857', // emerald-700
                  fontWeight: 'bold',
                  border: '2px solid #10b981' // emerald-500
                }
              }}
            />
            <div className="mt-4 text-xs text-muted-foreground text-center">
              <span className="inline-block w-2 h-2 bg-emerald-500 rounded-full mr-1"></span>
              Green circle indicates scheduled appointment
            </div>
          </div>

          {/* Selected Date Details */}
          {selectedDate && (
            <div className="rounded-2xl border border-border bg-white p-4 animate-in fade-in slide-in-from-top-2">
              <h4 className="font-semibold text-sm mb-3 text-muted-foreground">
                {selectedDate.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
              </h4>

              {appointments.filter(a => new Date(a.date).toDateString() === selectedDate.toDateString()).length > 0 ? (
                <div className="space-y-3">
                  {appointments
                    .filter(a => new Date(a.date).toDateString() === selectedDate.toDateString())
                    .map(apt => (
                      <div key={apt.id} className="flex gap-3 items-start p-3 rounded-xl bg-muted/30 border border-muted">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <div className="font-bold text-primary text-xs flex flex-col items-center leading-none">
                            <span>{apt.time.split(':')[0]}</span>
                            <span className="text-[9px] opacity-70">{apt.time.split(' ')[1]}</span>
                          </div>
                        </div>
                        <div>
                          <p className="font-bold text-sm text-foreground">{apt.doctorName}</p>
                          <p className="text-xs text-muted-foreground">{apt.reason}</p>
                          <Badge variant="outline" className={cn("mt-1 text-[10px] h-5",
                            apt.status === 'confirmed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                              apt.status === 'completed' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                'bg-gray-50 text-gray-700'
                          )}>
                            {apt.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4 italic">
                  No appointments on this day.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
