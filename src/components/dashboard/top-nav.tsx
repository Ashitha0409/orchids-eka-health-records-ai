"use client";

import { Bell, Search, Mic, ChevronDown } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface TopNavProps {
  user: {
    name: string;
    email: string;
    avatar?: string;
    role: "patient" | "doctor";
  };
  showVoice?: boolean;
}

export function TopNav({ user, showVoice = true }: TopNavProps) {
  const router = useRouter();

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const handleProfileClick = () => {
    // Navigate to profile page based on role
    if (user.role === 'doctor') {
      router.push("/doctor-dashboard/profile");
    } else {
      router.push("/patient-dashboard/profile");
    }
  };

  const handleSettingsClick = () => {
    // Navigate to settings page based on role
    if (user.role === 'doctor') {
      router.push("/doctor-dashboard/settings");
    } else {
      router.push("/patient-dashboard/settings");
    }
  };

  const handleSignOut = () => {
    // Clear any stored user data
    localStorage.removeItem("pendingUser");
    localStorage.removeItem("user");
    
    // Show sign out message
    toast.success("Signed out successfully");
    
    // Navigate to home page
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-white/80 px-6 backdrop-blur-sm">
      <div className="flex flex-1 items-center gap-4">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search records, patients, appointments..."
            className="h-10 w-full rounded-xl border-border bg-muted/50 pl-10 pr-4 text-sm placeholder:text-muted-foreground focus:bg-white"
          />
        </div>
        {showVoice && (
          <Button
            size="lg"
            className="gap-2 rounded-xl bg-gradient-to-r from-primary to-teal-600 px-4 text-white shadow-md transition-all hover:shadow-lg"
          >
            <Mic className="h-4 w-4" />
            <span className="hidden sm:inline">Ask MedSense</span>
          </Button>
        )}
      </div>

      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="relative rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-destructive" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-2 rounded-xl px-2 hover:bg-muted"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.avatar} />
                <AvatarFallback className="bg-primary/10 text-sm font-medium text-primary">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="hidden flex-col items-start md:flex">
                <span className="text-sm font-medium text-foreground">
                  {user.name}
                </span>
                <span className="text-xs text-muted-foreground capitalize">
                  {user.role}
                </span>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 rounded-xl">
            <DropdownMenuItem 
              className="rounded-lg cursor-pointer"
              onClick={handleProfileClick}
            >
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="rounded-lg cursor-pointer"
              onClick={handleSettingsClick}
            >
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="rounded-lg text-destructive focus:text-destructive cursor-pointer"
              onClick={handleSignOut}
            >
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
