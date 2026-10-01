import { cache } from "react";
import { doc, getDoc } from "firebase/firestore";
import { requireDb } from "./firestore";
import type { SettingsDoc } from "@/lib/types";

const COLLECTION = "settings";
const GLOBAL_DOC_ID = "global";

/** Global site settings, contact info, social links, nav, default SEO, cookie banner copy. */
async function getSettingsUncached(): Promise<SettingsDoc | null> {
  const snap = await getDoc(doc(requireDb(), COLLECTION, GLOBAL_DOC_ID));
  
  let data: SettingsDoc;
  if (!snap.exists()) {
    data = {} as SettingsDoc;
  } else {
    data = snap.data() as SettingsDoc;
  }

  // FALLBACK: Ensure contact details exist so UI doesn't break
  if (!data.contact || !data.contact.phone || !data.contact.email) {
    data.contact = {
      email: "superfinish@infini.co.in",
      phone: "+91 1792 233216",
      address: "Parwanoo, Himachal Pradesh, India",
    };
  } else {
    // HARDCODED OVERRIDE: Ensure the contact email matches the latest brochure
    data.contact.email = "superfinish@infini.co.in";
  }

  if (!data.social) {
    data.social = {
      linkedin: "https://www.linkedin.com/in/infini-precision-private-limited-73b19921b/",
      x: "https://x.com/preision",
      instagram: "https://www.instagram.com/infiniprecisionpvt.ltd/?hl=en",
      facebook: "https://www.facebook.com/profile.php?id=100064548354724",
      youtube: "https://youtu.be/YKcmtDuxXks?si=btPyU3ZyS3xiqF5D"
    };
  }

  return data;
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
