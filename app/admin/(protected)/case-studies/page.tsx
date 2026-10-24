import type { Metadata } from "next";
import { requireRole } from "@/lib/auth/requireRole";
import { CaseStudiesManager } from "@/components/modules/CaseStudiesManager";

export const metadata: Metadata = { title: "Case Studies | Infini Admin" };

export default async function AdminCaseStudiesPage() {
  await requireRole(["superAdmin", "contentEditor"]);
  return (
    <div className="w-full">
      <CaseStudiesManager />
    </div>
  );
}
