import type { Metadata } from "next";
import { requireRole } from "@/lib/auth/requireRole";
import { CertificationsManager } from "@/components/admin/certifications/CertificationsManager";

export const metadata: Metadata = { title: "Certifications" };

export default async function AdminCertificationsPage() {
  await requireRole(["superAdmin", "contentEditor"]);
  return (
    <div className="space-y-6">
      <h1 className="text-lg font-semibold text-foreground">Certifications</h1>
      <CertificationsManager />
    </div>
  );
}
