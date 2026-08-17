import type { Metadata } from "next";
import { Sparkles } from "lucide-react";
import { getPage, getSection, getContentBlocks } from "@/lib/data/pages";
import { getPublishedIndustries } from "@/lib/data/industries";
import { LegacyCapabilityContent } from "@/components/legacy-capability/LegacyCapabilityContent";
import type { PageHeroCopy } from "@/lib/types";

const RELATED_SLUGS = ["cutting-tools", "forge-stamping-die", "gears-transmission"];

const FALLBACK: Metadata = {
  title: "Deburring & Polishing vs. MMP Technology",
  description:
    "How traditional deburring and polishing compare to MMP surface treatment — less material removal, more consistent results, preserved part geometry.",
};

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage("deburring-polishing");
  if (!page) return FALLBACK;
  return {
    title: page.seo.title,
    description: page.seo.description,
    openGraph: { title: `${page.seo.title} — INFINI`, description: page.seo.description, type: "website" },
  };
}

export default async function DeburringPolishingPage() {
  const [page, industries] = await Promise.all([getPage("deburring-polishing"), getPublishedIndustries()]);
  const hero = getSection<PageHeroCopy>(page, "hero");
  const blocks = getContentBlocks(page);
  const relatedIndustries = industries.filter((industry) => RELATED_SLUGS.includes(industry.slug));

  if (!hero) return null;

  return <LegacyCapabilityContent hero={hero} blocks={blocks} relatedIndustries={relatedIndustries} icon={Sparkles} />;
}
