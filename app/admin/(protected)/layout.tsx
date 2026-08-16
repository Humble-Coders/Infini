import type { Metadata } from "next";
import type { ReactNode } from "react";
import { requireSession } from "@/lib/auth/requireRole";
import { SignOutButton } from "@/components/admin/SignOutButton";
import { ClaimsSync } from "@/components/admin/ClaimsSync";
import { AdminSidebarNav } from "@/components/admin/AdminSidebarNav";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

// Sidebar is visible from md (768px) up, matching the ticket's floor
// ("usable at 768px and above" — an iPad in portrait). Below that, nav is
// intentionally out of scope for this ticket rather than half-built.
export default async function ProtectedAdminLayout({ children }: { children: ReactNode }) {
  const session = await requireSession();

  return (
    <div className="min-h-screen bg-background md:grid md:grid-cols-[240px_1fr] md:grid-rows-[auto_1fr]">
      <ClaimsSync uid={session.uid} role={session.role} />
      <header className="flex items-center justify-between border-b border-border px-6 py-3 md:col-span-2">
        <span className="text-sm font-medium text-foreground">INFINI Admin</span>
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <span className="hidden sm:inline">
            {session.email} · {session.role}
          </span>
          <SignOutButton />
        </div>
      </header>
      <aside className="hidden border-r border-border md:block">
        <AdminSidebarNav role={session.role} />
      </aside>
      <main className="p-6">{children}</main>
    </div>
  );
}
