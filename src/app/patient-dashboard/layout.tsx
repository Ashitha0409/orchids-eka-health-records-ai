import { Sidebar } from "@/components/dashboard/sidebar";
import { TopNav } from "@/components/dashboard/top-nav";
import { mockPatient } from "@/lib/mock-data";

export default function PatientDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar role="patient" />
      <div className="ml-64">
        <TopNav user={mockPatient} />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
