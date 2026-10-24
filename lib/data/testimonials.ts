import { cache } from "react";
import type { TestimonialDoc, WithId } from "@/lib/types";
import { getStoredPublishedTestimonials } from "./testimonialsStorage";

/** All published testimonials, in display order. */
async function getPublishedTestimonialsUncached(): Promise<WithId<TestimonialDoc>[]> {
  try {
    return await getStoredPublishedTestimonials();
  } catch (err) {
    console.error("[getPublishedTestimonialsUncached] error:", err);
    return [];
  }
}

/*
 * Reads are memoised per request with React's `cache()`.
 *
 * A page and its `generateMetadata` run in the same pass and routinely ask for
 * the same document, so an uncached accessor cost two identical round trips on
 * every request. `cache()` collapses those to one.
 */
export const getPublishedTestimonials = cache(getPublishedTestimonialsUncached);

