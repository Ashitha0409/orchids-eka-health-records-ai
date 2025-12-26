"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  UserCheck,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Stethoscope,
  User,
  Phone,
  Heart,
  Check,
  Upload,
  Image,
  SkipForward,
  Home,
  Settings,
  Award,
  Building,
  Clock,
  DollarSign,
  Users,
  Shield,
  FileText,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";

interface ProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: "patient" | "doctor" | "";

  // Personal Details
  dateOfBirth: string;
  gender: string;
  maritalStatus: string;
  nationality: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelation: string;

  // Professional Details (for doctors)
  professionalTitle: string;
  specialization: string;
  licenseNumber: string;
  department: string;
  hospitalName: string;
  hospitalAddress: string;
  yearsOfExperience: number;
  consultationFee: number;
  availableDays: string[];
  availableTime: string;

  // Medical Information (for patients)
  bloodGroup: string;
  height: string;
  weight: string;
  allergies: string;
  chronicConditions: string;
  currentMedications: string;
  pastMedications: string;
  injuries: string;
  surgeries: string;
  medicalHistory: string;
  insuranceProvider: string;
  insuranceNumber: string;

  // Lifestyle
  smokingHabits: string;
  alcoholConsumption: string;
  activityLevel: string;
  foodPreference: string;
  occupation: string;

  // Preferences
  preferredLanguage: string;
  communicationMethod: string;

  // Profile Photo
  profilePhoto: File | null;
  profilePhotoPreview: string;

  // Progress tracking
  currentStep: number;
  completedSteps: number[];
  profileCompleted: boolean;
}

const initialFormData: ProfileFormData = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  role: "",
  dateOfBirth: "",
  gender: "",
  maritalStatus: "",
  nationality: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
  emergencyContactName: "",
  emergencyContactPhone: "",
  emergencyContactRelation: "",
  professionalTitle: "",
  specialization: "",
  licenseNumber: "",
  department: "",
  hospitalName: "",
  hospitalAddress: "",
  yearsOfExperience: 0,
  consultationFee: 0,
  availableDays: [],
  availableTime: "",
  bloodGroup: "",
  height: "",
  weight: "",
  allergies: "",
  chronicConditions: "",
  currentMedications: "",
  pastMedications: "",
  injuries: "",
  surgeries: "",
  medicalHistory: "",
  insuranceProvider: "",
  insuranceNumber: "",
  smokingHabits: "",
  alcoholConsumption: "",
  activityLevel: "",
  foodPreference: "",
  occupation: "",
  preferredLanguage: "english",
  communicationMethod: "",
  profilePhoto: null,
  profilePhotoPreview: "",
  currentStep: 0,
  completedSteps: [],
  profileCompleted: false
};

const steps = [
  {
    id: "personal",
    title: "Personal",
    icon: User,
    description: "Basic personal information",
    fields: [
      "firstName",
      "lastName",
      "dateOfBirth",
      "gender",
      "maritalStatus",
      "nationality",
      "phone",
      "address",
      "city",
      "state",
      "pincode",
      "emergencyContactName",
      "emergencyContactPhone",
      "emergencyContactRelation",
      "bloodGroup",
      "height",
      "weight"
    ]
  },
  {
    id: "medical",
    title: "Medical",
    icon: Heart,
    description: "Your detailed medical history",
    fields: [
      "allergies",
      "currentMedications",
      "pastMedications",
      "chronicConditions",
      "injuries",
      "surgeries",
      "medicalHistory",
      "insuranceProvider",
      "insuranceNumber"
    ]
  },
  {
    id: "lifestyle",
    title: "Lifestyle",
    icon: Users,
    description: "Your lifestyle and habits",
    fields: [
      "smokingHabits",
      "alcoholConsumption",
      "activityLevel",
      "foodPreference",
      "occupation"
    ]
  },
  {
    id: "professional",
    title: "Professional",
    icon: Stethoscope,
    description: "Your professional credentials and work information",
    fields: [
      "professionalTitle",
      "specialization",
      "licenseNumber",
      "department",
      "hospitalName",
      "hospitalAddress",
      "yearsOfExperience",
      "consultationFee",
      "availableDays",
      "availableTime"
    ]
  },
  {
    id: "preferences",
    title: "Preferences",
    icon: Settings,
    description: "Your communication preferences",
    fields: ["preferredLanguage", "communicationMethod"]
  },
  {
    id: "photo",
    title: "Profile Photo",
    icon: Image,
    description: "Upload your professional photo",
    fields: ["profilePhoto"]
  },
  {
    id: "review",
    title: "Review & Complete",
    icon: CheckCircle2,
    description: "Review your information and complete setup",
    fields: []
  }
];

export default function CompleteProfilePage() {
  const router = useRouter();
  const [formData, setFormData] = useState<ProfileFormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const savedData = localStorage.getItem("profileCompletion");
    const pendingUser = localStorage.getItem("pendingUser");

    if (savedData) {
      const savedFormData = JSON.parse(savedData) as ProfileFormData;
      setFormData({ ...initialFormData, ...savedFormData });
    } else if (pendingUser) {
      const user = JSON.parse(pendingUser);
      setFormData(prev => ({
        ...prev,
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        password: user.password || "",
        role: user.role || ""
      }));
    } else {
      router.push("/signup");
    }
  }, [router]);

  const updateFormData = useCallback((field: keyof ProfileFormData, value: any) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      localStorage.setItem(
        "profileCompletion",
        JSON.stringify({ ...updated, lastUpdated: new Date().toISOString() })
      );
      return updated;
    });
  }, []);

  const updateArrayField = (field: keyof ProfileFormData, value: string, checked: boolean) => {
    setFormData(prev => {
      const currentArray = (prev[field] as string[]) || [];
      const updatedArray = checked
        ? [...currentArray, value]
        : currentArray.filter(item => item !== value);

      const updated = { ...prev, [field]: updatedArray };
      localStorage.setItem(
        "profileCompletion",
        JSON.stringify({ ...updated, lastUpdated: new Date().toISOString() })
      );
      return updated;
    });
  };

  const nextStep = () => {
    if (formData.currentStep < steps.length - 1) {
      const newStep = formData.currentStep + 1;
      const updatedCompletedSteps = [...new Set([...formData.completedSteps, formData.currentStep])];

      const updatedData = {
        ...formData,
        currentStep: newStep,
        completedSteps: updatedCompletedSteps
      };

      setFormData(updatedData);
      localStorage.setItem(
        "profileCompletion",
        JSON.stringify({ ...updatedData, lastUpdated: new Date().toISOString() })
      );
    }
  };

  const prevStep = () => {
    if (formData.currentStep > 0) {
      const newStep = formData.currentStep - 1;
      setFormData(prev => ({
        ...prev,
        currentStep: newStep
      }));
      localStorage.setItem(
        "profileCompletion",
        JSON.stringify({
          ...formData,
          currentStep: newStep,
          lastUpdated: new Date().toISOString()
        })
      );
    }
  };

  const skipCurrentStep = () => {
    const updatedCompletedSteps = [...new Set([...formData.completedSteps, formData.currentStep])];
    const newStep = formData.currentStep + 1;

    const updatedData = {
      ...formData,
      currentStep: Math.min(newStep, steps.length - 1),
      completedSteps: updatedCompletedSteps
    };

    setFormData(updatedData);
    localStorage.setItem(
      "profileCompletion",
      JSON.stringify({ ...updatedData, lastUpdated: new Date().toISOString() })
    );

    toast.success("Step skipped. Your progress is saved.");
  };

  const handleSkipAll = () => {
    setFormData(prev => ({
      ...prev,
      profileCompleted: true,
      currentStep: steps.length - 1
    }));

    localStorage.setItem(
      "profileCompletion",
      JSON.stringify({
        ...formData,
        profileCompleted: true,
        currentStep: steps.length - 1,
        lastUpdated: new Date().toISOString()
      })
    );

    toast.success("Profile setup skipped. You can complete it later from your dashboard.");

    if (formData.role === "doctor") {
      router.push("/doctor-dashboard");
    } else {
      router.push("/patient-dashboard");
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }
    if (file) {
      updateFormData("profilePhoto", file);
      updateFormData("profilePhotoPreview", URL.createObjectURL(file));
    }
  };

  const handleCompleteProfile = async () => {
    setLoading(true);
    setError("");

    try {
      const formDataToSend = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (key === "profilePhoto" && value instanceof File) {
          formDataToSend.append("profilePhoto", value);
        } else if (value !== null && value !== undefined && value !== "") {
          if (Array.isArray(value)) {
            formDataToSend.append(key, value.join(","));
          } else {
            formDataToSend.append(key, String(value));
          }
        }
      });

      const res = await fetch("/api/profile/complete", {
        method: "POST",
        body: formDataToSend
      });

      if (!res.ok) throw new Error("Profile completion failed");

      localStorage.removeItem("pendingUser");
      localStorage.removeItem("profileCompletion");

      toast.success("Profile completed successfully!");

      if (formData.role === "doctor") {
        router.push("/doctor-dashboard");
      } else {
        router.push("/patient-dashboard");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to complete profile. Please try again.");
      toast.error("Failed to complete profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getCompletionPercentage = () => {
    const totalFields = steps.reduce((acc, step) => acc + step.fields.length, 0);
    let completedFields = 0;

    steps.forEach(step => {
      step.fields.forEach(field => {
        const value = formData[field as keyof ProfileFormData];
        if (
          value &&
          (typeof value === "string"
            ? value.trim() !== ""
            : Array.isArray(value)
            ? value.length > 0
            : true)
        ) {
          completedFields++;
        }
      });
    });

    return Math.round((completedFields / totalFields) * 100);
  };

  const currentStep = steps[formData.currentStep];

  const renderStepContent = () => {
    switch (currentStep.id) {
      case "personal":
        return (
          <div className="space-y-6">
            <div className="text-center mb-4">
              <h2 className="text-3xl font-bold mb-2">Personal</h2>
              <p className="text-muted-foreground">{currentStep.description}</p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="text-lg font-semibold">
                    {formData.firstName || ""} {formData.lastName || ""}
                  </p>
                </div>
                <div className="flex flex-col items-center">
                  {formData.profilePhotoPreview ? (
                    <img
                      src={formData.profilePhotoPreview}
                      className="w-16 h-16 rounded-full object-cover"
                      alt="profile"
                    />
                  ) : (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-xs text-blue-600"
                    >
                      add photo
                    </button>
                  )}
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handlePhotoUpload}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Contact Number</Label>
                  <Input
                    value={formData.phone}
                    onChange={e => updateFormData("phone", e.target.value)}
                    placeholder="+91-XXXXXXXXXX"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email Id</Label>
                  <Input
                    value={formData.email}
                    onChange={e => updateFormData("email", e.target.value)}
                    placeholder="Add email"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Gender</Label>
                  <Select
                    value={formData.gender}
                    onValueChange={val => updateFormData("gender", val)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Add gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                      <SelectItem value="prefer-not-to-say">
                        Prefer not to say
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Date of Birth</Label>
                  <Input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={e => updateFormData("dateOfBirth", e.target.value)}
                    placeholder="yyyy-mm-dd"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Blood Group</Label>
                  <Select
                    value={formData.bloodGroup}
                    onValueChange={val => updateFormData("bloodGroup", val)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="add blood group" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A+">A+</SelectItem>
                      <SelectItem value="A-">A-</SelectItem>
                      <SelectItem value="B+">B+</SelectItem>
                      <SelectItem value="B-">B-</SelectItem>
                      <SelectItem value="AB+">AB+</SelectItem>
                      <SelectItem value="AB-">AB-</SelectItem>
                      <SelectItem value="O+">O+</SelectItem>
                      <SelectItem value="O-">O-</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Marital Status</Label>
                  <Select
                    value={formData.maritalStatus}
                    onValueChange={val => updateFormData("maritalStatus", val)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="add marital status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single">Single</SelectItem>
                      <SelectItem value="married">Married</SelectItem>
                      <SelectItem value="divorced">Divorced</SelectItem>
                      <SelectItem value="widowed">Widowed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Height (cm)</Label>
                  <Input
                    value={formData.height}
                    onChange={e => updateFormData("height", e.target.value)}
                    placeholder="add height"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Weight (kg)</Label>
                  <Input
                    value={formData.weight}
                    onChange={e => updateFormData("weight", e.target.value)}
                    placeholder="add weight"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Emergency Contact</Label>
                  <Input
                    value={formData.emergencyContactName}
                    onChange={e =>
                      updateFormData("emergencyContactName", e.target.value)
                    }
                    placeholder="add emergency details"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Location</Label>
                  <Input
                    value={formData.address}
                    onChange={e => updateFormData("address", e.target.value)}
                    placeholder="add details"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case "medical":
        return (
          <div className="space-y-6">
            <div className="text-center mb-4">
              <h2 className="text-3xl font-bold mb-2">Medical</h2>
              <p className="text-muted-foreground">{currentStep.description}</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Allergies</Label>
                <Textarea
                  value={formData.allergies}
                  onChange={e => updateFormData("allergies", e.target.value)}
                  placeholder="add allergies"
                />
              </div>
              <div className="space-y-2">
                <Label>Current Medications</Label>
                <Textarea
                  value={formData.currentMedications}
                  onChange={e =>
                    updateFormData("currentMedications", e.target.value)
                  }
                  placeholder="add medications"
                />
              </div>
              <div className="space-y-2">
                <Label>Past Medications</Label>
                <Textarea
                  value={formData.pastMedications}
                  onChange={e =>
                    updateFormData("pastMedications", e.target.value)
                  }
                  placeholder="add medications"
                />
              </div>
              <div className="space-y-2">
                <Label>Chronic Diseases</Label>
                <Textarea
                  value={formData.chronicConditions}
                  onChange={e =>
                    updateFormData("chronicConditions", e.target.value)
                  }
                  placeholder="add disease"
                />
              </div>
              <div className="space-y-2">
                <Label>Injuries</Label>
                <Textarea
                  value={formData.injuries}
                  onChange={e => updateFormData("injuries", e.target.value)}
                  placeholder="add incident"
                />
              </div>
              <div className="space-y-2">
                <Label>Surgeries</Label>
                <Textarea
                  value={formData.surgeries}
                  onChange={e => updateFormData("surgeries", e.target.value)}
                  placeholder="add surgeries"
                />
              </div>
              <div className="space-y-2">
                <Label>Other Medical History</Label>
                <Textarea
                  value={formData.medicalHistory}
                  onChange={e =>
                    updateFormData("medicalHistory", e.target.value)
                  }
                  placeholder="Any significant medical history"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div className="space-y-2">
                  <Label>Insurance Provider</Label>
                  <Input
                    value={formData.insuranceProvider}
                    onChange={e =>
                      updateFormData("insuranceProvider", e.target.value)
                    }
                    placeholder="add provider"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Insurance Number</Label>
                  <Input
                    value={formData.insuranceNumber}
                    onChange={e =>
                      updateFormData("insuranceNumber", e.target.value)
                    }
                    placeholder="add policy number"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case "lifestyle":
        return (
          <div className="space-y-6">
            <div className="text-center mb-4">
              <h2 className="text-3xl font-bold mb-2">Lifestyle</h2>
              <p className="text-muted-foreground">{currentStep.description}</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Smoking Habits</Label>
                <Input
                  value={formData.smokingHabits}
                  onChange={e =>
                    updateFormData("smokingHabits", e.target.value)
                  }
                  placeholder="add details"
                />
              </div>
              <div className="space-y-2">
                <Label>Alcohol Consumption</Label>
                <Input
                  value={formData.alcoholConsumption}
                  onChange={e =>
                    updateFormData("alcoholConsumption", e.target.value)
                  }
                  placeholder="add details"
                />
              </div>
              <div className="space-y-2">
                <Label>Activity Level</Label>
                <Input
                  value={formData.activityLevel}
                  onChange={e =>
                    updateFormData("activityLevel", e.target.value)
                  }
                  placeholder="add details"
                />
              </div>
              <div className="space-y-2">
                <Label>Food Preference</Label>
                <Input
                  value={formData.foodPreference}
                  onChange={e =>
                    updateFormData("foodPreference", e.target.value)
                  }
                  placeholder="add lifestyle"
                />
              </div>
              <div className="space-y-2">
                <Label>Occupation</Label>
                <Input
                  value={formData.occupation}
                  onChange={e =>
                    updateFormData("occupation", e.target.value)
                  }
                  placeholder="add occupation"
                />
              </div>
            </div>
          </div>
        );

      case "professional":
        return (
          <div className="space-y-6">
            <div className="text-center mb-4">
              <h2 className="text-3xl font-bold mb-2">{currentStep.title}</h2>
              <p className="text-muted-foreground">{currentStep.description}</p>
            </div>

            {formData.role === "doctor" ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Professional Title *</Label>
                    <Input
                      value={formData.professionalTitle}
                      onChange={e =>
                        updateFormData("professionalTitle", e.target.value)
                      }
                      placeholder="Dr., Prof., etc."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Specialization *</Label>
                    <Select
                      value={formData.specialization}
                      onValueChange={val =>
                        updateFormData("specialization", val)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select specialization" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general-medicine">
                          General Medicine
                        </SelectItem>
                        <SelectItem value="cardiology">Cardiology</SelectItem>
                        <SelectItem value="neurology">Neurology</SelectItem>
                        <SelectItem value="pediatrics">Pediatrics</SelectItem>
                        <SelectItem value="orthopedics">Orthopedics</SelectItem>
                        <SelectItem value="gynecology">Gynecology</SelectItem>
                        <SelectItem value="dermatology">Dermatology</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>License Number *</Label>
                    <Input
                      value={formData.licenseNumber}
                      onChange={e =>
                        updateFormData("licenseNumber", e.target.value)
                      }
                      placeholder="Enter license number"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Department</Label>
                    <Input
                      value={formData.department}
                      onChange={e =>
                        updateFormData("department", e.target.value)
                      }
                      placeholder="Enter department"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Hospital/Clinic Name *</Label>
                  <Input
                    value={formData.hospitalName}
                    onChange={e =>
                      updateFormData("hospitalName", e.target.value)
                    }
                    placeholder="Enter hospital/clinic name"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Hospital Address</Label>
                  <Textarea
                    value={formData.hospitalAddress}
                    onChange={e =>
                      updateFormData("hospitalAddress", e.target.value)
                    }
                    placeholder="Enter hospital/clinic address"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label>Years of Experience</Label>
                    <Input
                      type="number"
                      value={formData.yearsOfExperience}
                      onChange={e =>
                        updateFormData(
                          "yearsOfExperience",
                          parseInt(e.target.value) || 0
                        )
                      }
                      placeholder="5"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Consultation Fee (₹)</Label>
                    <Input
                      type="number"
                      value={formData.consultationFee}
                      onChange={e =>
                        updateFormData(
                          "consultationFee",
                          parseInt(e.target.value) || 0
                        )
                      }
                      placeholder="500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Available Days</Label>
                    <div className="space-y-1 pt-1">
                      {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map(
                        day => (
                          <div key={day} className="flex items-center space-x-2">
                            <Checkbox
                              id={day}
                              checked={formData.availableDays.includes(day)}
                              onCheckedChange={checked =>
                                updateArrayField(
                                  "availableDays",
                                  day,
                                  !!checked
                                )
                              }
                            />
                            <Label htmlFor={day} className="text-sm">
                              {day}
                            </Label>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Available Time</Label>
                  <Input
                    value={formData.availableTime}
                    onChange={e =>
                      updateFormData("availableTime", e.target.value)
                    }
                    placeholder="9 AM - 5 PM"
                  />
                </div>
              </div>
            ) : (
              <div className="bg-gradient-to-r from-blue-500/5 to-indigo-500/5 backdrop-blur-sm p-8 rounded-3xl border-2 border-dashed border-blue-200 text-center">
                <Shield className="w-16 h-16 mx-auto mb-4 text-blue-500" />
                <h3 className="text-xl font-bold mb-2">Doctor Profile Only</h3>
                <p className="text-muted-foreground mb-2">
                  This section is only for doctors. Patients can safely skip it.
                </p>
              </div>
            )}
          </div>
        );

      case "preferences":
        return (
          <div className="space-y-6 max-w-2xl mx-auto">
            <div className="text-center mb-4">
              <h2 className="text-3xl font-bold mb-2">{currentStep.title}</h2>
              <p className="text-muted-foreground">{currentStep.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <Label className="text-lg font-semibold">Preferred Language</Label>
                <Select
                  value={formData.preferredLanguage}
                  onValueChange={val => updateFormData("preferredLanguage", val)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="hindi">Hindi</SelectItem>
                    <SelectItem value="kannada">Kannada</SelectItem>
                    <SelectItem value="tamil">Tamil</SelectItem>
                    <SelectItem value="telugu">Telugu</SelectItem>
                    <SelectItem value="malayalam">Malayalam</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-3">
                <Label className="text-lg font-semibold">
                  Communication Method
                </Label>
                <Select
                  value={formData.communicationMethod}
                  onValueChange={val =>
                    updateFormData("communicationMethod", val)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select preferred method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="whatsapp">WhatsApp</SelectItem>
                    <SelectItem value="sms">SMS</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="phone">Phone Call</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case "photo":
        return (
          <div className="space-y-6 max-w-md mx-auto">
            <div className="text-center mb-4">
              <h2 className="text-3xl font-bold mb-2">{currentStep.title}</h2>
              <p className="text-muted-foreground">{currentStep.description}</p>
            </div>

            <div className="space-y-6">
              {formData.profilePhotoPreview ? (
                <div className="text-center">
                  <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-dashed border-gray-300 relative">
                    <img
                      src={formData.profilePhotoPreview}
                      alt="Profile preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Photo selected successfully
                  </p>
                  <Button
                    variant="outline"
                    className="mt-3"
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Change photo
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center hover:border-blue-400 transition-colors">
                  <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-semibold mb-2">
                    Drag & drop your photo, or click to select
                  </h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    Recommended: 400x400px, Max size: 5MB (JPG, PNG)
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Choose Photo
                  </Button>
                  <input
                    ref={fileInputRef}
                    className="hidden"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                  />
                </div>
              )}
            </div>
          </div>
        );

      case "review":
        return (
          <div className="space-y-6 max-w-2xl mx-auto">
            <div className="text-center mb-4">
              <CheckCircle2 className="w-16 h-16 mx-auto mb-4 text-green-500" />
              <h2 className="text-3xl font-bold mb-2">Review Your Profile</h2>
              <p className="text-muted-foreground">
                Please verify all information before completing setup
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Personal
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Name</span>
                  <br />
                  {formData.firstName} {formData.lastName}
                </div>
                <div>
                  <span className="text-muted-foreground">DOB</span>
                  <br />
                  {formData.dateOfBirth || "Not set"}
                </div>
                <div>
                  <span className="text-muted-foreground">Gender</span>
                  <br />
                  {formData.gender || "Not set"}
                </div>
                <div>
                  <span className="text-muted-foreground">Phone</span>
                  <br />
                  {formData.phone || "Not set"}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5" />
                  Medical
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-1">
                <div>
                  <strong>Allergies:</strong> {formData.allergies || "Not set"}
                </div>
                <div>
                  <strong>Chronic diseases:</strong>{" "}
                  {formData.chronicConditions || "Not set"}
                </div>
                <div>
                  <strong>Medications:</strong>{" "}
                  {formData.currentMedications || "Not set"}
                </div>
              </CardContent>
            </Card>

            {formData.role === "doctor" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Stethoscope className="w-5 h-5" />
                    Professional
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-1">
                  <div>
                    <strong>Specialization:</strong>{" "}
                    {formData.specialization || "Not set"}
                  </div>
                  <div>
                    <strong>License:</strong>{" "}
                    {formData.licenseNumber || "Not set"}
                  </div>
                  <div>
                    <strong>Hospital:</strong>{" "}
                    {formData.hospitalName || "Not set"}
                  </div>
                </CardContent>
              </Card>
            )}

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-500 inline mr-2" />
                {error}
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full border shadow-lg mb-4">
            <div className="text-sm text-muted-foreground">
              Step {formData.currentStep + 1} of {steps.length}
            </div>
            <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full animate-pulse" />
          </div>

          <Progress
            value={getCompletionPercentage()}
            className="w-full max-w-md mx-auto h-2"
          />
          <p className="mt-2 text-sm font-medium text-muted-foreground">
            {getCompletionPercentage()}% completed
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1 space-y-2">
            {steps.map((step, index) => (
              <Button
                key={step.id}
                variant={
                  formData.currentStep === index
                    ? "default"
                    : formData.completedSteps.includes(index)
                    ? "secondary"
                    : "ghost"
                }
                className="w-full justify-start h-12 p-3 text-left group"
                onClick={() => updateFormData("currentStep", index)}
              >
                <step.icon className="w-4 h-4 mr-3" />
                <span className="flex-1 text-sm truncate">{step.title}</span>
                {formData.completedSteps.includes(index) && (
                  <Check className="w-4 h-4 text-green-500" />
                )}
              </Button>
            ))}
          </div>

          <div className="lg:col-span-3">
            <div className="bg-white/60 backdrop-blur-sm rounded-3xl border shadow-xl overflow-hidden">
              <div className="p-6 lg:p-10">{renderStepContent()}</div>

              <div className="bg-gradient-to-r from-gray-50/50 to-white/50 border-t p-6 flex flex-col sm:flex-row gap-4 justify-between items-center">
                {formData.currentStep > 0 && (
                  <Button
                    variant="outline"
                    onClick={prevStep}
                    className="flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Previous
                  </Button>
                )}

                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto sm:ml-auto">
                  {formData.currentStep < steps.length - 1 && (
                    <>
                      <Button
                        variant="outline"
                        onClick={skipCurrentStep}
                        className="flex items-center gap-2"
                      >
                        <SkipForward className="w-4 h-4" />
                        Skip
                      </Button>
                      <Button
                        onClick={nextStep}
                        className="flex items-center gap-2 min-w-[120px]"
                      >
                        {formData.currentStep < steps.length - 2
                          ? "Next"
                          : "Continue"}
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </>
                  )}

                  {formData.currentStep === steps.length - 1 && (
                    <Button
                      onClick={handleCompleteProfile}
                      disabled={loading}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 flex items-center gap-2 min-w-[150px]"
                    >
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Completing...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-5 h-5" />
                          <span>Complete Profile</span>
                        </>
                      )}
                    </Button>
                  )}
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSkipAll}
                  className="text-muted-foreground hover:text-foreground"
                >
                  Skip All & Complete Later
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}