import { cache } from "react";
import type { CaseStudyDoc, WithId } from "@/lib/types";

/** All published case studies, newest first. */
async function getPublishedCaseStudiesUncached(): Promise<WithId<CaseStudyDoc>[]> {
  return [];
}

/** A single published case study by slug, or null. */
async function getCaseStudyBySlugUncached(_slug: string): Promise<WithId<CaseStudyDoc> | null> {
  return null;
}

/** Published case studies cross-linked to a given industry, for that industry's page. */
async function getCaseStudiesByIndustryUncached(_industryId: string): Promise<WithId<CaseStudyDoc>[]> {
  return [];
}

/** All published case study slugs, for generateStaticParams. */
async function getPublishedCaseStudySlugsUncached(): Promise<string[]> {
  return [];
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
export const getPublishedCaseStudies = cache(getPublishedCaseStudiesUncached);
export const getCaseStudyBySlug = cache(getCaseStudyBySlugUncached);
export const getCaseStudiesByIndustry = cache(getCaseStudiesByIndustryUncached);
export const getPublishedCaseStudySlugs = cache(getPublishedCaseStudySlugsUncached);
