import type { Metadata } from "next";
import { requireRole } from "@/lib/auth/requireRole";
import { EventBannerManager } from "@/components/modules/EventBannerManager";

export const metadata: Metadata = { title: "Event & Announcement Banner | Infini Admin" };

export default async function AdminEventsPage() {
  await requireRole(["superAdmin", "contentEditor"]);
  return (
    <div className="w-full">
      <EventBannerManager />
    </div>
  );
}
