import type { Metadata } from "next";
import { requireRole } from "@/lib/auth/requireRole";
import { LeadsCRMManager } from "@/components/modules/LeadsCRMManager";
import { getStoredLeads } from "@/lib/data/leadsStorage";
import { toClientJson } from "@/lib/data/clientJson";

export const metadata: Metadata = { title: "Inquiries & Leads | Infini Admin" };

export default async function AdminLeadsPage() {
  await requireRole(["superAdmin", "leadsManager"]);
  const data = toClientJson(await getStoredLeads());
  return (
    <div className="w-full">
      <LeadsCRMManager initialLeads={data} />
    </div>
  );
}
