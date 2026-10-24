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

/** Configured event/announcement banner from persistent storage with Firestore fallback */
async function getEventBannerUncached(): Promise<EventBannerData | null> {
  try {
    const { getStoredEventBanner } = await import("./eventBannerStorage");
    return (await getStoredEventBanner()) as EventBannerData;
  } catch {
    return null;
  }
}

export const getPublishedEvents = cache(getPublishedEventsUncached);
export const getEventBanner = cache(getEventBannerUncached);
