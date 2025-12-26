import { ObjectId } from 'mongodb';

// User Schema (Base for both doctors and patients)
export interface User {
  _id?: ObjectId;
  email: string;
  password: string; // In production, this should be hashed
  role?: 'doctor' | 'patient' | 'admin'; // Optional during signup
  firstName: string;
  lastName: string;
  phone?: string;
  address?: string;
  dateOfBirth?: Date;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  
  // Profile completion tracking
  profileCompleted: boolean;
  profileCompletionPercentage: number;
  signupDate: Date; // When they first signed up
  lastLoginAt?: Date;
  profilePhoto?: string;
}

// Profile completion step tracking
export interface ProfileCompletionStep {
  stepName: string;
  completed: boolean;
  completedAt?: Date;
}

// Detailed profile completion data
export interface ProfileCompletion {
  _id?: ObjectId;
  userId: ObjectId;
  steps: ProfileCompletionStep[];
  currentStep: number;
  totalSteps: number;
  percentage: number;
  createdAt: Date;
  updatedAt: Date;
}

// Extended user data for profile completion
export interface ExtendedProfile {
  userId: ObjectId;
  
  // Professional Information
  professionalTitle?: string;
  specialization?: string;
  licenseNumber?: string;
  department?: string;
  qualifications?: string[];
  yearsOfExperience?: number;
  consultationFee?: number;
  
  // Contact Information
  alternateEmail?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  
  // Medical Information (for patients)
  medicalRecordNumber?: string;
  bloodGroup?: string;
  allergies?: string[];
  chronicConditions?: string[];
  currentMedications?: string[];
  insurance?: {
    provider: string;
    policyNumber: string;
    groupNumber?: string;
  };
  
  // Preferences
  language?: string;
  timezone?: string;
  notifications?: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  
  createdAt: Date;
  updatedAt: Date;
}

// Patient-specific information
export interface Patient extends User {
  role: 'patient';
  medicalRecordNumber: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  insurance?: {
    provider: string;
    policyNumber: string;
    groupNumber?: string;
  };
  allergies?: string[];
  chronicConditions?: string[];
}

// Doctor-specific information
export interface Doctor extends User {
  role: 'doctor';
  licenseNumber: string;
  specialization: string;
  department: string;
  qualifications: string[];
  availableSlots?: {
    day: string; // e.g., "Monday"
    startTime: string; // e.g., "09:00"
    endTime: string; // e.g., "17:00"
  }[];
  consultationFee: number;
}

// Appointment
export interface Appointment {
  _id?: ObjectId;
  patientId: ObjectId;
  doctorId: ObjectId;
  appointmentDate: Date;
  duration: number; // in minutes
  status: 'scheduled' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled' | 'no-show';
  type: 'consultation' | 'follow-up' | 'emergency' | 'checkup';
  reason: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Medical Record
export interface MedicalRecord {
  _id?: ObjectId;
  patientId: ObjectId;
  doctorId: ObjectId;
  appointmentId?: ObjectId;
  date: Date;
  diagnosis: string;
  symptoms: string[];
  treatment: string;
  prescription?: {
    medication: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions?: string;
  }[];
  vitalSigns?: {
    bloodPressure?: string;
    heartRate?: number;
    temperature?: number;
    weight?: number;
    height?: number;
  };
  labResults?: {
    testName: string;
    result: string;
    referenceRange?: string;
    status: 'normal' | 'abnormal' | 'critical';
  }[];
  notes: string;
  followUpRequired: boolean;
  followUpDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Medication
export interface Medication {
  _id?: ObjectId;
  patientId: ObjectId;
  doctorId: ObjectId;
  prescriptionId?: ObjectId;
  medicationName: string;
  dosage: string;
  frequency: string;
  duration: string;
  startDate: Date;
  endDate?: Date;
  instructions?: string;
  status: 'active' | 'completed' | 'discontinued';
  createdAt: Date;
  updatedAt: Date;
}

// Billing
export interface Bill {
  _id?: ObjectId;
  patientId: ObjectId;
  doctorId: ObjectId;
  appointmentId?: ObjectId;
  invoiceNumber: string;
  date: Date;
  dueDate: Date;
  services: {
    description: string;
    quantity: number;
    rate: number;
    total: number;
  }[];
  subtotal: number;
  tax: number;
  discount?: number;
  total: number;
  status: 'pending' | 'paid' | 'overdue' | 'cancelled';
  paymentMethod?: string;
  paymentDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Queue Management
export interface QueueEntry {
  _id?: ObjectId;
  appointmentId: ObjectId;
  patientId: ObjectId;
  doctorId: ObjectId;
  queueNumber: number;
  estimatedTime: Date;
  status: 'waiting' | 'in-consultation' | 'completed' | 'cancelled';
  priority: 'normal' | 'urgent';
  checkInTime: Date;
  calledTime?: Date;
  consultationStartTime?: Date;
  consultationEndTime?: Date;
}

// Profile completion steps configuration
export const PROFILE_COMPLETION_STEPS = [
  { id: 'basic-info', name: 'Basic Information', description: 'Name, email, and role selection' },
  { id: 'professional', name: 'Professional Details', description: 'Specialization, license, experience' },
  { id: 'contact', name: 'Contact Information', description: 'Phone, address, emergency contact' },
  { id: 'medical', name: 'Medical Information', description: 'Allergies, conditions, insurance' },
  { id: 'preferences', name: 'Preferences', description: 'Notifications, language, timezone' },
  { id: 'photo', name: 'Profile Photo', description: 'Add a professional photo' },
];

// Calculate profile completion percentage
export function calculateProfileCompletionPercentage(user: User, profile?: ExtendedProfile): number {
  let completedSteps = 0;
  const totalSteps = PROFILE_COMPLETION_STEPS.length;

  // Basic info is always completed after signup
  if (user.firstName && user.lastName && user.email && user.role) {
    completedSteps++;
  }

  // Professional details
  if (profile?.professionalTitle && profile?.specialization) {
    completedSteps++;
  }

  // Contact information
  if (user.phone && user.address) {
    completedSteps++;
  }

  // Medical information (for patients)
  if (user.role === 'patient' && profile?.bloodGroup && profile?.allergies) {
    completedSteps++;
  } else if (user.role === 'doctor' && profile?.licenseNumber && profile?.qualifications?.length) {
    completedSteps++;
  }

  // Preferences
  if (profile?.language && profile?.timezone) {
    completedSteps++;
  }

  // Profile photo
  if (user.profilePhoto) {
    completedSteps++;
  }

  return Math.round((completedSteps / totalSteps) * 100);
}

// Index creation helper
export const createIndexes = async (db: any) => {
  try {
    // Users collection indexes
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    await db.collection('users').createIndex({ role: 1 });
    await db.collection('users').createIndex({ firstName: 1, lastName: 1 });
    await db.collection('users').createIndex({ profileCompleted: 1 });

    // Extended profiles collection indexes
    await db.collection('extendedProfiles').createIndex({ userId: 1 }, { unique: true });

    // Profile completion collection indexes
    await db.collection('profileCompletion').createIndex({ userId: 1 }, { unique: true });

    // Patients collection indexes
    await db.collection('patients').createIndex({ medicalRecordNumber: 1 }, { unique: true });

    // Doctors collection indexes
    await db.collection('doctors').createIndex({ licenseNumber: 1 }, { unique: true });
    await db.collection('doctors').createIndex({ specialization: 1 });

    // Appointments collection indexes
    await db.collection('appointments').createIndex({ patientId: 1 });
    await db.collection('appointments').createIndex({ doctorId: 1 });
    await db.collection('appointments').createIndex({ appointmentDate: 1 });
    await db.collection('appointments').createIndex({ status: 1 });

    // Medical records collection indexes
    await db.collection('medicalRecords').createIndex({ patientId: 1 });
    await db.collection('medicalRecords').createIndex({ doctorId: 1 });
    await db.collection('medicalRecords').createIndex({ date: 1 });

    // Medications collection indexes
    await db.collection('medications').createIndex({ patientId: 1 });
    await db.collection('medications').createIndex({ status: 1 });

    // Bills collection indexes
    await db.collection('bills').createIndex({ patientId: 1 });
    await db.collection('bills').createIndex({ status: 1 });
    await db.collection('bills').createIndex({ invoiceNumber: 1 }, { unique: true });

    // Queue collection indexes
    await db.collection('queue').createIndex({ doctorId: 1, status: 1 });
    await db.collection('queue').createIndex({ queueNumber: 1 });

    console.log('✅ Database indexes created successfully');
  } catch (error) {
    console.error('❌ Error creating database indexes:', error);
  }
};
