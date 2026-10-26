import type { Metadata } from "next";
import { requireRole } from "@/lib/auth/requireRole";
import { MediaLibraryManager } from "@/components/modules/MediaLibraryManager";
import { getStoredMedia } from "@/lib/data/mediaStorage";
import { toClientJson } from "@/lib/data/clientJson";

export const metadata: Metadata = { title: "Media Library | Infini Admin" };

export default async function AdminMediaPage() {
  await requireRole(["superAdmin", "contentEditor"]);
  const data = toClientJson(await getStoredMedia());
  return (
    <div className="w-full">
      <MediaLibraryManager initialAssets={data} />
    </div>
  );
}
