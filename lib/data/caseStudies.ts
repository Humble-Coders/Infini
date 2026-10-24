import { cache } from "react";
import type { CaseStudyDoc, WithId } from "@/lib/types";
import {
  getStoredPublishedCaseStudies,
  getStoredCaseStudyBySlug,
  getStoredCaseStudiesByIndustry,
  getStoredPublishedCaseStudySlugs,
} from "./caseStudiesStorage";

/** All published case studies, newest first. */
async function getPublishedCaseStudiesUncached(): Promise<WithId<CaseStudyDoc>[]> {
  try {
    return await getStoredPublishedCaseStudies();
  } catch (err) {
    console.error("[getPublishedCaseStudiesUncached] error:", err);
    return [];
  }
}

/** A single published case study by slug, or null. */
async function getCaseStudyBySlugUncached(slug: string): Promise<WithId<CaseStudyDoc> | null> {
  try {
    return await getStoredCaseStudyBySlug(slug);
  } catch (err) {
    console.error("[getCaseStudyBySlugUncached] error:", err);
    return null;
  }
}

/** Published case studies cross-linked to a given industry, for that industry's page. */
async function getCaseStudiesByIndustryUncached(industryId: string): Promise<WithId<CaseStudyDoc>[]> {
  try {
    return await getStoredCaseStudiesByIndustry(industryId);
  } catch (err) {
    console.error("[getCaseStudiesByIndustryUncached] error:", err);
    return [];
  }
}

/** All published case study slugs, for generateStaticParams. */
async function getPublishedCaseStudySlugsUncached(): Promise<string[]> {
  try {
    return await getStoredPublishedCaseStudySlugs();
  } catch (err) {
    console.error("[getPublishedCaseStudySlugsUncached] error:", err);
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
export const getPublishedCaseStudies = cache(getPublishedCaseStudiesUncached);
export const getCaseStudyBySlug = cache(getCaseStudyBySlugUncached);
export const getCaseStudiesByIndustry = cache(getCaseStudiesByIndustryUncached);
export const getPublishedCaseStudySlugs = cache(getPublishedCaseStudySlugsUncached);
