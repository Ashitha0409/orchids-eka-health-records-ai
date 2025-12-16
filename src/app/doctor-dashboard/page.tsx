"use client";

import { StatCard } from "@/components/dashboard/stat-card";
import { QuickActionCard } from "@/components/dashboard/quick-action-card";
import { AppointmentCard } from "@/components/dashboard/appointment-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Users,
  Calendar,
  Clock,
  AlertCircle,
  FileText,
  UserPlus,
  ClipboardList,
  TrendingUp,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { mockAppointments, mockDoctorPatients, mockRecords } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export default function DoctorDashboard() {
  const todayAppointments = mockAppointments.filter(
    (a) => a.date === "2024-12-20" && a.doctorId === "d1"
  );
  const waitingPatients = todayAppointments.filter(
    (a) => a.status === "confirmed"
  );
  const completedToday = todayAppointments.filter(
    (a) => a.status === "completed"
  );

  const newLabReports = mockRecords.filter(
    (r) => r.type === "lab" && r.date === "2024-12-15"
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            Good morning, Dr. Chen
          </h1>
          <p className="text-muted-foreground">
            Downtown Medical Center • December 20, 2024
          </p>
        </div>
        <Button className="gap-2 rounded-xl bg-primary text-white">
          <UserPlus className="h-4 w-4" />
          New Patient
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Today's Appointments"
          value={todayAppointments.length}
          subtitle={`${completedToday.length} completed`}
          icon={Calendar}
          variant="primary"
        />
        <StatCard
          title="Patients Waiting"
          value={waitingPatients.length}
          subtitle="In queue now"
          icon={Clock}
          variant="warning"
        />
        <StatCard
          title="Total Patients"
          value={mockDoctorPatients.length}
          subtitle="+2 this week"
          icon={Users}
          variant="info"
          trend={{ value: 8, isPositive: true }}
        />
        <StatCard
          title="New Lab Reports"
          value={newLabReports.length}
          subtitle="Awaiting review"
          icon={FileText}
          variant="success"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <QuickActionCard
          title="View Queue"
          description="Manage waiting patients"
          icon={ClipboardList}
          href="/doctor-dashboard/queue"
          variant="primary"
        />
        <QuickActionCard
          title="Patient List"
          description="Search all patients"
          icon={Users}
          href="/doctor-dashboard/patients"
        />
        <QuickActionCard
          title="Today's Revenue"
          description="View billing summary"
          icon={TrendingUp}
          href="/doctor-dashboard/billing"
        />
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-foreground">
              Today&apos;s Schedule
            </h2>
            <a
              href="/doctor-dashboard/appointments"
              className="text-sm font-medium text-primary hover:underline"
            >
              View calendar
            </a>
          </div>
          <div className="space-y-3">
            {todayAppointments.map((appointment) => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                showPatient
              />
            ))}
          </div>
        </div>

        <div>
          <div className="mb-4">
            <h2 className="font-display text-lg font-semibold text-foreground">
              Quick Patient Lookup
            </h2>
          </div>
          <div className="space-y-3">
            {mockDoctorPatients.slice(0, 4).map((patient) => (
              <a
                key={patient.id}
                href={`/doctor-dashboard/patients/${patient.id}`}
                className="flex items-center gap-3 rounded-xl border border-border bg-white p-3 transition-all hover:border-primary/20 hover:shadow-md"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 font-medium text-primary">
                  {patient.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-foreground">{patient.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {patient.chronicConditions?.join(", ") || "No conditions"}
                  </p>
                </div>
                {patient.nextAppointment && (
                  <Badge
                    variant="outline"
                    className="shrink-0 border-primary/20 bg-primary/5 text-primary"
                  >
                    Today
                  </Badge>
                )}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-foreground">
            Follow-ups Due Today
          </h2>
        </div>
        <div className="rounded-2xl border border-border bg-white">
          <div className="divide-y divide-border">
            {mockDoctorPatients.slice(0, 3).map((patient, index) => (
              <div
                key={patient.id}
                className="flex items-center justify-between p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted font-medium text-muted-foreground">
                    {patient.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{patient.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Last visit: {patient.lastVisit}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-xs",
                      index === 0
                        ? "border-warning/20 bg-warning/10 text-warning"
                        : "border-muted bg-muted text-muted-foreground"
                    )}
                  >
                    {index === 0 ? "Overdue" : "Due today"}
                  </Badge>
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                  </Button>
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                    <XCircle className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
