/** SEO fields embedded as a `seo` map on each content document — see docs/PRD.md §4.3. */
export interface SeoMap {
  title: string;
  description: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  canonical: string;
  noindex: boolean;
}
