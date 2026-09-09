import type { Metadata } from "next";
import { getPage, getSection, getContentBlocks } from "@/lib/data/pages";
import { getPublishedIndustries } from "@/lib/data/industries";
import { MirrorFinishPageContent } from "@/components/sections/capability/MirrorFinishPageContent";
import type { GalleryCopy, PageHeroCopy, SpecTableCopy, StatTripletCopy } from "@/lib/types";
import { ogTitle, pageTitle } from "@/lib/seo";


/*
 * ISR window. Without this the route re-renders and re-reads Firestore on
 * every request, so returning to a page costs the same round trips as
 * arriving the first time. Publishing should still revalidate the path for
 * an immediate update; this is the floor, not the mechanism.
 */
export const revalidate = 600;

const RELATED_SLUGS = ["medical-implants", "plastic-injection-molds"];

const FALLBACK: Metadata = {
  title: "Mirror-Like Finish: MMP Surface Treatment",
  description:
    "How INFINI achieves a true mirror-like finish through MMP surface treatment, total roughness elimination with minimal material removal.",
};

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage("mirror-like-finish");
  if (!page) return FALLBACK;
  return {
    title: pageTitle(page.seo.title),
    description: page.seo.description,
    openGraph: { title: ogTitle(page.seo.title), description: page.seo.description, type: "website" },
  };
}

const HERO_FALLBACK: PageHeroCopy = {
  eyebrow: "Mirror-like finish",
  heading: "A mirror finish is a number, not an adjective.",
  body: "The roughness bands INFINI works to, in the units you already have on the drawing.",
};

export default async function MirrorLikeFinishPage() {
  const [page, homePage, industries] = await Promise.all([
    getPage("mirror-like-finish"),
    getPage("home"),
    getPublishedIndustries(),
  ]);
  const relatedIndustries = industries.filter((industry) => RELATED_SLUGS.includes(industry.slug));

  return (
    <MirrorFinishPageContent
      hero={getSection<PageHeroCopy>(page, "hero") ?? HERO_FALLBACK}
      blocks={getContentBlocks(page)}
      industries={relatedIndustries}
      gallery={getSection<GalleryCopy>(homePage, "gallery")}
      spec={getSection<SpecTableCopy>(page, "specTable") ?? undefined}
      stats={getSection<StatTripletCopy>(page, "stats") ?? undefined}
    />
  );
}
