import { cache } from "react";
import { collection, getDocs, limit, orderBy, query, where } from "firebase/firestore";
import { requireDb } from "./firestore";
import type { CaseStudyDoc, WithId } from "@/lib/types";

const COLLECTION = "caseStudies";

/** All published case studies, newest first. */
async function getPublishedCaseStudiesUncached(): Promise<WithId<CaseStudyDoc>[]> {
  const snap = await getDocs(
    query(collection(requireDb(), COLLECTION), where("published", "==", true), orderBy("publishedAt", "desc"))
  );
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as CaseStudyDoc) }));
}

/** A single published case study by slug, or null. */
async function getCaseStudyBySlugUncached(slug: string): Promise<WithId<CaseStudyDoc> | null> {
  const snap = await getDocs(
    query(
      collection(requireDb(), COLLECTION),
      where("slug", "==", slug),
      where("published", "==", true),
      limit(1)
    )
  );
  const found = snap.docs[0];
  return found ? { id: found.id, ...(found.data() as CaseStudyDoc) } : null;
}

/** Published case studies cross-linked to a given industry, for that industry's page. */
async function getCaseStudiesByIndustryUncached(industryId: string): Promise<WithId<CaseStudyDoc>[]> {
  const snap = await getDocs(
    query(
      collection(requireDb(), COLLECTION),
      where("industryId", "==", industryId),
      where("published", "==", true),
      orderBy("publishedAt", "desc")
    )
  );
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as CaseStudyDoc) }));
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
