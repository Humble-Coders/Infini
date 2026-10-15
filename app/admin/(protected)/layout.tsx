import type { Metadata } from "next";
import type { ReactNode } from "react";
import { requireSession } from "@/lib/auth/requireRole";
import { ClaimsSync } from "@/components/admin/ClaimsSync";
import { AdminTopNav } from "@/components/admin/AdminTopNav";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function ProtectedAdminLayout({ children }: { children: ReactNode }) {
  const session = await requireSession();

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-clip bg-background text-foreground antialiased selection:bg-accent/20 selection:text-accent">
      <ClaimsSync uid={session.uid} role={session.role} />
      <AdminTopNav email={session.email} role={session.role} />
      <main className="mx-auto w-full max-w-[1600px] p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}
