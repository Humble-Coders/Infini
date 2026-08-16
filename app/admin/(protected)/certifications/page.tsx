import type { Metadata } from "next";
import { requireRole } from "@/lib/auth/requireRole";
import { ComingSoonSection } from "@/components/admin/ComingSoonSection";

export const metadata: Metadata = { title: "Certifications" };

export default async function AdminCertificationsPage() {
  await requireRole(["superAdmin", "contentEditor"]);
  return <ComingSoonSection title="Certifications" />;
}
