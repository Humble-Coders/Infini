import { cache } from "react";
import { collection, getDocs, limit, orderBy, query, where } from "firebase/firestore";
import { requireDb } from "./firestore";
import type { ComponentTypeDoc, WithId } from "@/lib/types";

const COLLECTION = "componentTypes";

/**
 * Firestore denies reads for a collection with no deployed rule, which would
 * otherwise turn a missing deploy into a 500 on a public page. The rules for
 * this collection live in backend/firestore.rules; until they are deployed the
 * axis simply renders its empty state.
 */
async function safe<T>(label: string, run: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await run();
  } catch (error) {
    const code = (error as { code?: string }).code;
    if (code === "permission-denied") {
      console.warn(`[${label}] permission denied. Deploy backend/firestore.rules.`);
      return fallback;
    }
    throw error;
  }
}

/** All published component types, in display order. */
async function getPublishedComponentTypesUncached(): Promise<WithId<ComponentTypeDoc>[]> {
  return safe(COLLECTION, async () => {
    const snap = await getDocs(
      query(collection(requireDb(), COLLECTION), where("published", "==", true), orderBy("order"))
    );
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as ComponentTypeDoc) }));
  }, []);
}

/** A single published component type by slug, or null if it doesn't exist or isn't published. */
async function getComponentTypeBySlugUncached(slug: string): Promise<WithId<ComponentTypeDoc> | null> {
  return safe(COLLECTION, async () => {
    const snap = await getDocs(
      query(
        collection(requireDb(), COLLECTION),
        where("slug", "==", slug),
        where("published", "==", true),
        limit(1)
      )
    );
    const found = snap.docs[0];
    return found ? { id: found.id, ...(found.data() as ComponentTypeDoc) } : null;
  }, null);
}

/** All published component-type slugs, for generateStaticParams. */
async function getPublishedComponentTypeSlugsUncached(): Promise<string[]> {
  const types = await getPublishedComponentTypes();
  return types.map((type) => type.slug);
}

/** Published component types matching a list of slugs, in the collection's own order. */
async function getComponentTypesBySlugsUncached(slugs: string[]): Promise<WithId<ComponentTypeDoc>[]> {
  if (slugs.length === 0) return [];
  const all = await getPublishedComponentTypes();
  return all.filter((type) => slugs.includes(type.slug));
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
export const getPublishedComponentTypes = cache(getPublishedComponentTypesUncached);
export const getComponentTypeBySlug = cache(getComponentTypeBySlugUncached);
export const getPublishedComponentTypeSlugs = cache(getPublishedComponentTypeSlugsUncached);
export const getComponentTypesBySlugs = cache(getComponentTypesBySlugsUncached);
