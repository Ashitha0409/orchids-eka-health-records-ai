"use client";

import { cn } from "@/lib/utils";
import { Medication } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Pill, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface MedicationCardProps {
  medication: Medication;
}

export function MedicationCard({ medication }: MedicationCardProps) {
  const adherenceColor =
    medication.adherence && medication.adherence >= 90
      ? "text-success"
      : medication.adherence && medication.adherence >= 70
      ? "text-warning"
      : "text-destructive";

  return (
    <div
      className={cn(
        "rounded-2xl border bg-white p-4 transition-all hover:shadow-md",
        medication.isActive ? "border-border" : "border-dashed opacity-60"
      )}
    >
      <div className="flex items-start gap-4">
        <div
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
            medication.isActive ? "bg-success/10" : "bg-muted"
          )}
        >
          <Pill
            className={cn(
              "h-5 w-5",
              medication.isActive ? "text-success" : "text-muted-foreground"
            )}
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="font-medium text-foreground">{medication.name}</p>
            <Badge
              variant={medication.isActive ? "default" : "secondary"}
              className={cn(
                "text-xs",
                medication.isActive
                  ? "bg-success/10 text-success border-success/20"
                  : ""
              )}
            >
              {medication.isActive ? "Active" : "Completed"}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            {medication.dosage} • {medication.frequency}
          </p>

          <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>{medication.timing.join(", ")}</span>
          </div>

          {medication.isActive && medication.adherence !== undefined && (
            <div className="mt-3 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Adherence</span>
                <span className={cn("font-medium", adherenceColor)}>
                  {medication.adherence}%
                </span>
              </div>
              <Progress
                value={medication.adherence}
                className="h-1.5"
              />
            </div>
          )}

          {medication.notes && (
            <p className="mt-2 text-xs text-muted-foreground">
              {medication.notes}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
