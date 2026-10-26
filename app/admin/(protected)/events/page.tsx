import type { Metadata } from "next";
import { requireRole } from "@/lib/auth/requireRole";
import { EventBannerManager } from "@/components/modules/EventBannerManager";
import { getStoredEventBanner } from "@/lib/data/eventBannerStorage";
import { toClientJson } from "@/lib/data/clientJson";

export const metadata: Metadata = { title: "Event & Announcement Banner | Infini Admin" };

export default async function AdminEventsPage() {
  await requireRole(["superAdmin", "contentEditor"]);
  const data = toClientJson(await getStoredEventBanner());
  return (
    <div className="w-full">
      <EventBannerManager initialConfig={data} />
    </div>
  );
}
