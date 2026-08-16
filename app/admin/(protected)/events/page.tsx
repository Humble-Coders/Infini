import type { Metadata } from "next";
import { requireRole } from "@/lib/auth/requireRole";
import { ComingSoonSection } from "@/components/admin/ComingSoonSection";

export const metadata: Metadata = { title: "Events" };

export default async function AdminEventsPage() {
  await requireRole(["superAdmin", "contentEditor"]);
  return <ComingSoonSection title="Events" />;
}
