import { cache } from "react";
import { doc, getDoc } from "firebase/firestore";
import { requireDb } from "./firestore";
import type { FirestoreTimestamp } from "@/lib/types";

export type LegalPageId = "privacy" | "terms";

/**
 * `pages/privacy` and `pages/terms`: a title plus a Markdown body, edited in
 * the admin dashboard (Legal pages). Stored in `pages` because that
 * collection is already publicly readable under the security rules.
 */
export interface LegalPageDoc {
  kind: "legal";
  title: string;
  body: string;
  description?: string;
  updatedAt?: FirestoreTimestamp | null;
}

async function getLegalPageUncached(id: LegalPageId): Promise<LegalPageDoc | null> {
  try {
    const snap = await getDoc(doc(requireDb(), "pages", id));
    const data = snap.data() as LegalPageDoc | undefined;
    return data?.kind === "legal" && data.body ? data : null;
  } catch (error) {
    console.warn(`[legal] Could not load "${id}":`, (error as Error)?.message);
    return null;
  }
}

/*
 * Reads are memoised per request with React's `cache()`, so a page and its
 * `generateMetadata` share one Firestore round trip.
 */
export const getLegalPage = cache(getLegalPageUncached);
