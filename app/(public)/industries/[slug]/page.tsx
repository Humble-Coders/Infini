import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getIndustryBySlug, getPublishedIndustries, getPublishedIndustrySlugs } from "@/lib/data/industries";
import { IndustryPageContent } from "@/components/sections/industry/IndustryPageContent";
import { getCaseStudiesByIndustry } from "@/lib/data/caseStudies";
import { getCertificationsByIds } from "@/lib/data/certifications";
import { ogTitle, pageTitle, canonicalUrl } from "@/lib/seo";


/*
 * ISR window. Without this the route re-renders and re-reads Firestore on
 * every request, so returning to a page costs the same round trips as
 * arriving the first time. Publishing should still revalidate the path for
 * an immediate update; this is the floor, not the mechanism.
 */
export const revalidate = 600;

export async function generateStaticParams() {
  const slugs = await getPublishedIndustrySlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const industry = await getIndustryBySlug(slug);
  if (!industry) return {};

  return {
    title: pageTitle(industry.seo.title),
    description: industry.seo.description,
    alternates: { canonical: canonicalUrl(`/industries/${slug}`, industry.seo.canonical) },
    openGraph: {
      title: ogTitle(industry.seo.title),
      description: industry.seo.description,
      type: "website",
    },
  };
}

export default async function IndustryDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const industry = await getIndustryBySlug(slug);
  if (!industry) notFound();

  const [caseStudies, certifications, allIndustries] = await Promise.all([
    getCaseStudiesByIndustry(industry.id),
    getCertificationsByIds(industry.relatedCertIds),
    getPublishedIndustries(),
  ]);

  return (
    <IndustryPageContent
      industry={industry}
      certifications={certifications}
      caseStudies={caseStudies}
      siblings={allIndustries.filter((sibling) => sibling.slug !== industry.slug)}
    />
  );
}
