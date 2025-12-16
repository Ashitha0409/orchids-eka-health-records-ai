"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RecordCard } from "@/components/dashboard/record-card";
import { AppointmentCard } from "@/components/dashboard/appointment-card";
import { MedicationCard } from "@/components/dashboard/medication-card";
import {
  ArrowLeft,
  Phone,
  Mail,
  Calendar,
  AlertTriangle,
  Sparkles,
  FileText,
  Pill,
  Receipt,
  Edit,
  Heart,
  Droplets,
  Activity,
} from "lucide-react";
import Link from "next/link";
import { mockDoctorPatients, mockRecords, mockAppointments, mockMedications } from "@/lib/mock-data";

export default function PatientDetailPage() {
  const patient = mockDoctorPatients[0];
  const patientRecords = mockRecords;
  const patientAppointments = mockAppointments.filter((a) => a.patientId === "p1");
  const patientMedications = mockMedications;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/doctor-dashboard/patients">
          <Button variant="ghost" size="icon" className="rounded-xl">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="font-display text-2xl font-bold text-foreground">
            Patient Profile
          </h1>
          <p className="text-muted-foreground">View and manage patient details</p>
        </div>
        <Button variant="outline" className="gap-2 rounded-xl">
          <Edit className="h-4 w-4" />
          Edit Profile
        </Button>
        <Button className="gap-2 rounded-xl bg-primary text-white">
          <FileText className="h-4 w-4" />
          New Visit
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-white p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-xl font-semibold text-primary">
                {patient.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div>
                <h2 className="font-display text-xl font-semibold text-foreground">
                  {patient.name}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {patient.bloodGroup} • {patient.dateOfBirth}
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{patient.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{patient.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Last visit: {patient.lastVisit}</span>
              </div>
            </div>
          </div>

          {patient.allergies && patient.allergies.length > 0 && (
            <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-4">
              <div className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-4 w-4" />
                <span className="font-medium">Allergies</span>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {patient.allergies.map((allergy) => (
                  <Badge
                    key={allergy}
                    variant="outline"
                    className="border-destructive/20 bg-white text-destructive"
                  >
                    {allergy}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {patient.chronicConditions && patient.chronicConditions.length > 0 && (
            <div className="rounded-2xl border border-warning/30 bg-warning/5 p-4">
              <div className="flex items-center gap-2 text-warning">
                <Activity className="h-4 w-4" />
                <span className="font-medium">Chronic Conditions</span>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {patient.chronicConditions.map((condition) => (
                  <Badge
                    key={condition}
                    variant="outline"
                    className="border-warning/20 bg-white text-warning"
                  >
                    {condition}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="rounded-2xl border border-border bg-white p-4">
            <h3 className="font-medium text-foreground">Recent Vitals</h3>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-muted/50 p-3">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Heart className="h-3 w-3" />
                  Blood Pressure
                </div>
                <p className="mt-1 font-semibold text-foreground">138/88</p>
              </div>
              <div className="rounded-xl bg-muted/50 p-3">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Activity className="h-3 w-3" />
                  Heart Rate
                </div>
                <p className="mt-1 font-semibold text-foreground">72 bpm</p>
              </div>
              <div className="rounded-xl bg-muted/50 p-3">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Droplets className="h-3 w-3" />
                  SpO2
                </div>
                <p className="mt-1 font-semibold text-foreground">98%</p>
              </div>
              <div className="rounded-xl bg-muted/50 p-3">
                <div className="text-xs text-muted-foreground">Weight</div>
                <p className="mt-1 font-semibold text-foreground">68 kg</p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl bg-gradient-to-r from-primary/5 to-teal-50 border border-primary/10 p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-foreground">MedSense AI Summary</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Sarah Johnson is a 39-year-old female with controlled hypertension.
                  Currently on Lisinopril 10mg daily with good adherence (95%). Recent
                  lipid panel shows slightly elevated LDL (145 mg/dL). Recommend
                  continuing current treatment with dietary counseling for cholesterol
                  management. Follow-up scheduled for December 20.
                </p>
              </div>
            </div>
          </div>

          <Tabs defaultValue="timeline" className="space-y-4">
            <TabsList className="rounded-xl bg-muted p-1">
              <TabsTrigger value="timeline" className="rounded-lg gap-2">
                <Calendar className="h-4 w-4" />
                Timeline
              </TabsTrigger>
              <TabsTrigger value="records" className="rounded-lg gap-2">
                <FileText className="h-4 w-4" />
                Records
              </TabsTrigger>
              <TabsTrigger value="medications" className="rounded-lg gap-2">
                <Pill className="h-4 w-4" />
                Medications
              </TabsTrigger>
              <TabsTrigger value="billing" className="rounded-lg gap-2">
                <Receipt className="h-4 w-4" />
                Billing
              </TabsTrigger>
            </TabsList>

            <TabsContent value="timeline" className="space-y-4">
              <div className="space-y-3">
                {patientAppointments.map((appointment) => (
                  <AppointmentCard
                    key={appointment.id}
                    appointment={appointment}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="records" className="space-y-4">
              <div className="grid gap-4">
                {patientRecords.map((record) => (
                  <RecordCard key={record.id} record={record} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="medications" className="space-y-4">
              <div className="grid gap-4 lg:grid-cols-2">
                {patientMedications.map((medication) => (
                  <MedicationCard key={medication.id} medication={medication} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="billing" className="space-y-4">
              <div className="rounded-2xl border border-border bg-white p-6">
                <p className="text-center text-muted-foreground">
                  Billing information will be displayed here
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
