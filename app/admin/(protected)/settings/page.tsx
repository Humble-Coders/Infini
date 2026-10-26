import type { Metadata } from "next";
import { requireRole } from "@/lib/auth/requireRole";
import { CompanySettingsManager } from "@/components/modules/CompanySettingsManager";
import { getStoredCompanySettings } from "@/lib/data/companySettingsStorage";
import { toClientJson } from "@/lib/data/clientJson";

export const metadata: Metadata = { title: "Company Profile & Channels | Infini Admin" };

export default async function AdminSettingsPage() {
  await requireRole(["superAdmin"]);
  const data = toClientJson(await getStoredCompanySettings());
  return (
    <div className="w-full">
      <CompanySettingsManager initialSettings={data} />
    </div>
  );
}
