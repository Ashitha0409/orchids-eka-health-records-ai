"use client";

import { StatCard } from "@/components/dashboard/stat-card";
import { QuickActionCard } from "@/components/dashboard/quick-action-card";
import { AppointmentCard } from "@/components/dashboard/appointment-card";
import { RecordCard } from "@/components/dashboard/record-card";
import { MedicationCard } from "@/components/dashboard/medication-card";
import {
  Calendar,
  Pill,
  FileText,
  Receipt,
  AlertTriangle,
  Plus,
  Sparkles,
} from "lucide-react";
import { mockAppointments, mockRecords, mockMedications, mockBills } from "@/lib/mock-data";

export default function PatientDashboard() {
  const upcomingAppointments = mockAppointments
    .filter((a) => a.status !== "completed")
    .slice(0, 3);
  const recentRecords = mockRecords.slice(0, 2);
  const activeMedications = mockMedications.filter((m) => m.isActive);
  const unpaidBills = mockBills.filter((b) => b.status === "unpaid" || b.status === "claim-pending");

  const attentionRecord = mockRecords.find((r) =>
    r.tags?.includes("attention-needed")
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">
          Good morning, Sarah
        </h1>
        <p className="text-muted-foreground">
          Here&apos;s your health overview for today
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Upcoming Appointments"
          value={upcomingAppointments.length}
          subtitle="Next: Dec 20, 10:00 AM"
          icon={Calendar}
          variant="primary"
        />
        <StatCard
          title="Active Medications"
          value={activeMedications.length}
          subtitle="Next dose at 8:00 AM"
          icon={Pill}
          variant="success"
        />
        <StatCard
          title="Recent Reports"
          value={mockRecords.length}
          subtitle="Last: Dec 15, 2024"
          icon={FileText}
          variant="info"
        />
        <StatCard
          title="Pending Bills"
          value={`$${unpaidBills.reduce((acc, b) => acc + (b.amount - (b.insuranceCovered || 0)), 0).toFixed(0)}`}
          subtitle={`${unpaidBills.length} unpaid`}
          icon={Receipt}
          variant="warning"
        />
      </div>

      {attentionRecord && (
        <div className="rounded-2xl border border-warning/30 bg-gradient-to-r from-warning/5 to-orange-50 p-4">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-warning/10">
              <AlertTriangle className="h-5 w-5 text-warning" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-foreground">Attention Needed</p>
              <p className="text-sm text-muted-foreground">
                {attentionRecord.title}: {attentionRecord.aiSummary}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <QuickActionCard
          title="Show Latest Report"
          description="View your CBC results"
          icon={FileText}
          href="/patient-dashboard/records"
          variant="primary"
        />
        <QuickActionCard
          title="Book Appointment"
          description="Schedule a new visit"
          icon={Plus}
          href="/patient-dashboard/appointments"
        />
        <QuickActionCard
          title="Add Medicine"
          description="Track new prescription"
          icon={Pill}
          href="/patient-dashboard/medications"
        />
        <QuickActionCard
          title="AI Insights"
          description="Get health summary"
          icon={Sparkles}
          href="/patient-dashboard/records"
        />
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-foreground">
              Upcoming Appointments
            </h2>
            <a
              href="/patient-dashboard/appointments"
              className="text-sm font-medium text-primary hover:underline"
            >
              View all
            </a>
          </div>
          <div className="space-y-3">
            {upcomingAppointments.map((appointment) => (
              <AppointmentCard key={appointment.id} appointment={appointment} />
            ))}
          </div>
        </div>

        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-foreground">
              Today&apos;s Medications
            </h2>
            <a
              href="/patient-dashboard/medications"
              className="text-sm font-medium text-primary hover:underline"
            >
              View all
            </a>
          </div>
          <div className="space-y-3">
            {activeMedications.map((medication) => (
              <MedicationCard key={medication.id} medication={medication} />
            ))}
          </div>
        </div>
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-foreground">
            Recent Medical Records
          </h2>
          <a
            href="/patient-dashboard/records"
            className="text-sm font-medium text-primary hover:underline"
          >
            View all
          </a>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          {recentRecords.map((record) => (
            <RecordCard key={record.id} record={record} />
          ))}
        </div>
      </div>
    </div>
  );
}
