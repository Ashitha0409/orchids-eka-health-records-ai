"use client";

import { cn } from "@/lib/utils";
import { MedicalRecord } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Image as ImageIcon,
  Pill,
  ClipboardList,
  FileCheck,
  Sparkles,
} from "lucide-react";

interface RecordCardProps {
  record: MedicalRecord;
  onClick?: () => void;
}

const typeIcons = {
  lab: FileText,
  imaging: ImageIcon,
  prescription: Pill,
  "visit-note": ClipboardList,
  discharge: FileCheck,
};

const typeColors = {
  lab: "bg-info/10 text-info",
  imaging: "bg-purple-100 text-purple-600",
  prescription: "bg-success/10 text-success",
  "visit-note": "bg-warning/10 text-warning",
  discharge: "bg-muted text-muted-foreground",
};

export function RecordCard({ record, onClick }: RecordCardProps) {
  const Icon = typeIcons[record.type];

  return (
    <button
      onClick={onClick}
      className="w-full rounded-2xl border border-border bg-white p-4 text-left transition-all hover:border-primary/20 hover:shadow-md"
    >
      <div className="flex items-start gap-4">
        <div
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
            typeColors[record.type]
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="font-medium text-foreground">{record.title}</p>
            <span className="shrink-0 text-xs text-muted-foreground">
              {record.date}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            {record.hospital} • {record.doctor}
          </p>
          {record.aiSummary && (
            <div className="mt-2 flex items-start gap-2 rounded-lg bg-gradient-to-r from-primary/5 to-teal-50 p-2">
              <Sparkles className="mt-0.5 h-3 w-3 shrink-0 text-primary" />
              <p className="line-clamp-2 text-xs text-muted-foreground">
                {record.aiSummary}
              </p>
            </div>
          )}
          {record.tags && record.tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {record.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="text-xs capitalize"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
    </button>
  );
}
