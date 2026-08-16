/**
 * Generic, reusable `PageSection.fields` shapes — used across multiple
 * `pages/*` documents (company, capabilities, and the T16 legacy capability
 * pages), unlike lib/types/homeSections.ts's shapes which are specific to
 * the homepage's own section types.
 */
/** Distinct from homeSections.ts's HeroCopy — that one is homepage-specific and has no eyebrow. */
export interface PageHeroCopy {
  eyebrow: string;
  heading: string;
  body: string;
}

export interface TextBlockCopy {
  heading: string;
  body: string;
}

export interface ListCopy {
  heading: string;
  items: string[];
}
