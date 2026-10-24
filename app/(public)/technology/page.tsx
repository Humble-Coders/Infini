import type { Metadata } from "next";
import { getPage, getSection, getContentBlocks } from "@/lib/data/pages";
import { getPublishedIndustries } from "@/lib/data/industries";
import { TechnologyPageContent } from "@/components/sections/capability/TechnologyPageContent";
import type {
  ComparisonCopy,
  GalleryCopy,
  PageHeroCopy,
  SpecTableCopy,
  StatTripletCopy,
  TechnologyCopy,
} from "@/lib/types";
import { ogTitle, pageTitle } from "@/lib/seo";


/*
 * ISR window. Without this the route re-renders and re-reads Firestore on
 * every request, so returning to a page costs the same round trips as
 * arriving the first time. Publishing should still revalidate the path for
 * an immediate update; this is the floor, not the mechanism.
 */
export const revalidate = 600;

const FALLBACK: Metadata = {
  title: "MMP Technology: The Process Behind INFINI's Surface Finishing",
  description:
    "How MMP (Micro Machining Process) technology works: a licensed mechanical-physical-catalyst treatment that removes surface roughness by frequency, preserving part form.",
};

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage("technology");
  if (!page) return FALLBACK;
  return {
    title: pageTitle(page.seo.title),
    description: page.seo.description,
    openGraph: { title: ogTitle(page.seo.title), description: page.seo.description, type: "website" },
  };
}

const HERO_FALLBACK: PageHeroCopy = {
  eyebrow: "The MMP process",
  heading: "A treatment, not a coating.",
  body: "MMP removes surface roughness frequency by frequency, in our own tanks, without adding material or losing the part's form.",
};

export default async function TechnologyPage() {
  const [page, homePage, industries] = await Promise.all([
    getPage("technology"),
    getPage("home"),
    getPublishedIndustries(),
  ]);

  return (
    <TechnologyPageContent
      hero={getSection<PageHeroCopy>(page, "hero") ?? HERO_FALLBACK}
      blocks={getContentBlocks(page)}
      industries={industries}
      gallery={getSection<GalleryCopy>(homePage, "gallery")}
      process={getSection<TechnologyCopy>(homePage, "technology")}
      mechanism={getSection<{ label: string; heading: string; body: string }>(page, "mechanism") ?? undefined}
      spec={getSection<SpecTableCopy>(page, "specTable") ?? undefined}
      stats={getSection<StatTripletCopy>(page, "stats") ?? undefined}
      comparison={getSection<ComparisonCopy>(page, "comparison") ?? undefined}
    />
  );
}
