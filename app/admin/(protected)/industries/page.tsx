import type { Metadata } from "next";
import { requireRole } from "@/lib/auth/requireRole";
import { ComingSoonSection } from "@/components/admin/ComingSoonSection";

export const metadata: Metadata = { title: "Industries" };

export default async function AdminIndustriesPage() {
  await requireRole(["superAdmin", "contentEditor"]);
  return <ComingSoonSection title="Industries" />;
}
