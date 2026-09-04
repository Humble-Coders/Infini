/**
 * Typed shapes for `pages/home`'s section `fields` — narrowed at the point
 * of use via `getSection<T>()` (lib/data/pages.ts), since `PageSection` itself
 * stays untyped to accommodate any future section `type`.
 */
export interface HeroCopy {
  /** Small technical line above the headline. Optional so older documents still render. */
  eyebrow?: string;
  heading: string;
  body: string;
  ctaNote: string;
}

/** The one-paragraph "what INFINI is" block under the hero — revealed word by word on scroll. */
export interface StatementCopy {
  label?: string;
  heading: string;
  body?: string;
}

export interface StatItemData {
  value: string;
  label: string;
}

/** The credibility band: an intro sentence plus 2–4 headline figures. */
export interface StatsCopy {
  intro: string;
  items: StatItemData[];
}

export interface TechnologyStep {
  step: string;
  title: string;
  description: string;
}

/** One photograph in a home-page section: a media-library URL (or a /public path), its alt text, and an optional caption. */
export interface HomeImage {
  src: string;
  alt: string;
  caption?: string;
}

export interface TechnologyCopy {
  eyebrow: string;
  heading: string;
  body: string;
  steps: TechnologyStep[];
  /** Up to two photos: the first leads the section, the second sits under the steps. Optional so older documents still render. */
  images?: HomeImage[];
}

/** One tile in the component gallery under the hero. */
export interface GalleryItem extends HomeImage {
  /** Small mono label above the caption, usually the industry. */
  label: string;
}

/** The "what we finish" photo band directly below the hero. */
export interface GalleryCopy {
  eyebrow: string;
  heading: string;
  items: GalleryItem[];
}

/** Shared shape for every homepage teaser section (industries/case studies/testimonials/news/contact). */
export interface TeaserCopy {
  eyebrow: string;
  heading: string;
  body?: string;
  emptyState?: string;
}
