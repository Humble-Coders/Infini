import type { SeoMap } from "./seo";

/** One row of the part-envelope panel: the figures that let an engineer self-qualify. */
export interface EnvelopeRow {
  label: string;
  value: string;
}

/**
 * `componentTypes` collection, the part-type axis.
 *
 * One document per thing a customer physically holds: gears, blades and blisks,
 * implants, dies, cutting tools, moulds, additive parts. This is the long-tail
 * search axis, and it is also where the specific numbers belong, because an
 * envelope stated in millimetres and kilograms lets a reader decide in five
 * seconds whether their part fits.
 *
 * `challenge` frames the part's own engineering problem before the treatment is
 * mentioned, which is the pattern every credible site in this category follows
 * and the weak ones invert.
 */
export interface ComponentTypeDoc {
  slug: string;
  /** Short label used in lists and cross-links, e.g. "Gears and shafts". */
  name: string;
  order: number;
  /** The page's own h1. Unique per route. */
  headline: string;
  /** One sentence, used on the index cards and as the meta description fallback. */
  summary: string;
  /** The part's engineering problem, stated before MMP appears. */
  challenge: string;
  /** What MMP does to this specific part type. */
  treatment: string;
  envelope: EnvelopeRow[];
  materials: string[];
  relatedIndustrySlugs: string[];
  relatedBenefitSlugs: string[];
  seo: SeoMap;
  published: boolean;
}
