import type { SeoMap } from "./seo";

export interface IndustryHero {
  headline: string;
  subheadline: string;
  image: string;
}

/** `industries` collection — the 7 industry pages. */
export interface IndustryDoc {
  slug: string;
  name: string;
  order: number;
  hero: IndustryHero;
  overview: string;
  capabilities: string[];
  applications: string[];
  materials: string[];
  relatedCertIds: string[];
  relatedCaseStudyIds: string[];
  seo: SeoMap;
  published: boolean;
}
