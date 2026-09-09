/**
 * Generic, reusable `PageSection.fields` shapes, used across multiple
 * `pages/*` documents (company, capabilities, and the T16 legacy capability
 * pages), unlike lib/types/homeSections.ts's shapes which are specific to
 * the homepage's own section types.
 */
/** Distinct from homeSections.ts's HeroCopy. That one is homepage-specific and has no eyebrow. */
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

/**
 * A generic CMS block as returned by `getContentBlocks`. The capability pages
 * use two section types in document order rather than pulling named sections
 * out one at a time, so a page can gain a paragraph without a code change.
 */
export type ContentBlock =
  | { type: "text"; heading: string; body: string }
  | { type: "list"; heading: string; items: string[] };

/**
 * One row of a capability spec table. `unit` is its own column rather than
 * being folded into the value, so a column of figures stays numerically
 * aligned and an engineer can scan units down the page.
 */
export interface SpecRow {
  parameter: string;
  unit: string;
  value: string;
  note?: string;
}

export interface SpecTableCopy {
  heading: string;
  intro?: string;
  caption?: string;
  rows: SpecRow[];
}

/**
 * The capability triplet: part envelope, measured before/after roughness, and
 * a third-party outcome. Three figures answer "will you take my part", "how
 * good is the result" and "why should I believe you" in one band.
 */
export interface StatFigure {
  value: string;
  unit?: string;
  label: string;
  detail?: string;
}

export interface StatTripletCopy {
  heading?: string;
  figures: StatFigure[];
}

/** One stage of a staged engagement, such as the validation protocol. */
export interface Stage {
  step: string;
  title: string;
  description: string;
  /** What INFINI needs from the customer to start this stage. */
  requires?: string;
}

export interface StageSequenceCopy {
  eyebrow?: string;
  heading: string;
  body?: string;
  stages: Stage[];
}

/** A criterion compared across MMP and a named alternative process. */
export interface ComparisonRow {
  criterion: string;
  mmp: string;
  alternative: string;
}

export interface ComparisonCopy {
  eyebrow?: string;
  heading: string;
  body?: string;
  /** Column header for the alternative being compared against, named explicitly. */
  alternativeLabel: string;
  rows: ComparisonRow[];
}
