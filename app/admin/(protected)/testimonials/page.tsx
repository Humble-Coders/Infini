import type { Metadata } from "next";
import { requireRole } from "@/lib/auth/requireRole";
import { TestimonialsManager } from "@/components/modules/TestimonialsManager";
import { getStoredTestimonials } from "@/lib/data/testimonialsStorage";
import { toClientJson } from "@/lib/data/clientJson";

export const metadata: Metadata = { title: "Testimonials & Reviews | Infini Admin" };

export default async function AdminTestimonialsPage() {
  await requireRole(["superAdmin", "contentEditor"]);
  const data = toClientJson(await getStoredTestimonials());
  return (
    <div className="w-full">
      <TestimonialsManager initialTestimonials={data} />
    </div>
  );
}
