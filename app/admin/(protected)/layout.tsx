import type { Metadata } from "next";
import type { ReactNode } from "react";
import { requireSession } from "@/lib/auth/requireRole";
import { SignOutButton } from "@/components/admin/SignOutButton";
import { ClaimsSync } from "@/components/admin/ClaimsSync";

// T7 replaces this bare shell with the real admin layout/nav/dashboard.
// T6's job is only the auth boundary: every route under here requires a
// valid session, verified server-side via verifySession() -> Firestore-rule
// backed custom claim, not just a client-visible flag.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function ProtectedAdminLayout({ children }: { children: ReactNode }) {
  const session = await requireSession();

  return (
    <div className="min-h-screen bg-background">
      <ClaimsSync uid={session.uid} role={session.role} />
      <header className="flex items-center justify-between border-b border-border px-6 py-3">
        <span className="text-sm font-medium text-foreground">INFINI Admin</span>
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <span>
            {session.email} · {session.role}
          </span>
          <SignOutButton />
        </div>
      </header>
      <div className="p-6">{children}</div>
    </div>
  );
}
