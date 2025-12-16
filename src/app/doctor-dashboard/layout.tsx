import { Sidebar } from "@/components/dashboard/sidebar";
import { TopNav } from "@/components/dashboard/top-nav";
import { mockDoctor } from "@/lib/mock-data";

export default function DoctorDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar role="doctor" />
      <div className="ml-64">
        <TopNav user={mockDoctor} />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
