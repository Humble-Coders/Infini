import type { Metadata } from "next";
import { requireRole } from "@/lib/auth/requireRole";
import { ComingSoonSection } from "@/components/admin/ComingSoonSection";

export const metadata: Metadata = { title: "Settings" };

export default async function AdminSettingsPage() {
  await requireRole(["superAdmin"]);
  return <ComingSoonSection title="Settings" />;
}
