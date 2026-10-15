import { requireSession } from "@/lib/auth/requireRole";
import { ModernDashboard } from "@/components/admin/ModernDashboard";

export default async function AdminDashboardPage() {
  const session = await requireSession();

  return (
    <div className="w-full">
      <ModernDashboard email={session.email} role={session.role} />
    </div>
  );
}
