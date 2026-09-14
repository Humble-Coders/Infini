import { cache } from "react";
import { doc, getDoc } from "firebase/firestore";
import { requireDb } from "./firestore";
import type { SettingsDoc } from "@/lib/types";

const COLLECTION = "settings";
const GLOBAL_DOC_ID = "global";

/** Global site settings, contact info, social links, nav, default SEO, cookie banner copy. */
async function getSettingsUncached(): Promise<SettingsDoc | null> {
  const snap = await getDoc(doc(requireDb(), COLLECTION, GLOBAL_DOC_ID));
  if (!snap.exists()) return null;
  return snap.data() as SettingsDoc;
}

/*
 * Reads are memoised per request with React's `cache()`.
 *
 * A page and its `generateMetadata` run in the same pass and routinely ask for
 * the same document, so an uncached accessor cost two identical round trips on
 * every request. `cache()` collapses those to one.
 *
 * It has to be `cache()` and not `unstable_cache`: the latter serialises what it
 * stores, which strips `.toDate()` off every Firestore Timestamp and breaks
 * every date on the site. This only dedupes within a single render, so
 * documents arrive exactly as Firestore returned them.
 */
export const getSettings = cache(getSettingsUncached);
