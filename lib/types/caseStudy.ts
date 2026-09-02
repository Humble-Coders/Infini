import type { FirestoreTimestamp } from "./common";
import type { SeoMap } from "./seo";

export interface CaseStudySpecs {
  material: string;
  process: string;
  duration: string;
  [key: string]: string;
}

/** One qualitative outcome chip shown in the case-study dossier's results row. */
export interface CaseStudyResult {
  label: string;
  value: string;
  direction: "down" | "up" | "check";
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
  /** Optional 2-3 qualitative outcome chips for the dossier UI. Falls back to `result` when absent. */
  results?: CaseStudyResult[];
  beforeImage: string;
  afterImage: string;
  gallery: string[];
  specs: CaseStudySpecs;
  seo: SeoMap;
  published: boolean;
  publishedAt: FirestoreTimestamp;
}
