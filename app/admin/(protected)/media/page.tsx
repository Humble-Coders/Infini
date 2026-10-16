import type { Metadata } from "next";
import { requireRole } from "@/lib/auth/requireRole";
import { MediaLibraryManager } from "@/components/modules/MediaLibraryManager";

export const metadata: Metadata = { title: "Media Library | Infini Admin" };

export default async function AdminMediaPage() {
  await requireRole(["superAdmin", "contentEditor"]);
  return (
    <div className="w-full">
      <MediaLibraryManager />
    </div>
  );
}
