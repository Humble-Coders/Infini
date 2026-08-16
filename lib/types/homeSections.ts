/**
 * Typed shapes for `pages/home`'s section `fields` — narrowed at the point
 * of use via `getSection<T>()` (lib/data/pages.ts), since `PageSection` itself
 * stays untyped to accommodate any future section `type`.
 */
export interface HeroCopy {
  heading: string;
  body: string;
  ctaNote: string;
}

export interface StatItemData {
  value: string;
  label: string;
}

export interface TechnologyStep {
  step: string;
  title: string;
  description: string;
}

/** Shared shape for every homepage teaser section (industries/case studies/testimonials/news/contact). */
export interface TeaserCopy {
  eyebrow: string;
  heading: string;
  body?: string;
  emptyState?: string;
}
