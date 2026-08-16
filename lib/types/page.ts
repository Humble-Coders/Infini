import type { SeoMap } from "./seo";

/**
 * Singleton page IDs — one document per fixed page, `pages/{id}`. The four
 * legacy-slug entries (T16, PRD decision D7) keep their exact URLs from the
 * old site — no `/capabilities/` prefix — because they carry independent
 * search ranking a redirect into a hub page would throw away.
 */
export type PageId =
  | "home"
  | "company"
  | "capabilities"
  | "contact"
  | "technology"
  | "validation"
  | "deburring-polishing"
  | "mirror-like-finish";

/**
 * A page is composed of an ordered list of sections. Section shapes vary by
 * `type` and are admin-authored content, not a fixed schema — kept as a
 * structural record here rather than a closed union so new section types
 * don't require a type-layer change. Never `any`: every value is `unknown`
 * until narrowed by the consuming section component.
 */
export interface PageSection {
  type: string;
  fields: Record<string, unknown>;
}

/** `pages` collection — singleton page content (home, company, capabilities, contact). */
export interface PageDoc {
  id: PageId;
  sections: PageSection[];
  seo: SeoMap;
}
