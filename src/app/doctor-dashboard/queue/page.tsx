"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  User,
  Phone,
  Video,
  MapPin,
  CheckCircle2,
  XCircle,
  Play,
  AlertCircle,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { mockAppointments } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const queuePatients = [
  {
    id: "q1",
    name: "Sarah Johnson",
    time: "10:00 AM",
    mode: "in-person",
    status: "in-progress",
    reason: "Follow-up for blood pressure",
    waitTime: "5 min",
    checkInTime: "9:55 AM",
  },
  {
    id: "q2",
    name: "Robert Miller",
    time: "11:30 AM",
    mode: "in-person",
    status: "waiting",
    reason: "Diabetes management",
    waitTime: "15 min",
    checkInTime: "11:15 AM",
  },
  {
    id: "q3",
    name: "Lisa Anderson",
    time: "3:00 PM",
    mode: "phone",
    status: "scheduled",
    reason: "Lab results discussion",
    waitTime: null,
    checkInTime: null,
  },
];

const modeIcons = {
  "in-person": MapPin,
  video: Video,
  phone: Phone,
};

const statusColors = {
  "in-progress": "bg-primary text-white",
  waiting: "bg-warning/10 text-warning border-warning/20",
  scheduled: "bg-muted text-muted-foreground",
  completed: "bg-success/10 text-success border-success/20",
};

export default function QueuePage() {
  const [queue, setQueue] = useState(queuePatients);

  const inProgress = queue.find((p) => p.status === "in-progress");
  const waiting = queue.filter((p) => p.status === "waiting");
  const upcoming = queue.filter((p) => p.status === "scheduled");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            Patient Queue
          </h1>
          <p className="text-muted-foreground">
            Manage today&apos;s patient flow
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="gap-2 px-3 py-1.5">
            <Clock className="h-4 w-4" />
            Avg Wait: 12 min
          </Badge>
          <Badge className="gap-2 bg-success/10 text-success border-0 px-3 py-1.5">
            <User className="h-4 w-4" />
            {waiting.length} Waiting
          </Badge>
        </div>
      </div>

      {inProgress && (
        <div className="rounded-2xl border-2 border-primary bg-primary/5 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge className="bg-primary text-white">In Progress</Badge>
              <span className="text-sm text-muted-foreground">
                Started at {inProgress.checkInTime}
              </span>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="gap-2 rounded-xl">
                <XCircle className="h-4 w-4" />
                Cancel
              </Button>
              <Button className="gap-2 rounded-xl bg-success text-white hover:bg-success/90">
                <CheckCircle2 className="h-4 w-4" />
                Complete Visit
              </Button>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-xl font-semibold text-primary shadow-sm">
              {inProgress.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <div>
              <h2 className="font-display text-xl font-semibold text-foreground">
                {inProgress.name}
              </h2>
              <p className="text-muted-foreground">{inProgress.reason}</p>
              <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-3 w-3" />
                {inProgress.time}
                <MapPin className="ml-2 h-3 w-3" />
                {inProgress.mode}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-foreground">
              Waiting ({waiting.length})
            </h2>
            {waiting.length > 0 && (
              <Button size="sm" className="gap-2 rounded-xl bg-primary text-white">
                <Play className="h-4 w-4" />
                Call Next
              </Button>
            )}
          </div>

          {waiting.length > 0 ? (
            <div className="space-y-3">
              {waiting.map((patient, index) => {
                const ModeIcon = modeIcons[patient.mode as keyof typeof modeIcons];
                return (
                  <div
                    key={patient.id}
                    className="flex items-center justify-between rounded-2xl border border-border bg-white p-4 transition-all hover:shadow-md"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-warning/10 font-medium text-warning">
                        #{index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{patient.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {patient.reason}
                        </p>
                        <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {patient.time}
                          </span>
                          <span className="flex items-center gap-1">
                            <ModeIcon className="h-3 w-3" />
                            {patient.mode}
                          </span>
                          <Badge
                            variant="outline"
                            className="border-warning/20 bg-warning/10 text-warning text-xs"
                          >
                            Wait: {patient.waitTime}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                        <ArrowDown className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/20 py-12">
              <CheckCircle2 className="h-12 w-12 text-success/50" />
              <p className="mt-4 font-medium text-muted-foreground">
                No patients waiting
              </p>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h2 className="font-display text-lg font-semibold text-foreground">
            Upcoming ({upcoming.length})
          </h2>

          {upcoming.length > 0 ? (
            <div className="space-y-3">
              {upcoming.map((patient) => {
                const ModeIcon = modeIcons[patient.mode as keyof typeof modeIcons];
                return (
                  <div
                    key={patient.id}
                    className="flex items-center justify-between rounded-2xl border border-border bg-white p-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted font-medium text-muted-foreground">
                        {patient.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{patient.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {patient.reason}
                        </p>
                        <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {patient.time}
                          </span>
                          <span className="flex items-center gap-1">
                            <ModeIcon className="h-3 w-3" />
                            {patient.mode}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      Scheduled
                    </Badge>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/20 py-12">
              <Clock className="h-12 w-12 text-muted-foreground/50" />
              <p className="mt-4 font-medium text-muted-foreground">
                No more appointments scheduled
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
