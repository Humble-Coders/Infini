import type { Metadata } from "next";
import { getPage, getSection, getContentBlocks } from "@/lib/data/pages";
import { getPublishedIndustries } from "@/lib/data/industries";
import { ValidationPageContent } from "@/components/sections/capability/ValidationPageContent";
import type { PageHeroCopy, SpecTableCopy, StageSequenceCopy, StatTripletCopy } from "@/lib/types";
import { ogTitle, pageTitle } from "@/lib/seo";


/*
 * ISR window. Without this the route re-renders and re-reads Firestore on
 * every request, so returning to a page costs the same round trips as
 * arriving the first time. Publishing should still revalidate the path for
 * an immediate update; this is the floor, not the mechanism.
 */
export const revalidate = 600;

const RELATED_SLUGS = ["medical-implants", "aerospace"];

const FALLBACK: Metadata = {
  title: "Validation Process: How INFINI Verifies Surface Finishing Results",
  description:
    "INFINI's three-stage validation process for MMP surface treatment: technical, industrial, and production validation, each measured and customer-verified.",
};

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage("validation");
  if (!page) return FALLBACK;
  return {
    title: pageTitle(page.seo.title),
    description: page.seo.description,
    openGraph: { title: ogTitle(page.seo.title), description: page.seo.description, type: "website" },
  };
}

const HERO_FALLBACK: PageHeroCopy = {
  eyebrow: "Validation",
  heading: "Proven on your part, before it runs in series.",
  body: "Three stages, each with a measured exit condition, so nothing goes into production on assumption.",
};

export default async function ValidationPage() {
  const [page, industries] = await Promise.all([
    getPage("validation"),
    getPublishedIndustries(),
  ]);
  const relatedIndustries = industries.filter((industry) => RELATED_SLUGS.includes(industry.slug));

  return (
    <ValidationPageContent
      hero={getSection<PageHeroCopy>(page, "hero") ?? HERO_FALLBACK}
      blocks={getContentBlocks(page)}
      industries={relatedIndustries}
      stages={getSection<StageSequenceCopy>(page, "stages") ?? undefined}
      spec={getSection<SpecTableCopy>(page, "specTable") ?? undefined}
      stats={getSection<StatTripletCopy>(page, "stats") ?? undefined}
    />
  );
}
