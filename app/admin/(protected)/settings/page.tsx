import type { Metadata } from "next";
import { requireRole } from "@/lib/auth/requireRole";
import { CompanySettingsManager } from "@/components/modules/CompanySettingsManager";

export const metadata: Metadata = { title: "Company Profile & Channels | Infini Admin" };

export default async function AdminSettingsPage() {
  await requireRole(["superAdmin"]);
  return (
    <div className="w-full">
      <CompanySettingsManager />
    </div>
  );
}
