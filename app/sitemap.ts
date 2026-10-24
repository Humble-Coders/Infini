import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";

/**
 * Sitemap: static route spine plus live detail slugs from Firestore.
 *
 * Every dynamic fetch is individually guarded — if Firestore is unreachable
 * at build time (missing creds, network blip), that section drops out of
 * the sitemap instead of failing the whole build. The static spine always
 * survives, so a bad content fetch can never break a deploy.
 *
 * lastModified is only emitted where a document carries a real date (news and
 * case studies, `publishedAt`). Stamping "now" on every URL on every build
 * tells crawlers everything changed, which trains them to ignore the field.
 * /request-a-quote is deliberately absent: it renders the contact page and
 * declares /contact as its canonical.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();

  const STATIC: Array<{ path: string; priority: number }> = [
    { path: "/", priority: 1 },
    { path: "/industries", priority: 0.9 },
    { path: "/capabilities", priority: 0.9 },
    { path: "/technology", priority: 0.8 },
    { path: "/validation", priority: 0.8 },
    { path: "/deburring-polishing", priority: 0.8 },
    { path: "/mirror-like-finish", priority: 0.8 },
    { path: "/components", priority: 0.8 },
    { path: "/benefits", priority: 0.8 },
    { path: "/case-studies", priority: 0.8 },
    { path: "/company", priority: 0.7 },
    { path: "/certifications", priority: 0.7 },
    { path: "/news", priority: 0.7 },
    { path: "/events", priority: 0.6 },
    { path: "/contact", priority: 0.7 },
    { path: "/privacy", priority: 0.2 },
    { path: "/terms", priority: 0.2 },
  ];

  type Entry = { slug: string; publishedAt?: { toDate(): Date }; seo?: { noindex?: boolean } };

  async function slugs(
    section: string,
    loader: () => Promise<Array<string | Entry>>
  ): Promise<MetadataRoute.Sitemap> {
    try {
      // Documents an editor marked noindex stay out, matching their robots meta.
      const list = (await loader()).filter((item) => typeof item === "string" || !item.seo?.noindex);
      return list.map((item) => {
        const { slug, publishedAt } = typeof item === "string" ? { slug: item, publishedAt: undefined } : item;
        const lastModified = typeof publishedAt?.toDate === "function" ? publishedAt.toDate() : undefined;
        return {
          url: `${base}/${section}/${slug}`,
          ...(lastModified ? { lastModified } : {}),
          changeFrequency: "weekly" as const,
          priority: 0.7,
        };
      });
    } catch (error) {
      console.warn(`sitemap: skipping ${section}, content fetch failed`, error);
      return [];
    }
  }

  const [{ getPublishedIndustrySlugs }, { getPublishedCaseStudies }, { getPublishedNews }] =
    await Promise.all([import("@/lib/data/industries"), import("@/lib/data/caseStudies"), import("@/lib/data/news")]);
  const [{ getPublishedComponentTypeSlugs }, { getPublishedBenefitSlugs }] = await Promise.all([
    import("@/lib/data/componentTypes"),
    import("@/lib/data/benefits"),
  ]);

  const dynamic = (
    await Promise.all([
      slugs("industries", getPublishedIndustrySlugs),
      slugs("case-studies", getPublishedCaseStudies),
      slugs("news", getPublishedNews),
      slugs("components", getPublishedComponentTypeSlugs),
      slugs("benefits", getPublishedBenefitSlugs),
    ])
  ).flat();

  return [
    ...STATIC.map(({ path, priority }) => ({
      url: `${base}${path}`,
      changeFrequency: "monthly" as const,
      priority,
    })),
    ...dynamic,
  ];
}
