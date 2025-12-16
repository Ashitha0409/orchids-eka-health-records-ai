"use client";

import { useState } from "react";
import { RecordCard } from "@/components/dashboard/record-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Search,
  Filter,
  Upload,
  FileText,
  Image as ImageIcon,
  Pill,
  ClipboardList,
  Sparkles,
  Calendar,
  Building2,
  User,
  Download,
  X,
} from "lucide-react";
import { mockRecords } from "@/lib/mock-data";
import { MedicalRecord } from "@/lib/types";
import { cn } from "@/lib/utils";

const typeFilters = [
  { value: "all", label: "All Types", icon: FileText },
  { value: "lab", label: "Lab Reports", icon: FileText },
  { value: "imaging", label: "Imaging", icon: ImageIcon },
  { value: "prescription", label: "Prescriptions", icon: Pill },
  { value: "visit-note", label: "Visit Notes", icon: ClipboardList },
];

const typeIcons = {
  lab: FileText,
  imaging: ImageIcon,
  prescription: Pill,
  "visit-note": ClipboardList,
  discharge: FileText,
};

export default function RecordsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);

  const filteredRecords = mockRecords.filter((record) => {
    const matchesSearch =
      record.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.hospital?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.doctor?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "all" || record.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const Icon = selectedRecord ? typeIcons[selectedRecord.type] : FileText;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            Medical Records
          </h1>
          <p className="text-muted-foreground">
            View and manage your health records with AI summaries
          </p>
        </div>
        <Button className="gap-2 rounded-xl bg-primary text-white">
          <Upload className="h-4 w-4" />
          Upload Record
        </Button>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search records, hospitals, doctors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 rounded-xl pl-10"
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="h-10 w-full rounded-xl sm:w-48">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            {typeFilters.map((filter) => (
              <SelectItem key={filter.value} value={filter.value}>
                <span className="flex items-center gap-2">
                  <filter.icon className="h-4 w-4" />
                  {filter.label}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-wrap gap-2">
        {typeFilters.slice(1).map((filter) => (
          <button
            key={filter.value}
            onClick={() =>
              setTypeFilter(typeFilter === filter.value ? "all" : filter.value)
            }
            className={cn(
              "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all",
              typeFilter === filter.value
                ? "bg-primary text-white"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            <filter.icon className="h-4 w-4" />
            {filter.label}
          </button>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {filteredRecords.map((record) => (
          <RecordCard
            key={record.id}
            record={record}
            onClick={() => setSelectedRecord(record)}
          />
        ))}
      </div>

      {filteredRecords.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/20 py-16">
          <FileText className="h-12 w-12 text-muted-foreground/50" />
          <p className="mt-4 font-medium text-muted-foreground">No records found</p>
          <p className="text-sm text-muted-foreground">
            Try adjusting your search or filters
          </p>
        </div>
      )}

      <Sheet open={!!selectedRecord} onOpenChange={() => setSelectedRecord(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
          {selectedRecord && (
            <>
              <SheetHeader>
                <div className="flex items-start gap-4">
                  <div
                    className={cn(
                      "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl",
                      selectedRecord.type === "lab"
                        ? "bg-info/10 text-info"
                        : selectedRecord.type === "imaging"
                        ? "bg-purple-100 text-purple-600"
                        : selectedRecord.type === "prescription"
                        ? "bg-success/10 text-success"
                        : "bg-warning/10 text-warning"
                    )}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <SheetTitle className="text-lg">{selectedRecord.title}</SheetTitle>
                    <p className="text-sm text-muted-foreground capitalize">
                      {selectedRecord.type.replace("-", " ")}
                    </p>
                  </div>
                </div>
              </SheetHeader>

              <div className="mt-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-xl bg-muted/50 p-3">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      Date
                    </div>
                    <p className="mt-1 font-medium text-foreground">
                      {selectedRecord.date}
                    </p>
                  </div>
                  <div className="rounded-xl bg-muted/50 p-3">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Building2 className="h-3 w-3" />
                      Hospital
                    </div>
                    <p className="mt-1 font-medium text-foreground">
                      {selectedRecord.hospital}
                    </p>
                  </div>
                  <div className="col-span-2 rounded-xl bg-muted/50 p-3">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <User className="h-3 w-3" />
                      Doctor
                    </div>
                    <p className="mt-1 font-medium text-foreground">
                      {selectedRecord.doctor}
                    </p>
                  </div>
                </div>

                {selectedRecord.aiSummary && (
                  <div className="rounded-xl bg-gradient-to-r from-primary/5 to-teal-50 p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium text-primary">
                        AI Summary
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {selectedRecord.aiSummary}
                    </p>
                  </div>
                )}

                <div>
                  <h4 className="mb-2 text-sm font-medium text-foreground">
                    Details
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedRecord.summary}
                  </p>
                </div>

                {selectedRecord.tags && selectedRecord.tags.length > 0 && (
                  <div>
                    <h4 className="mb-2 text-sm font-medium text-foreground">
                      Tags
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedRecord.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="capitalize">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  <Button className="flex-1 gap-2 rounded-xl" variant="outline">
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                  <Button className="flex-1 gap-2 rounded-xl bg-primary text-white">
                    <Sparkles className="h-4 w-4" />
                    Ask AI
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
