"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Heart,
  Edit,
  CheckCircle2,
  AlertCircle,
  Camera
} from "lucide-react";
import { TopNav } from "@/components/dashboard/top-nav";
import { toast } from "sonner";

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  role: 'patient' | 'doctor';
  phone: string;
  address: string;
  dateOfBirth?: string;
  bloodGroup?: string;
  profilePhoto?: string;

  // Profile completion
  profileCompleted: boolean;
  profileCompletionPercentage: number;

  // Karma Points
  karmaPoints?: number;
  tier?: 'Normal' | 'Premium' | 'Elite';
}

export default function PatientProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load user data from localStorage or API
    const loadUserData = async () => {
      try {
        // Try to get from localStorage first (mock data)
        const savedUser = localStorage.getItem("user") || localStorage.getItem("pendingUser");

        if (savedUser) {
          const userData = JSON.parse(savedUser);

          // Calculate Karma Points based on profile completion and mock activity
          // Base points 0-500 from profile completion
          // Bonus points for "account age" or activity (random for demo)
          const basePoints = userData.profileCompletionPercentage ? userData.profileCompletionPercentage * 5 : 0;
          const bonusPoints = Math.floor(Math.random() * 200); // Random bonus for demo
          const totalPoints = basePoints + bonusPoints;

          let tier: 'Normal' | 'Premium' | 'Elite' = 'Normal';
          if (totalPoints >= 1000) tier = 'Elite';
          else if (totalPoints >= 500) tier = 'Premium';

          // REAL patient profile data (No "Sarah Johnson" fallback)
          const profileData: UserProfile = {
            firstName: userData.firstName || "User",
            lastName: userData.lastName || "",
            email: userData.email || "",
            role: userData.role || 'patient',
            phone: userData.phone || "Not provided",
            address: userData.address || "Not provided",
            dateOfBirth: userData.dateOfBirth || "",
            bloodGroup: userData.bloodGroup || "Not specified",
            profilePhoto: userData.profilePhoto || "",

            profileCompleted: userData.profileCompleted || false,
            profileCompletionPercentage: userData.profileCompletionPercentage || 0,

            karmaPoints: totalPoints,
            tier: tier
          };

          setUser(profileData);
        } else {
          // Redirect to signup if no user data
          router.push("/signup");
        }
      } catch (error) {
        console.error("Error loading user data:", error);
        router.push("/signup");
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [router]);

  const getCompletionPercentage = () => {
    if (!user) return 0;

    let completedFields = 0;
    let totalFields = 8; // Basic required fields for patients

    // Check basic info
    if (user.firstName && user.lastName) completedFields++;
    if (user.email) completedFields++;
    if (user.phone && user.phone !== "Not provided") completedFields++;
    if (user.address && user.address !== "Not provided") completedFields++;
    if (user.bloodGroup && user.bloodGroup !== "Not specified") completedFields++;
    if (user.profilePhoto) completedFields++;
    if (user.dateOfBirth) completedFields++;

    return Math.round((completedFields / totalFields) * 100);
  };

  const handleEditProfile = () => {
    // Navigate to profile completion page to edit
    router.push("/complete-profile");
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Not provided";
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (e) {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Profile Not Found</h2>
            <p className="text-muted-foreground mb-4">Please sign up to create your profile.</p>
            <Button onClick={() => router.push("/signup")}>Sign Up</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const completionPercentage = getCompletionPercentage();
  const nextTierPoints = user.tier === 'Normal' ? 500 : user.tier === 'Premium' ? 1000 : 2000;
  const progressToNextTier = Math.min(100, ((user.karmaPoints || 0) / nextTierPoints) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <TopNav
        user={{
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          avatar: user.profilePhoto,
          role: user.role
        }}
      />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl font-bold text-gray-900">My Profile</h1>
                {user.tier === 'Elite' && (
                  <Badge className="bg-yellow-500 text-white border-none text-lg px-3 py-1">
                    👑 Elite
                  </Badge>
                )}
                {user.tier === 'Premium' && (
                  <Badge className="bg-blue-600 text-white border-none text-lg px-3 py-1">
                    💎 Premium
                  </Badge>
                )}
                {user.tier === 'Normal' && (
                  <Badge variant="outline" className="text-gray-600 border-gray-400 text-lg px-3 py-1">
                    🛡️ Normal
                  </Badge>
                )}
              </div>
              <p className="text-lg text-muted-foreground">Manage your personal information</p>
            </div>
            <Button
              onClick={handleEditProfile}
              className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Karma Points Card */}
            <Card className="bg-card text-card-foreground border-primary/20 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Heart className="w-24 h-24 text-primary" />
              </div>
              <CardHeader className="pb-2 relative z-10">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-primary">
                    <Heart className="w-5 h-5" />
                    Karma Points
                  </CardTitle>
                  <span className="text-3xl font-bold text-primary">{user.karmaPoints}</span>
                </div>
                <CardDescription>
                  Earn points by completing your profile and health activities
                </CardDescription>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm font-medium">
                    <span className="text-foreground">{user.tier} Member</span>
                    <span className="text-muted-foreground">Next Tier: {nextTierPoints} pts</span>
                  </div>
                  <Progress value={progressToNextTier} className="h-3 bg-primary/20 [&>div]:bg-primary" />
                  <p className="text-xs text-muted-foreground mt-2">
                    {user.tier === 'Elite'
                      ? "You have reached the highest tier! maintain your health streak."
                      : `Get ${nextTierPoints - (user.karmaPoints || 0)} more points to reach ${user.tier === 'Normal' ? 'Premium' : 'Elite'} status.`}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Profile Completion Card */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                      Profile Completion
                    </CardTitle>
                  </div>
                  <span className="text-2xl font-bold text-gray-700">{completionPercentage}%</span>
                </div>
                <CardDescription>
                  Complete your profile to get better recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Progress value={completionPercentage} className="h-2 mb-4" />
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>
                    {completionPercentage === 100 ? (
                      <span className="text-green-600 font-medium">Profile completed!</span>
                    ) : (
                      `${100 - completionPercentage}% remaining`
                    )}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Profile Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Full Name</p>
                <p className="text-lg">{user.firstName} {user.lastName}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <p className="text-lg">{user.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Phone</p>
                <p className="text-lg">{user.phone}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Date of Birth</p>
                <p className="text-lg">{formatDate(user.dateOfBirth || "")}</p>
              </div>
            </CardContent>
          </Card>

          {/* Medical Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5" />
                Medical Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Blood Group</p>
                <p className="text-lg">{user.bloodGroup || "Not specified"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Emergency Contact</p>
                <p className="text-lg">Add in settings</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Allergies</p>
                <p className="text-lg">Add in medical records</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Chronic Conditions</p>
                <p className="text-lg">Add in medical records</p>
              </div>
            </CardContent>
          </Card>

          {/* Contact & Additional Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Contact & Additional
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Address</p>
                <p className="text-lg">{user.address || "Not provided"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Profile Photo</p>
                <div className="flex items-center gap-2">
                  {user.profilePhoto ? (
                    <img
                      src={user.profilePhoto}
                      alt="Profile"
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <Camera className="w-12 h-12 text-muted-foreground" />
                  )}
                  <span className="text-sm text-muted-foreground">
                    {user.profilePhoto ? "Photo uploaded" : "No photo"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Photo Section */}
        {user.profilePhoto && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Profile Photo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6">
                <img
                  src={user.profilePhoto}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                />
                <div>
                  <h3 className="text-lg font-semibold mb-2">Personal Photo</h3>
                  <p className="text-muted-foreground mb-4">
                    This photo will be visible to your healthcare providers.
                  </p>
                  <Button variant="outline" onClick={handleEditProfile}>
                    <Edit className="w-4 h-4 mr-2" />
                    Change Photo
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Health Summary Card */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-500" />
              Health Summary
            </CardTitle>
            <CardDescription>
              Quick overview of your health information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <Heart className="w-8 h-8 text-red-500 mx-auto mb-2" />
                <p className="text-sm font-medium text-red-700">Blood Group</p>
                <p className="text-lg font-bold text-red-800">{user.bloodGroup || "Not specified"}</p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <Calendar className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <p className="text-sm font-medium text-blue-700">Age</p>
                <p className="text-lg font-bold text-blue-800">
                  {user.dateOfBirth
                    ? `${new Date().getFullYear() - new Date(user.dateOfBirth).getFullYear()} years`
                    : "Not specified"
                  }
                </p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <CheckCircle2 className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <p className="text-sm font-medium text-green-700">Profile Status</p>
                <p className="text-lg font-bold text-green-800">
                  {completionPercentage === 100 ? "Complete" : `${completionPercentage}% Done`}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
