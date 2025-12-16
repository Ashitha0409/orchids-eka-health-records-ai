"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  UserPlus,
  Filter,
  Phone,
  Mail,
  Calendar,
  AlertCircle,
  ChevronRight,
} from "lucide-react";
import { mockDoctorPatients } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function PatientsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPatients = mockDoctorPatients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.phone?.includes(searchQuery)
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            Patients
          </h1>
          <p className="text-muted-foreground">
            Manage and view all your patients
          </p>
        </div>
        <Button className="gap-2 rounded-xl bg-primary text-white">
          <UserPlus className="h-4 w-4" />
          Add Patient
        </Button>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 rounded-xl pl-10"
          />
        </div>
        <Button variant="outline" className="gap-2 rounded-xl">
          <Filter className="h-4 w-4" />
          Filters
        </Button>
      </div>

      <div className="rounded-2xl border border-border bg-white overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-semibold">Patient</TableHead>
              <TableHead className="font-semibold">Contact</TableHead>
              <TableHead className="font-semibold">Conditions</TableHead>
              <TableHead className="font-semibold">Last Visit</TableHead>
              <TableHead className="font-semibold">Next Appointment</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPatients.map((patient) => (
              <TableRow
                key={patient.id}
                className="cursor-pointer hover:bg-muted/50"
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-medium text-primary">
                      {patient.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{patient.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {patient.bloodGroup} • DOB: {patient.dateOfBirth}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Phone className="h-3 w-3" />
                      {patient.phone}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Mail className="h-3 w-3" />
                      {patient.email}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {patient.chronicConditions && patient.chronicConditions.length > 0 ? (
                      patient.chronicConditions.map((condition) => (
                        <Badge
                          key={condition}
                          variant="outline"
                          className="border-warning/20 bg-warning/10 text-warning text-xs"
                        >
                          {condition}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-sm text-muted-foreground">None</span>
                    )}
                    {patient.allergies && patient.allergies.length > 0 && (
                      <Badge
                        variant="outline"
                        className="border-destructive/20 bg-destructive/10 text-destructive text-xs gap-1"
                      >
                        <AlertCircle className="h-3 w-3" />
                        {patient.allergies.length} allergies
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-sm">
                    <Calendar className="h-3 w-3 text-muted-foreground" />
                    {patient.lastVisit}
                  </div>
                </TableCell>
                <TableCell>
                  {patient.nextAppointment ? (
                    <Badge className="bg-primary/10 text-primary border-0">
                      {patient.nextAppointment}
                    </Badge>
                  ) : (
                    <span className="text-sm text-muted-foreground">Not scheduled</span>
                  )}
                </TableCell>
                <TableCell>
                  <Link href={`/doctor-dashboard/patients/${patient.id}`}>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {filteredPatients.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/20 py-16">
          <Search className="h-12 w-12 text-muted-foreground/50" />
          <p className="mt-4 font-medium text-muted-foreground">No patients found</p>
          <p className="text-sm text-muted-foreground">
            Try adjusting your search
          </p>
        </div>
      )}
    </div>
  );
}
