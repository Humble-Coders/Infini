import { cache } from "react";
import { collection, getDocs, limit, query, where } from "firebase/firestore";
import { requireDb } from "./firestore";
import type { CaseStudyDoc, WithId } from "@/lib/types";

const COLLECTION = "caseStudies";

function newestFirst(a: CaseStudyDoc, b: CaseStudyDoc) {
  const time = (doc: CaseStudyDoc) => (doc.publishedAt?.toDate ? doc.publishedAt.toDate().getTime() : 0);
  return time(b) - time(a);
}

/*
 * Every query filters `published == true`, matching the security rules. The
 * ordering is done here rather than with orderBy so these queries need no
 * composite index, and a document missing `publishedAt` still lists (last)
 * instead of silently vanishing from an orderBy query.
 *
 * There is deliberately no in-code fallback content: an empty collection means
 * an empty state on the page, never invented case studies.
 */

/** All published case studies, newest first. */
async function getPublishedCaseStudiesUncached(): Promise<WithId<CaseStudyDoc>[]> {
  try {
    const snap = await getDocs(query(collection(requireDb(), COLLECTION), where("published", "==", true)));
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as CaseStudyDoc) })).sort(newestFirst);
  } catch (error) {
    console.warn("[caseStudies] Firestore issue:", (error as Error)?.message || error);
    return [];
  }
}

/** A single published case study by slug, or null. */
async function getCaseStudyBySlugUncached(slug: string): Promise<WithId<CaseStudyDoc> | null> {
  try {
    const snap = await getDocs(
      query(collection(requireDb(), COLLECTION), where("slug", "==", slug), where("published", "==", true), limit(1))
    );
    const found = snap.docs[0];
    return found ? { id: found.id, ...(found.data() as CaseStudyDoc) } : null;
  } catch (error) {
    console.warn("[caseStudies] Firestore issue:", (error as Error)?.message || error);
    return null;
  }
}

/** Published case studies cross-linked to a given industry, for that industry's page. */
async function getCaseStudiesByIndustryUncached(industryId: string): Promise<WithId<CaseStudyDoc>[]> {
  const all = await getPublishedCaseStudies();
  return all.filter((caseStudy) => caseStudy.industryId === industryId);
}

/** All published case study slugs, for generateStaticParams. */
async function getPublishedCaseStudySlugsUncached(): Promise<string[]> {
  const caseStudies = await getPublishedCaseStudies();
  return caseStudies.map((caseStudy) => caseStudy.slug);
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
