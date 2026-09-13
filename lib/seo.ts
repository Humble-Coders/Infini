import type { Metadata } from "next";

/** Brand suffix appended by the root layout's title template (app/layout.tsx). */
export const SITE_NAME = "INFINI";

/**
 * Matches the brand only where it sits as a delimited token at the start or end
 * of a title, such as "Contact Us | INFINI", "INFINI | Precision Surface-Finishing".
 * A title that merely mentions the brand inline ("About INFINI: …") is left
 * alone, so it still picks up the suffix like every other page.
 */
const BRAND_AT_EDGE = new RegExp(String.raw`(^${SITE_NAME}\s*[|·–-]|[|·–-]\s*${SITE_NAME}$)`, "i");

/**
 * A page title for `metadata.title`.
 *
 * The root layout sets `template: "%s | INFINI"`, so Next appends the brand to
 * whatever a page returns. Titles are admin-editable (CLAUDE.md §7) and staff
 * naturally type the brand in themselves, which rendered as
 * "Contact Us | INFINI | INFINI". A title that already carries the brand is
 * returned as `absolute` so it opts out of the template rather than being
 * branded twice.
 */
export function pageTitle(title: string): Metadata["title"] {
  const trimmed = title.trim();
  return BRAND_AT_EDGE.test(trimmed) ? { absolute: trimmed } : trimmed;
}

/**
 * The same title for `openGraph.title`, which the template never touches, so
 * the brand has to be appended here by hand, and only when it isn't there yet.
 */
export function ogTitle(title: string): string {
  const trimmed = title.trim();
  return BRAND_AT_EDGE.test(trimmed) ? trimmed : `${trimmed} | ${SITE_NAME}`;
}

/**
 * Canonical site origin. Overridable per deploy via NEXT_PUBLIC_SITE_URL;
 * defaults to the production domain so builds without the var still emit
 * absolute OG/canonical URLs instead of silently dropping them.
 */
export function siteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? "https://infini.co.in").replace(/\/$/, "");
}

/**
 * Canonical URL for a page. Prefers the CMS `seo.canonical` override when an
 * editor set one (absolute or path), otherwise the site path passed in.
 */
export function canonicalUrl(fallbackPath: string, override?: string): string {
  const base = siteUrl();
  const clean = (override ?? "").trim();
  if (!clean) return `${base}${fallbackPath}`;
  if (/^https?:\/\//i.test(clean)) return clean;
  return `${base}${clean.startsWith("/") ? clean : `/${clean}`}`;
}
