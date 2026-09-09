import { cache } from "react";
import { collection, getDocs, limit, orderBy, query, where } from "firebase/firestore";
import { requireDb } from "./firestore";
import type { BenefitDoc, WithId } from "@/lib/types";

const COLLECTION = "benefits";

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

/** All published benefits, in display order. */
async function getPublishedBenefitsUncached(): Promise<WithId<BenefitDoc>[]> {
  return safe(COLLECTION, async () => {
    const snap = await getDocs(
      query(collection(requireDb(), COLLECTION), where("published", "==", true), orderBy("order"))
    );
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as BenefitDoc) }));
  }, []);
}

/** A single published benefit by slug, or null if it doesn't exist or isn't published. */
async function getBenefitBySlugUncached(slug: string): Promise<WithId<BenefitDoc> | null> {
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
    return found ? { id: found.id, ...(found.data() as BenefitDoc) } : null;
  }, null);
}

/** All published benefit slugs, for generateStaticParams. */
async function getPublishedBenefitSlugsUncached(): Promise<string[]> {
  const benefits = await getPublishedBenefits();
  return benefits.map((benefit) => benefit.slug);
}

/**
 * Published benefits matching a list of slugs, in the collection's own order.
 *
 * Filtered in memory rather than with an `in` query: the list is short, `in` is
 * capped at 30 values, and this keeps one round trip for the whole axis.
 */
async function getBenefitsBySlugsUncached(slugs: string[]): Promise<WithId<BenefitDoc>[]> {
  if (slugs.length === 0) return [];
  const all = await getPublishedBenefits();
  return all.filter((benefit) => slugs.includes(benefit.slug));
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
export const getPublishedBenefits = cache(getPublishedBenefitsUncached);
export const getBenefitBySlug = cache(getBenefitBySlugUncached);
export const getPublishedBenefitSlugs = cache(getPublishedBenefitSlugsUncached);
export const getBenefitsBySlugs = cache(getBenefitsBySlugsUncached);
