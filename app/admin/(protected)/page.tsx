import { requireSession } from "@/lib/auth/requireRole";
import { RecentLeadsWidget } from "@/components/admin/RecentLeadsWidget";
import { ContentCountsWidget } from "@/components/admin/ContentCountsWidget";
import { QuickActions } from "@/components/admin/QuickActions";

// Which widgets render is permission-gated in code (not just Firestore
// rules) so a Leads Manager's dashboard never even attempts a content-count
// read it would be denied anyway — the acceptance criterion is "no failed
// permission errors in the console", not just "denied gracefully".
export default async function AdminDashboardPage() {
  const session = await requireSession();
  const canSeeLeads = session.role === "superAdmin" || session.role === "leadsManager";
  const canSeeContentCounts = session.role === "superAdmin" || session.role === "contentEditor";

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-lg font-semibold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Signed in as {session.email} ({session.role})
        </p>
      </div>

      {canSeeContentCounts && (
        <section className="space-y-3">
          <h2 className="text-sm font-medium text-foreground">Content</h2>
          <ContentCountsWidget />
        </section>
      )}

      {canSeeLeads && (
        <section className="space-y-3">
          <h2 className="text-sm font-medium text-foreground">Leads</h2>
          <RecentLeadsWidget />
        </section>
      )}

      <section className="space-y-3">
        <h2 className="text-sm font-medium text-foreground">Quick actions</h2>
        <QuickActions role={session.role} />
      </section>
    </div>
  );
}
