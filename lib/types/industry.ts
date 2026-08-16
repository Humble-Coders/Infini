import type { SeoMap } from "./seo";

export interface IndustryHero {
  eyebrow: string;
  headline: string;
  subheadline: string;
  image: string;
}

export interface IndustryCapability {
  title: string;
  description: string;
}

/** `industries` collection — the 7 industry pages. */
export interface IndustryDoc {
  slug: string;
  name: string;
  order: number;
  hero: IndustryHero;
  overview: string;
  /** Why surface finish matters for this industry specifically — the detail page's "Why it matters" section. */
  relevance: string;
  capabilities: IndustryCapability[];
  applications: string[];
  materials: string[];
  relatedCertIds: string[];
  relatedCaseStudyIds: string[];
  seo: SeoMap;
  published: boolean;
}
