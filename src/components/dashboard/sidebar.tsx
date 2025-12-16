"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Home,
  FileText,
  Pill,
  Calendar,
  Receipt,
  Settings,
  Users,
  ClipboardList,
  Activity,
  LogOut,
  Stethoscope,
} from "lucide-react";

interface SidebarProps {
  role: "patient" | "doctor";
}

const patientLinks = [
  { href: "/patient-dashboard", label: "Home", icon: Home },
  { href: "/patient-dashboard/records", label: "Medical Records", icon: FileText },
  { href: "/patient-dashboard/medications", label: "Medications", icon: Pill },
  { href: "/patient-dashboard/appointments", label: "Appointments", icon: Calendar },
  { href: "/patient-dashboard/billing", label: "Billing", icon: Receipt },
  { href: "/patient-dashboard/settings", label: "Settings", icon: Settings },
];

const doctorLinks = [
  { href: "/doctor-dashboard", label: "Home", icon: Home },
  { href: "/doctor-dashboard/patients", label: "Patients", icon: Users },
  { href: "/doctor-dashboard/appointments", label: "Appointments", icon: Calendar },
  { href: "/doctor-dashboard/queue", label: "Queue", icon: ClipboardList },
  { href: "/doctor-dashboard/billing", label: "Billing", icon: Receipt },
  { href: "/doctor-dashboard/settings", label: "Settings", icon: Settings },
];

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const links = role === "patient" ? patientLinks : doctorLinks;

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-white">
      <div className="flex h-full flex-col">
        <div className="flex h-16 items-center gap-2 border-b border-border px-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
            {role === "patient" ? (
              <Activity className="h-5 w-5 text-white" />
            ) : (
              <Stethoscope className="h-5 w-5 text-white" />
            )}
          </div>
          <span className="font-display text-xl font-semibold text-foreground">
            MedSense
          </span>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {links.map((link) => {
            const isActive = pathname === link.href || 
              (link.href !== "/patient-dashboard" && link.href !== "/doctor-dashboard" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-primary text-white shadow-sm"
                    : "text-muted-foreground hover:bg-secondary hover:text-secondary-foreground"
                )}
              >
                <link.icon className="h-5 w-5" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-border p-3">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground transition-all duration-200 hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut className="h-5 w-5" />
            Sign Out
          </Link>
        </div>
      </div>
    </aside>
  );
}
