import { cache } from "react";
import { cache } from "react";
import { collection, getDocs, limit, query, where } from "firebase/firestore";
import { requireDb } from "./firestore";
import type { CaseStudyDoc, WithId } from "@/lib/types";
import {
  getStoredPublishedCaseStudies,
  getStoredCaseStudyBySlug,
  getStoredCaseStudiesByIndustry,
  getStoredPublishedCaseStudySlugs,
} from "./caseStudiesStorage";

const COLLECTION = "caseStudies";

function newestFirst(a: CaseStudyDoc, b: CaseStudyDoc) {
  const time = (doc: CaseStudyDoc) => (doc.publishedAt?.toDate ? doc.publishedAt.toDate().getTime() : 0);
  return time(b) - time(a);
}


/** All published case studies, newest first. */
async function getPublishedCaseStudiesUncached(): Promise<WithId<CaseStudyDoc>[]> {
  try {
    return await getStoredPublishedCaseStudies();
  } catch (err) {
    console.error("[getPublishedCaseStudiesUncached] error:", err);
    try {
      const snap = await getDocs(query(collection(requireDb(), COLLECTION), where("published", "==", true)));
      return snap.docs.map((d) => ({ id: d.id, ...(d.data() as CaseStudyDoc) })).sort(newestFirst);
    } catch (error) {
      console.warn("[caseStudies] Firestore issue:", (error as Error)?.message || error);
    }
  }
  return [];
    return [];
  }
}

/** A single published case study by slug, or null. */
async function getCaseStudyBySlugUncached(slug: string): Promise<WithId<CaseStudyDoc> | null> {
  try {
    return await getStoredCaseStudyBySlug(slug);
  } catch (err) {
    console.error("[getCaseStudyBySlugUncached] error:", err);
    try {
      const snap = await getDocs(
        query(collection(requireDb(), COLLECTION), where("slug", "==", slug), where("published", "==", true), limit(1))
      );
      const found = snap.docs[0];
      return found ? { id: found.id, ...(found.data() as CaseStudyDoc) } : null;
    } catch (error) {
      console.warn("[caseStudies] Firestore issue:", (error as Error)?.message || error);
    }
  }
  return null;
    return null;
  }
}

/** Published case studies cross-linked to a given industry, for that industry's page. */
async function getCaseStudiesByIndustryUncached(industryId: string): Promise<WithId<CaseStudyDoc>[]> {
  try {
    return await getStoredCaseStudiesByIndustry(industryId);
  } catch (err) {
    console.error("[getCaseStudiesByIndustryUncached] error:", err);
    const all = await getPublishedCaseStudies();
    return all.filter((caseStudy) => caseStudy.industryId === industryId);
  }
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
