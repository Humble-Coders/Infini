import { cache } from "react";
import { collection, getDocs, limit, orderBy, query, where } from "firebase/firestore";
import { requireDb } from "./firestore";
import type { CaseStudyDoc, WithId } from "@/lib/types";

const COLLECTION = "caseStudies";

import { buildCaseStudies } from "@/backend/scripts/content";
import { Timestamp } from "firebase/firestore";

/** All published case studies, newest first. */
async function getPublishedCaseStudiesUncached(): Promise<WithId<CaseStudyDoc>[]> {
  const snap = await getDocs(
    query(collection(requireDb(), COLLECTION), where("published", "==", true), orderBy("publishedAt", "desc"))
  );
  let firestoreDocs = snap.docs.map((d) => ({ id: d.id, ...(d.data() as CaseStudyDoc) }));

  // If there are no case studies in Firestore (e.g. localhost hasn't been seeded), load the full detailed mock data
  if (firestoreDocs.length === 0) {
    const tsFactory = { fromDate: (date: Date) => Timestamp.fromDate(date) };
    const mockData = buildCaseStudies(tsFactory);
    firestoreDocs = mockData.map(doc => ({ id: doc.id, ...(doc as CaseStudyDoc) }));
  }

  // --- LINKEDIN INTEGRATION ---
  // To fetch real data, replace this mock with a call to the LinkedIn API:
  // const response = await fetch("https://api.linkedin.com/v2/ugcPosts?q=authors&authors=urn:li:organization:YOUR_ORG_ID", { headers: { Authorization: `Bearer ${process.env.LINKEDIN_TOKEN}` } });
  
  // Example detailed Case Study simulating a LinkedIn fetch
  const linkedInMock: WithId<CaseStudyDoc> = {
    id: "linkedin-mock-1",
    slug: "linkedin-recent-achievement",
    industryId: "cutting-tools",
    title: "Recent Success in Carbide Drills (Via LinkedIn)",
    challenge: "A key aerospace partner needed a massive 300% tool life increase on their carbide drills.",
    solution: "Applied specialized MMP surface finish that removed micro-defects without altering cutting edge geometry.",
    process: "Automated batch processing with targeted wave-length filtering using proprietary media.",
    result: "Tool life increased by 300%, cutting speeds improved, and friction reduced drastically.",
    results: [
      { label: "Tool Life", value: "300% Increase", direction: "up" },
      { label: "Friction", value: "Reduced", direction: "down" },
    ],
    beforeImage: "/images/cutting-tool-1.jpg",
    afterImage: "/images/cutting-tool-3.png",
    gallery: [],
    specs: { material: "Carbide", process: "MMP Treatment", duration: "1 LinkedIn Post" },
    published: true,
    publishedAt: Timestamp.now(),
    seo: { 
      title: "LinkedIn Case Study", 
      description: "Fetched from LinkedIn",
      ogTitle: "LinkedIn Case Study",
      ogDescription: "Fetched from LinkedIn",
      ogImage: "/images/cutting-tool-1.jpg",
      canonical: "/case-studies/linkedin-recent-achievement",
      noindex: false
    }
  };

  return [linkedInMock, ...firestoreDocs];
}

/** A single published case study by slug, or null. */
async function getCaseStudyBySlugUncached(slug: string): Promise<WithId<CaseStudyDoc> | null> {
  // Inject LinkedIn mock
  if (slug === "linkedin-recent-achievement") {
    return {
      id: "linkedin-mock-1",
      slug: "linkedin-recent-achievement",
      industryId: "cutting-tools",
      title: "Recent Success in Carbide Drills (Via LinkedIn)",
      challenge: "A key aerospace partner needed a massive 300% tool life increase on their carbide drills.",
      solution: "Applied specialized MMP surface finish that removed micro-defects without altering cutting edge geometry.",
      process: "Automated batch processing with targeted wave-length filtering using proprietary media.",
      result: "Tool life increased by 300%, cutting speeds improved, and friction reduced drastically.",
      results: [
        { label: "Tool Life", value: "300% Increase", direction: "up" },
        { label: "Friction", value: "Reduced", direction: "down" },
      ],
      beforeImage: "/images/cutting-tool-1.jpg",
      afterImage: "/images/cutting-tool-3.png",
      gallery: [],
      specs: { material: "Carbide", process: "MMP Treatment", duration: "1 LinkedIn Post" },
      published: true,
      publishedAt: Timestamp.now(),
      seo: { 
        title: "LinkedIn Case Study", 
        description: "Fetched from LinkedIn",
        ogTitle: "LinkedIn Case Study",
        ogDescription: "Fetched from LinkedIn",
        ogImage: "/images/cutting-tool-1.jpg",
        canonical: "/case-studies/linkedin-recent-achievement",
        noindex: false
      }
    };
  }

  const snap = await getDocs(
    query(
      collection(requireDb(), COLLECTION),
      where("slug", "==", slug),
      where("published", "==", true),
      limit(1)
    )
  );
  
  if (snap.empty) {
    const tsFactory = { fromDate: (date: Date) => Timestamp.fromDate(date) };
    const mockData = buildCaseStudies(tsFactory);
    const mock = mockData.find(doc => doc.slug === slug);
    if (mock) return { id: mock.id, ...(mock as CaseStudyDoc) };
    return null;
  }
  
  const found = snap.docs[0];
  return { id: found.id, ...(found.data() as CaseStudyDoc) };
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
  let firestoreDocs = snap.docs.map((d) => ({ id: d.id, ...(d.data() as CaseStudyDoc) }));

  if (firestoreDocs.length === 0) {
    const tsFactory = { fromDate: (date: Date) => Timestamp.fromDate(date) };
    const mockData = buildCaseStudies(tsFactory);
    firestoreDocs = mockData.map(doc => ({ id: doc.id, ...(doc as CaseStudyDoc) })).filter(doc => doc.industryId === industryId);
  }

  // Inject LinkedIn mock for cutting tools
  if (industryId === "cutting-tools") {
    const linkedInMock: WithId<CaseStudyDoc> = {
      id: "linkedin-mock-1",
      slug: "linkedin-recent-achievement",
      industryId: "cutting-tools",
      title: "Recent Success in Carbide Drills (Via LinkedIn)",
      challenge: "A key aerospace partner needed a massive 300% tool life increase on their carbide drills.",
      solution: "Applied specialized MMP surface finish that removed micro-defects without altering cutting edge geometry.",
      process: "Automated batch processing with targeted wave-length filtering using proprietary media.",
      result: "Tool life increased by 300%, cutting speeds improved, and friction reduced drastically.",
      results: [
        { label: "Tool Life", value: "300% Increase", direction: "up" },
        { label: "Friction", value: "Reduced", direction: "down" },
      ],
      beforeImage: "/images/cutting-tool-1.jpg",
      afterImage: "/images/cutting-tool-3.png",
      gallery: [],
      specs: { material: "Carbide", process: "MMP Treatment", duration: "1 LinkedIn Post" },
      published: true,
      publishedAt: Timestamp.now(),
      seo: { 
        title: "LinkedIn Case Study", 
        description: "Fetched from LinkedIn",
        ogTitle: "LinkedIn Case Study",
        ogDescription: "Fetched from LinkedIn",
        ogImage: "/images/cutting-tool-1.jpg",
        canonical: "/case-studies/linkedin-recent-achievement",
        noindex: false
      }
    };
    return [linkedInMock, ...firestoreDocs];
  }

  return firestoreDocs;
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
