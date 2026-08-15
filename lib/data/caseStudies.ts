import { collection, getDocs, limit, orderBy, query, where } from "firebase/firestore";
import { requireDb } from "./firestore";
import type { CaseStudyDoc, WithId } from "@/lib/types";

const COLLECTION = "caseStudies";

/** All published case studies, newest first. */
export async function getPublishedCaseStudies(): Promise<WithId<CaseStudyDoc>[]> {
  const snap = await getDocs(
    query(collection(requireDb(), COLLECTION), where("published", "==", true), orderBy("publishedAt", "desc"))
  );
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as CaseStudyDoc) }));
}

/** A single published case study by slug, or null. */
export async function getCaseStudyBySlug(slug: string): Promise<WithId<CaseStudyDoc> | null> {
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
export async function getCaseStudiesByIndustry(industryId: string): Promise<WithId<CaseStudyDoc>[]> {
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

/** All published case study slugs — for generateStaticParams. */
export async function getPublishedCaseStudySlugs(): Promise<string[]> {
  const caseStudies = await getPublishedCaseStudies();
  return caseStudies.map((caseStudy) => caseStudy.slug);
}
