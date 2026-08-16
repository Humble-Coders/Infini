import type { Metadata } from "next";
import { requireRole } from "@/lib/auth/requireRole";
import { ComingSoonSection } from "@/components/admin/ComingSoonSection";

export const metadata: Metadata = { title: "Case Studies" };

export default async function AdminCaseStudiesPage() {
  await requireRole(["superAdmin", "contentEditor"]);
  return <ComingSoonSection title="Case Studies" />;
}
