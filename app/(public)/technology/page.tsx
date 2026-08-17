import type { Metadata } from "next";
import { Cpu } from "lucide-react";
import { getPage, getSection, getContentBlocks } from "@/lib/data/pages";
import { getPublishedIndustries } from "@/lib/data/industries";
import { LegacyCapabilityContent } from "@/components/legacy-capability/LegacyCapabilityContent";
import type { PageHeroCopy } from "@/lib/types";

const FALLBACK: Metadata = {
  title: "MMP Technology — The Process Behind INFINI's Surface Finishing",
  description:
    "How MMP (Micro Machining Process) technology works: a licensed mechanical-physical-catalyst treatment that removes surface roughness by frequency, preserving part form.",
};

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage("technology");
  if (!page) return FALLBACK;
  return {
    title: page.seo.title,
    description: page.seo.description,
    openGraph: { title: `${page.seo.title} — INFINI`, description: page.seo.description, type: "website" },
  };
}

export default async function TechnologyPage() {
  const [page, industries] = await Promise.all([getPage("technology"), getPublishedIndustries()]);
  const hero = getSection<PageHeroCopy>(page, "hero");
  const blocks = getContentBlocks(page);

  if (!hero) return null;

  return <LegacyCapabilityContent hero={hero} blocks={blocks} relatedIndustries={industries} icon={Cpu} />;
}
