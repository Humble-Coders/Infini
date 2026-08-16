import type { Metadata } from "next";
import { requireRole } from "@/lib/auth/requireRole";
import { ComingSoonSection } from "@/components/admin/ComingSoonSection";

export const metadata: Metadata = { title: "Pages" };

export default async function AdminPagesPage() {
  await requireRole(["superAdmin", "contentEditor"]);
  return <ComingSoonSection title="Pages" />;
}
