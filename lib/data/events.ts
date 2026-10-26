import { cache } from "react";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { requireDb } from "./firestore";
import type { EventDoc, WithId } from "@/lib/types";

const COLLECTION = "events";

export interface EventBannerData {
  enabled: boolean;
  badge?: string;
  title?: string;
  location?: string;
  booth?: string;
  subtitle?: string;
  ctaText?: string;
  ctaUrl?: string;
  startDate?: string;
  endDate?: string;
  theme?: "red" | "dark" | "gold";
}

/** All published events, soonest first. */
async function getPublishedEventsUncached(): Promise<WithId<EventDoc>[]> {
  try {
    const snap = await getDocs(
      query(collection(requireDb(), COLLECTION), where("published", "==", true), orderBy("startDate"))
    );
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as EventDoc) }));
  } catch {
    return [];
  }
}

const DAY_MS = 24 * 60 * 60 * 1000;

/** A banner shows only when enabled, titled, and not yet past its end date (kept up through the end day itself). */
function isBannerLive(banner: EventBannerData | null): banner is EventBannerData {
  if (!banner?.enabled || !banner.title?.trim()) return false;
  const end = banner.endDate ? Date.parse(banner.endDate) : NaN;
  return Number.isNaN(end) || end + DAY_MS > Date.now();
}

/**
 * The site-wide announcement banner, or null when it is off or its event
 * has ended, so a past exhibition never keeps advertising itself.
 */
async function getEventBannerUncached(): Promise<EventBannerData | null> {
  try {
    const { getStoredEventBanner } = await import("./eventBannerStorage");
    const banner = (await getStoredEventBanner()) as EventBannerData;
    return isBannerLive(banner) ? banner : null;
  } catch {
    return null;
  }
}

export const getPublishedEvents = cache(getPublishedEventsUncached);
export const getEventBanner = cache(getEventBannerUncached);
