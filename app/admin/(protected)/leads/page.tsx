import type { Metadata } from "next";
import { requireRole } from "@/lib/auth/requireRole";
import { LeadsCRMManager } from "@/components/modules/LeadsCRMManager";

export const metadata: Metadata = { title: "Inquiries & Leads | Infini Admin" };

export default async function AdminLeadsPage() {
  await requireRole(["superAdmin", "leadsManager"]);
  return (
    <div className="w-full">
      <LeadsCRMManager />
    </div>
  );
}
