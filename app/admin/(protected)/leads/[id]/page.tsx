import type { Metadata } from "next";
import { requireRole } from "@/lib/auth/requireRole";
import { LeadDetailView } from "@/components/modules/LeadDetailView";

export const metadata: Metadata = { title: "Inquiry Assessment | Infini Admin" };

export default async function AdminLeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireRole(["superAdmin", "leadsManager"]);
  const { id } = await params;

  return (
    <div className="w-full">
      <LeadDetailView leadId={id} />
    </div>
  );
}
