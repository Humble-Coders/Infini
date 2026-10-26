import type { Metadata } from "next";
import { requireRole } from "@/lib/auth/requireRole";
import { NewsBlogManager } from "@/components/modules/NewsBlogManager";
import { getStoredArticles } from "@/lib/data/newsStorage";
import { toClientJson } from "@/lib/data/clientJson";

export const metadata: Metadata = { title: "Technical News & Insights | Infini Admin" };

export default async function AdminNewsPage() {
  await requireRole(["superAdmin", "contentEditor"]);
  const data = toClientJson(await getStoredArticles());
  return (
    <div className="w-full">
      <NewsBlogManager initialArticles={data} />
    </div>
  );
}
