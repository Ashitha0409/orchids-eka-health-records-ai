"use client";

import { cn } from "@/lib/utils";
import { Bill } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Building2, FlaskConical, Store, Stethoscope } from "lucide-react";

interface BillCardProps {
  bill: Bill;
}

const typeIcons = {
  hospital: Building2,
  lab: FlaskConical,
  pharmacy: Store,
  consultation: Stethoscope,
};

const statusStyles = {
  paid: "bg-success/10 text-success border-success/20",
  unpaid: "bg-destructive/10 text-destructive border-destructive/20",
  "claim-pending": "bg-warning/10 text-warning border-warning/20",
  partial: "bg-info/10 text-info border-info/20",
};

export function BillCard({ bill }: BillCardProps) {
  const Icon = typeIcons[bill.type];

  return (
    <div className="rounded-2xl border border-border bg-white p-4 transition-all hover:shadow-md">
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted">
          <Icon className="h-5 w-5 text-muted-foreground" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="font-medium text-foreground">{bill.provider}</p>
            <Badge
              variant="outline"
              className={cn("text-xs capitalize", statusStyles[bill.status])}
            >
              {bill.status.replace("-", " ")}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">{bill.description}</p>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-xs text-muted-foreground">{bill.date}</span>
            <div className="text-right">
              <p className="font-display text-lg font-semibold text-foreground">
                ${bill.amount.toFixed(2)}
              </p>
              {bill.insuranceCovered && (
                <p className="text-xs text-success">
                  Insurance: ${bill.insuranceCovered.toFixed(2)}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
