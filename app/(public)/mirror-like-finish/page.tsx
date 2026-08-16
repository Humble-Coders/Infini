import type { Metadata } from "next";
import { getPage, getSection, getContentBlocks } from "@/lib/data/pages";
import { getPublishedIndustries } from "@/lib/data/industries";
import { LegacyCapabilityContent } from "@/components/legacy-capability/LegacyCapabilityContent";
import type { PageHeroCopy } from "@/lib/types";

const RELATED_SLUGS = ["medical-implants", "plastic-injection-molds"];

const FALLBACK: Metadata = {
  title: "Mirror-Like Finish — MMP Surface Treatment",
  description:
    "How INFINI achieves a true mirror-like finish through MMP surface treatment — total roughness elimination with minimal material removal.",
};

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage("mirror-like-finish");
  if (!page) return FALLBACK;
  return {
    title: page.seo.title,
    description: page.seo.description,
    openGraph: { title: `${page.seo.title} — INFINI`, description: page.seo.description, type: "website" },
  };
}

export default async function MirrorLikeFinishPage() {
  const [page, industries] = await Promise.all([getPage("mirror-like-finish"), getPublishedIndustries()]);
  const hero = getSection<PageHeroCopy>(page, "hero");
  const blocks = getContentBlocks(page);
  const relatedIndustries = industries.filter((industry) => RELATED_SLUGS.includes(industry.slug));

  if (!hero) return null;

  return <LegacyCapabilityContent hero={hero} blocks={blocks} relatedIndustries={relatedIndustries} />;
}
