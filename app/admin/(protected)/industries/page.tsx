import type { Metadata } from "next";
import { requireRole } from "@/lib/auth/requireRole";
import { IndustriesManager } from "@/components/modules/IndustriesManager";

export const metadata: Metadata = { title: "Industries & Sectors | Infini Admin" };

export default async function AdminIndustriesPage() {
  await requireRole(["superAdmin", "contentEditor"]);
  return (
    <div className="w-full">
      <IndustriesManager />
    </div>
  );
}
