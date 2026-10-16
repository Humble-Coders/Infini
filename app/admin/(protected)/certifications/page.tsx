import type { Metadata } from "next";
import { requireRole } from "@/lib/auth/requireRole";
import { CertificationsManager } from "@/components/modules/CertificationsManager";

export const metadata: Metadata = { title: "Certifications & Accreditations | Infini Admin" };

export default async function AdminCertificationsPage() {
  await requireRole(["superAdmin", "contentEditor"]);
  return (
    <div className="w-full">
      <CertificationsManager />
    </div>
  );
}
