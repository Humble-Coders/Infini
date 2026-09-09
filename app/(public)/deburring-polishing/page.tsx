import type { Metadata } from "next";
import { getPage, getSection, getContentBlocks } from "@/lib/data/pages";
import { getPublishedIndustries } from "@/lib/data/industries";
import { DeburringPageContent } from "@/components/sections/capability/DeburringPageContent";
import type { ComparisonCopy, GalleryCopy, PageHeroCopy, StatTripletCopy } from "@/lib/types";
import { ogTitle, pageTitle } from "@/lib/seo";


/*
 * ISR window. Without this the route re-renders and re-reads Firestore on
 * every request, so returning to a page costs the same round trips as
 * arriving the first time. Publishing should still revalidate the path for
 * an immediate update; this is the floor, not the mechanism.
 */
export const revalidate = 600;

const RELATED_SLUGS = ["cutting-tools", "forge-stamping-die", "gears-transmission"];

const FALLBACK: Metadata = {
  title: "Deburring & Polishing vs. MMP Technology",
  description:
    "How traditional deburring and polishing compare to MMP surface treatment, less material removal, more consistent results, preserved part geometry.",
};

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage("deburring-polishing");
  if (!page) return FALLBACK;
  return {
    title: pageTitle(page.seo.title),
    description: page.seo.description,
    openGraph: { title: ogTitle(page.seo.title), description: page.seo.description, type: "website" },
  };
}

const HERO_FALLBACK: PageHeroCopy = {
  eyebrow: "Deburring and polishing",
  heading: "Finishing that filters, instead of abrading.",
  body: "Where conventional deburring and polishing reach their limit, and where MMP is the wrong answer too.",
};

export default async function DeburringPolishingPage() {
  const [page, homePage, industries] = await Promise.all([
    getPage("deburring-polishing"),
    getPage("home"),
    getPublishedIndustries(),
  ]);
  const relatedIndustries = industries.filter((industry) => RELATED_SLUGS.includes(industry.slug));

  return (
    <DeburringPageContent
      hero={getSection<PageHeroCopy>(page, "hero") ?? HERO_FALLBACK}
      blocks={getContentBlocks(page)}
      industries={relatedIndustries}
      gallery={getSection<GalleryCopy>(homePage, "gallery")}
      comparison={getSection<ComparisonCopy>(page, "comparison") ?? undefined}
      stats={getSection<StatTripletCopy>(page, "stats") ?? undefined}
    />
  );
}
