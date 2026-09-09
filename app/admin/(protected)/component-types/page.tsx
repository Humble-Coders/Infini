import type { Metadata } from "next";
import { requireRole } from "@/lib/auth/requireRole";
import { ComingSoonSection } from "@/components/admin/ComingSoonSection";

export const metadata: Metadata = { title: "Component Types" };

export default async function AdminComponentTypesPage() {
  await requireRole(["superAdmin", "contentEditor"]);
  return <ComingSoonSection title="Component Types" />;
}
