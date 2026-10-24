import type { Metadata } from "next";
import { requireRole } from "@/lib/auth/requireRole";
import { TestimonialsManager } from "@/components/modules/TestimonialsManager";

export const metadata: Metadata = { title: "Testimonials & Reviews | Infini Admin" };

export default async function AdminTestimonialsPage() {
  await requireRole(["superAdmin", "contentEditor"]);
  return (
    <div className="w-full">
      <TestimonialsManager />
    </div>
  );
}
