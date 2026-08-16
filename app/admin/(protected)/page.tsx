import { requireSession } from "@/lib/auth/requireRole";

// Placeholder only — T7 builds the real dashboard (leads summary, recent
// content, etc.) behind this same auth boundary.
export default async function AdminHomePage() {
  const session = await requireSession();

  return (
    <div className="space-y-2">
      <h1 className="text-lg font-semibold text-foreground">Signed in</h1>
      <p className="text-sm text-muted-foreground">
        {session.email} — role: {session.role}
      </p>
    </div>
  );
}
