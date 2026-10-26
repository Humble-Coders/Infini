import type { Metadata } from "next";
import { requireRole } from "@/lib/auth/requireRole";
import { CaseStudiesManager } from "@/components/modules/CaseStudiesManager";
import { getStoredCaseStudies } from "@/lib/data/caseStudiesStorage";
import { toClientJson } from "@/lib/data/clientJson";

export const metadata: Metadata = { title: "Case Studies | Infini Admin" };

export default async function AdminCaseStudiesPage() {
  await requireRole(["superAdmin", "contentEditor"]);
  const data = toClientJson(await getStoredCaseStudies());
  return (
    <div className="w-full">
      <CaseStudiesManager initialCaseStudies={data} />
    </div>
  );
}
