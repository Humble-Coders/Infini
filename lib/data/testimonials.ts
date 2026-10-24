import { cache } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { requireDb } from "./firestore";
import type { TestimonialDoc, WithId } from "@/lib/types";

const COLLECTION = "testimonials";

/**
 * All published testimonials, in display order. The `published == true`
 * filter is required, not just tidy: Firestore rules only allow public reads
 * of published documents, and a query that could return a draft is rejected
 * outright, which is how this section used to fail silently.
 */
async function getPublishedTestimonialsUncached(): Promise<WithId<TestimonialDoc>[]> {
  try {
    const snap = await getDocs(query(collection(requireDb(), COLLECTION), where("published", "==", true)));
    const docs = snap.docs.map((d) => ({ id: d.id, ...(d.data() as TestimonialDoc) }));
    return docs.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  } catch (error) {
    console.warn("[testimonials] Firestore issue:", (error as Error)?.message || error);
    return [];
  }
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
export const getPublishedTestimonials = cache(getPublishedTestimonialsUncached);
