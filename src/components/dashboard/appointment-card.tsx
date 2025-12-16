"use client";

import { cn } from "@/lib/utils";
import { Appointment } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Video, Phone, MapPin } from "lucide-react";

interface AppointmentCardProps {
  appointment: Appointment;
  showPatient?: boolean;
}

const statusStyles = {
  confirmed: "bg-success/10 text-success border-success/20",
  pending: "bg-warning/10 text-warning border-warning/20",
  completed: "bg-muted text-muted-foreground border-muted",
  cancelled: "bg-destructive/10 text-destructive border-destructive/20",
  missed: "bg-destructive/10 text-destructive border-destructive/20",
};

const modeIcons = {
  "in-person": MapPin,
  video: Video,
  phone: Phone,
};

export function AppointmentCard({
  appointment,
  showPatient = false,
}: AppointmentCardProps) {
  const ModeIcon = modeIcons[appointment.mode];

  return (
    <div className="flex items-center gap-4 rounded-2xl border border-border bg-white p-4 transition-all hover:shadow-md">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
        <ModeIcon className="h-5 w-5 text-primary" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="font-medium text-foreground">
            {showPatient ? appointment.patientName : appointment.doctorName}
          </p>
          <Badge
            variant="outline"
            className={cn("text-xs capitalize", statusStyles[appointment.status])}
          >
            {appointment.status}
          </Badge>
        </div>
        <p className="truncate text-sm text-muted-foreground">
          {appointment.reason}
        </p>
        <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {appointment.date}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {appointment.time}
          </span>
          <span className="capitalize">{appointment.mode}</span>
        </div>
      </div>
    </div>
  );
}
