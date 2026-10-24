import type { Metadata } from "next";
import { requireRole } from "@/lib/auth/requireRole";
import { ComingSoonSection } from "@/components/admin/ComingSoonSection";

export const metadata: Metadata = { title: "Company & Capabilities" };

export default async function AdminCompanyCapabilitiesPage() {
  await requireRole(["superAdmin", "contentEditor"]);
  return <ComingSoonSection title="Company & Capabilities" />;
}
