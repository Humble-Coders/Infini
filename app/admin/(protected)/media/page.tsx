import type { Metadata } from "next";
import { requireRole } from "@/lib/auth/requireRole";
import { MediaLibraryManager } from "@/components/admin/media/MediaLibraryManager";

export const metadata: Metadata = { title: "Media" };

// Content Editor / Super Admin only — matches the Media column of the PRD
// role matrix. A Leads Manager hitting this URL directly is denied here
// AND at the Storage rules layer (backend/storage.rules' canWrite()).
export default async function AdminMediaPage() {
  await requireRole(["superAdmin", "contentEditor"]);
  return (
    <div className="space-y-6">
      <h1 className="text-lg font-semibold text-foreground">Media</h1>
      <MediaLibraryManager />
    </div>
  );
}
