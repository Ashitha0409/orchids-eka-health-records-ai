"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Activity,
  Stethoscope,
  ArrowRight,
  Shield,
  Sparkles,
  FileText,
  Calendar,
  Heart,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function Home() {
  const [isLogin, setIsLogin] = useState(true);
  const [selectedRole, setSelectedRole] = useState<"patient" | "doctor" | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-white to-secondary/30">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
      
      <nav className="relative z-10 flex items-center justify-between px-6 py-4 lg:px-12">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20">
            <Activity className="h-5 w-5 text-white" />
          </div>
          <span className="font-display text-2xl font-bold text-foreground">
            MedSense
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
            About
          </Button>
          <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
            Features
          </Button>
        </div>
      </nav>

      <main className="relative z-10 mx-auto max-w-7xl px-6 py-12 lg:px-12">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="flex flex-col justify-center">
            <div className="mb-4 inline-flex w-fit items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              <Sparkles className="h-4 w-4" />
              AI-Powered Healthcare
            </div>
            <h1 className="font-display text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Your Health,{" "}
              <span className="bg-gradient-to-r from-primary to-teal-500 bg-clip-text text-transparent">
                Intelligently
              </span>{" "}
              Managed
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              MedSense brings together your medical records, medications, appointments, and bills in one place. 
              Powered by AI to give you insights that matter.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 rounded-xl bg-white/80 p-4 shadow-sm backdrop-blur-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Smart Records</p>
                  <p className="text-sm text-muted-foreground">AI summaries</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl bg-white/80 p-4 shadow-sm backdrop-blur-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
                  <Calendar className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Appointments</p>
                  <p className="text-sm text-muted-foreground">Easy booking</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl bg-white/80 p-4 shadow-sm backdrop-blur-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-info/10">
                  <Heart className="h-5 w-5 text-info" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Medications</p>
                  <p className="text-sm text-muted-foreground">Never miss a dose</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl bg-white/80 p-4 shadow-sm backdrop-blur-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10">
                  <Shield className="h-5 w-5 text-warning" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Secure</p>
                  <p className="text-sm text-muted-foreground">HIPAA compliant</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <div className="w-full max-w-md rounded-3xl border border-border bg-white p-8 shadow-xl shadow-black/5">
              <div className="mb-6 flex items-center justify-center gap-2">
                <button
                  onClick={() => setIsLogin(true)}
                  className={cn(
                    "px-4 py-2 text-sm font-medium transition-colors",
                    isLogin
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Sign In
                </button>
                <div className="h-4 w-px bg-border" />
                <button
                  onClick={() => setIsLogin(false)}
                  className={cn(
                    "px-4 py-2 text-sm font-medium transition-colors",
                    !isLogin
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Sign Up
                </button>
              </div>

              <h2 className="text-center font-display text-2xl font-semibold text-foreground">
                {isLogin ? "Welcome Back" : "Create Account"}
              </h2>
              <p className="mt-2 text-center text-sm text-muted-foreground">
                {isLogin
                  ? "Sign in to access your health dashboard"
                  : "Join MedSense for smarter health management"}
              </p>

              {!isLogin && !selectedRole && (
                <div className="mt-6 space-y-3">
                  <p className="text-center text-sm font-medium text-foreground">
                    I am a...
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setSelectedRole("patient")}
                      className="flex flex-col items-center gap-2 rounded-2xl border-2 border-border bg-white p-4 transition-all hover:border-primary hover:bg-primary/5"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                        <Activity className="h-6 w-6 text-primary" />
                      </div>
                      <span className="font-medium text-foreground">Patient</span>
                      <span className="text-xs text-muted-foreground">
                        or Caregiver
                      </span>
                    </button>
                    <button
                      onClick={() => setSelectedRole("doctor")}
                      className="flex flex-col items-center gap-2 rounded-2xl border-2 border-border bg-white p-4 transition-all hover:border-primary hover:bg-primary/5"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-100">
                        <Stethoscope className="h-6 w-6 text-teal-600" />
                      </div>
                      <span className="font-medium text-foreground">Doctor</span>
                      <span className="text-xs text-muted-foreground">
                        Healthcare Provider
                      </span>
                    </button>
                  </div>
                </div>
              )}

              {(isLogin || selectedRole) && (
                <form className="mt-6 space-y-4">
                  {!isLogin && (
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        placeholder="Enter your full name"
                        className="h-11 rounded-xl"
                      />
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      className="h-11 rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      className="h-11 rounded-xl"
                    />
                  </div>

                  {isLogin ? (
                    <>
                      <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                          />
                          <span className="text-muted-foreground">Remember me</span>
                        </label>
                        <button type="button" className="text-primary hover:underline">
                          Forgot password?
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-3 pt-2">
                        <Link href="/patient-dashboard" className="w-full">
                          <Button className="w-full gap-2 rounded-xl bg-primary py-5 text-white hover:bg-primary/90">
                            Patient
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link href="/doctor-dashboard" className="w-full">
                          <Button
                            variant="outline"
                            className="w-full gap-2 rounded-xl border-primary py-5 text-primary hover:bg-primary/5"
                          >
                            Doctor
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </>
                  ) : (
                    <Link
                      href={selectedRole === "doctor" ? "/doctor-dashboard" : "/patient-dashboard"}
                      className="block pt-2"
                    >
                      <Button className="w-full gap-2 rounded-xl bg-primary py-5 text-white hover:bg-primary/90">
                        Create Account
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  )}
                </form>
              )}

              {!isLogin && selectedRole && (
                <button
                  onClick={() => setSelectedRole(null)}
                  className="mt-4 w-full text-center text-sm text-muted-foreground hover:text-foreground"
                >
                  ← Back to role selection
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
