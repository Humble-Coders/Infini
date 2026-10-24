import { cache } from "react";
import type { NewsDoc, WithId } from "@/lib/types";
import {
  getStoredPublishedNews,
  getStoredNewsBySlug,
  getStoredPublishedNewsSlugs,
} from "./newsStorage";

/** All published news posts, newest first. */
async function getPublishedNewsUncached(): Promise<WithId<NewsDoc>[]> {
  try {
    return await getStoredPublishedNews();
  } catch (err) {
    console.error("[getPublishedNewsUncached] error:", err);
    return [];
  }
}

/** A single published news post by slug, or null. */
async function getNewsBySlugUncached(slug: string): Promise<WithId<NewsDoc> | null> {
  try {
    return await getStoredNewsBySlug(slug);
  } catch (err) {
    console.error("[getNewsBySlugUncached] error:", err);
    return null;
  }
}

/** All published news slugs, for generateStaticParams. */
async function getPublishedNewsSlugsUncached(): Promise<string[]> {
  try {
    return await getStoredPublishedNewsSlugs();
  } catch (err) {
    console.error("[getPublishedNewsSlugsUncached] error:", err);
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
export const getPublishedNews = cache(getPublishedNewsUncached);
export const getNewsBySlug = cache(getNewsBySlugUncached);
export const getPublishedNewsSlugs = cache(getPublishedNewsSlugsUncached);
