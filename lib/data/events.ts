import { cache } from "react";
import { collection, doc, getDoc, getDocs, orderBy, query, where } from "firebase/firestore";
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

/** Configured event/announcement banner from settings/eventBanner */
async function getEventBannerUncached(): Promise<EventBannerData | null> {
  try {
    const snap = await getDoc(doc(requireDb(), "settings", "eventBanner"));
    if (snap.exists()) {
      return snap.data() as EventBannerData;
    }
  } catch {
    // Return null to allow ExhibitionBanner to fallback gracefully
  }
  return null;
}

export const getPublishedEvents = cache(getPublishedEventsUncached);
export const getEventBanner = cache(getEventBannerUncached);
