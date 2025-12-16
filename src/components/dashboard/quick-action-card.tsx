"use client";

import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import Link from "next/link";

interface QuickActionCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  variant?: "default" | "primary" | "secondary";
}

export function QuickActionCard({
  title,
  description,
  icon: Icon,
  href,
  variant = "default",
}: QuickActionCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group flex items-center gap-4 rounded-2xl border p-4 transition-all duration-200",
        variant === "primary"
          ? "border-primary/20 bg-primary/5 hover:border-primary/40 hover:bg-primary/10"
          : variant === "secondary"
          ? "border-secondary bg-secondary hover:border-primary/20"
          : "border-border bg-white hover:border-primary/20 hover:shadow-md"
      )}
    >
      <div
        className={cn(
          "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-colors",
          variant === "primary"
            ? "bg-primary text-white"
            : "bg-muted group-hover:bg-primary/10 group-hover:text-primary"
        )}
      >
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-medium text-foreground">{title}</p>
        <p className="truncate text-sm text-muted-foreground">{description}</p>
      </div>
    </Link>
  );
}
