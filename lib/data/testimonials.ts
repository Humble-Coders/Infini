import { cache } from "react";
import { collection, getDocs } from "firebase/firestore";
import { requireDb } from "./firestore";
import { DEMO_TESTIMONIALS } from "@/lib/demo/testimonials";
import type { TestimonialDoc, WithId } from "@/lib/types";

const COLLECTION = "testimonials";

/** All published testimonials, in display order. */
async function getPublishedTestimonialsUncached(): Promise<WithId<TestimonialDoc>[]> {
  try {
    const snap = await getDocs(collection(requireDb(), COLLECTION));
    if (snap.empty) {
      return DEMO_TESTIMONIALS.filter((t) => t.published);
    }
    const docs = snap.docs
      .map((d) => ({ id: d.id, ...(d.data() as TestimonialDoc) }))
      .filter((d) => Boolean(d.published));
    return docs.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  } catch {
    return DEMO_TESTIMONIALS.filter((t) => t.published);
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
