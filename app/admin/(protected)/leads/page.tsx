import type { Metadata } from "next";
import { requireRole } from "@/lib/auth/requireRole";
import { ComingSoonSection } from "@/components/admin/ComingSoonSection";

export const metadata: Metadata = { title: "Leads" };

export default async function AdminLeadsPage() {
  await requireRole(["superAdmin", "leadsManager"]);
  return <ComingSoonSection title="Leads" />;
}
