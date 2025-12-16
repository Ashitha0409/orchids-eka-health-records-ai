export type UserRole = "patient" | "doctor";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
}

export interface Patient extends User {
  role: "patient";
  dateOfBirth?: string;
  bloodGroup?: string;
  allergies?: string[];
  chronicConditions?: string[];
  familyMembers?: FamilyMember[];
}

export interface Doctor extends User {
  role: "doctor";
  specialty: string;
  clinics?: Clinic[];
  registrationNumber?: string;
}

export interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  dateOfBirth?: string;
}

export interface Clinic {
  id: string;
  name: string;
  address: string;
  timings?: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: string;
  time: string;
  mode: "in-person" | "video" | "phone";
  status: "confirmed" | "pending" | "completed" | "cancelled" | "missed";
  reason?: string;
  notes?: string;
}

export interface MedicalRecord {
  id: string;
  patientId: string;
  type: "lab" | "imaging" | "prescription" | "visit-note" | "discharge";
  title: string;
  date: string;
  hospital?: string;
  doctor?: string;
  summary?: string;
  aiSummary?: string;
  attachments?: string[];
  tags?: string[];
}

export interface Medication {
  id: string;
  patientId: string;
  name: string;
  dosage: string;
  frequency: string;
  timing: string[];
  startDate: string;
  endDate?: string;
  prescribedBy?: string;
  isActive: boolean;
  adherence?: number;
  notes?: string;
}

export interface Bill {
  id: string;
  patientId: string;
  provider: string;
  type: "hospital" | "lab" | "pharmacy" | "consultation";
  amount: number;
  date: string;
  status: "paid" | "unpaid" | "claim-pending" | "partial";
  insuranceCovered?: number;
  description?: string;
}

export interface Vitals {
  bloodPressure?: string;
  heartRate?: number;
  temperature?: number;
  weight?: number;
  height?: number;
  oxygenSaturation?: number;
  recordedAt: string;
}
