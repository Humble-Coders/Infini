import { cache } from "react";
import { getStoredSettingsDoc } from "./companySettingsStorage";
import type { SettingsDoc } from "@/lib/types";

/**
 * Global site settings, contact info, social links, nav, default SEO, cookie banner copy.
 * Uses resilient dual-layer storage (Google Cloud Firestore in production, persisted local file in development).
 */
async function getSettingsUncached(): Promise<SettingsDoc> {
  return await getStoredSettingsDoc();
}

/*
 * Reads are memoised per request with React's `cache()`.
 *
 * A page and its `generateMetadata` run in the same pass and routinely ask for
 * the same document, so an uncached accessor cost two identical round trips on
 * every request. `cache()` collapses those to one.
 */
export const getSettings = cache(getSettingsUncached);
