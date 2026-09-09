import type { SeoMap } from "./seo";

/** One quantified figure on a benefit page. Kept as strings so the CMS can hold "2x" or "> 5%". */
export interface BenefitEvidence {
  label: string;
  value: string;
  note?: string;
}

/**
 * `benefits` collection, the outcome axis.
 *
 * One document per engineering failure mode MMP defeats: micropitting,
 * scuffing, bending fatigue, friction loss and so on. This is the axis the
 * buyer's own language lives in. An engineer with a micropitting problem on a
 * helical gear does not search for "MMP", they search for the failure and the
 * part, so these pages and the component pages are where that traffic lands.
 *
 * Every page sits at an intersection: a benefit links out to the industries
 * where it bites and the component types it applies to, and those link back.
 */
export interface BenefitDoc {
  slug: string;
  /** Short label used in lists and cross-links, e.g. "Micropitting". */
  name: string;
  order: number;
  /** The page's own h1. Unique per route, never shared across the axis. */
  headline: string;
  /** One sentence, used on the index cards and as the meta description fallback. */
  summary: string;
  /** The failure mechanism in the engineer's terms, before MMP is mentioned. */
  mechanism: string;
  /** What the treatment changes about the surface, and why that fixes it. */
  whatChanges: string;
  evidence: BenefitEvidence[];
  relatedIndustrySlugs: string[];
  relatedComponentSlugs: string[];
  seo: SeoMap;
  published: boolean;
}
