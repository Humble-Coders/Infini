import type { FirestoreTimestamp } from "./common";
import type { SeoMap } from "./seo";

export interface CaseStudySpecs {
  material: string;
  process: string;
  duration: string;
  [key: string]: string;
}

/** `caseStudies` collection — proven work, cross-linked to an industry. */
export interface CaseStudyDoc {
  slug: string;
  title: string;
  industryId: string;
  challenge: string;
  solution: string;
  process: string;
  result: string;
  beforeImage: string;
  afterImage: string;
  gallery: string[];
  specs: CaseStudySpecs;
  seo: SeoMap;
  published: boolean;
  publishedAt: FirestoreTimestamp;
}
