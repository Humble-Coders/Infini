import type { Metadata } from "next";
import { requireRole } from "@/lib/auth/requireRole";
import { ComingSoonSection } from "@/components/admin/ComingSoonSection";

export const metadata: Metadata = { title: "Testimonials" };

export default async function AdminTestimonialsPage() {
  await requireRole(["superAdmin", "contentEditor"]);
  return <ComingSoonSection title="Testimonials" />;
}
