import { cache } from "react";
import { cache } from "react";
import { collection, getDocs, limit, query, where } from "firebase/firestore";
import { requireDb } from "./firestore";
import type { NewsDoc, WithId } from "@/lib/types";
import {
  getStoredPublishedNews,
  getStoredNewsBySlug,
  getStoredPublishedNewsSlugs,
} from "./newsStorage";

const COLLECTION = "news";

/** All published news posts, newest first. */
async function getPublishedNewsUncached(): Promise<WithId<NewsDoc>[]> {
  try {
async function getPublishedNewsUncached(): Promise<WithId<NewsDoc>[]> {
  try {
    const stored = await getStoredPublishedNews();
    if (stored.length > 0) return stored;
  } catch (err) {
    console.error("[getPublishedNewsUncached] error:", err);
  }

  try {
    const snap = await getDocs(
      query(collection(requireDb(), COLLECTION), where("status", "==", "published"))
    );
    const posts = snap.docs.map((d) => ({ id: d.id, ...(d.data() as NewsDoc) }));
    return posts.sort(
      (a, b) =>
        (b.publishedAt?.toDate ? b.publishedAt.toDate().getTime() : 0) -
        (a.publishedAt?.toDate ? a.publishedAt.toDate().getTime() : 0)
    );
  } catch (error) {
    console.warn("[news] Firestore issue:", (error as Error)?.message || error);
  }

  return [];
}
    return [];
  }
}

/** A single published news post by slug, or null. */
async function getNewsBySlugUncached(slug: string): Promise<WithId<NewsDoc> | null> {
  try {
async function getNewsBySlugUncached(slug: string): Promise<WithId<NewsDoc> | null> {
  try {
    const stored = await getStoredNewsBySlug(slug);
    if (stored) return stored;
  } catch (err) {
    console.error("[getNewsBySlugUncached] error:", err);
  }

  try {
    const snap = await getDocs(
      query(
        collection(requireDb(), COLLECTION),
        where("slug", "==", slug),
        where("status", "==", "published"),
        limit(1)
      )
    );
    const found = snap.docs[0];
    if (found) return { id: found.id, ...(found.data() as NewsDoc) };
  } catch (error) {
    console.warn("[news] Firestore issue:", (error as Error)?.message || error);
  }
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
