import type { Metadata } from "next";
import { requireRole } from "@/lib/auth/requireRole";
import { ComingSoonSection } from "@/components/admin/ComingSoonSection";

export const metadata: Metadata = { title: "News" };

export default async function AdminNewsPage() {
  await requireRole(["superAdmin", "contentEditor"]);
  return <ComingSoonSection title="News" />;
}
