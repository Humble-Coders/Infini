import type { Metadata } from "next";
import { requireRole } from "@/lib/auth/requireRole";
import { NewsBlogManager } from "@/components/modules/NewsBlogManager";

export const metadata: Metadata = { title: "Technical News & Insights | Infini Admin" };

export default async function AdminNewsPage() {
  await requireRole(["superAdmin", "contentEditor"]);
  return (
    <div className="w-full">
      <NewsBlogManager />
    </div>
  );
}
