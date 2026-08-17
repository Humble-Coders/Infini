import type { Metadata } from "next";
import { ShieldCheck } from "lucide-react";
import { getPage, getSection, getContentBlocks } from "@/lib/data/pages";
import { getPublishedIndustries } from "@/lib/data/industries";
import { LegacyCapabilityContent } from "@/components/legacy-capability/LegacyCapabilityContent";
import type { PageHeroCopy } from "@/lib/types";

const RELATED_SLUGS = ["medical-implants", "aerospace"];

const FALLBACK: Metadata = {
  title: "Validation Process — How INFINI Verifies Surface Finishing Results",
  description:
    "INFINI's three-stage validation process for MMP surface treatment: technical, industrial, and production validation, each measured and customer-verified.",
};

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage("validation");
  if (!page) return FALLBACK;
  return {
    title: page.seo.title,
    description: page.seo.description,
    openGraph: { title: `${page.seo.title} — INFINI`, description: page.seo.description, type: "website" },
  };
}

export default async function ValidationPage() {
  const [page, industries] = await Promise.all([getPage("validation"), getPublishedIndustries()]);
  const hero = getSection<PageHeroCopy>(page, "hero");
  const blocks = getContentBlocks(page);
  const relatedIndustries = industries.filter((industry) => RELATED_SLUGS.includes(industry.slug));

  if (!hero) return null;

  return <LegacyCapabilityContent hero={hero} blocks={blocks} relatedIndustries={relatedIndustries} icon={ShieldCheck} />;
}
