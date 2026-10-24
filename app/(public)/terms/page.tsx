import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegalPage } from "@/components/sections/legal/LegalPage";
import { getLegalPage } from "@/lib/data/legal";
import { canonicalUrl, ogTitle, pageTitle } from "@/lib/seo";

export const revalidate = 600;

const FALLBACK_TITLE = "Terms of Use";
const FALLBACK_DESCRIPTION = "The terms that apply when you use the INFINI website.";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getLegalPage("terms");
  const title = page?.title ?? FALLBACK_TITLE;
  const description = page?.description || FALLBACK_DESCRIPTION;
  return {
    title: pageTitle(title),
    description,
    alternates: { canonical: canonicalUrl("/terms") },
    openGraph: { title: ogTitle(title), description, type: "website" },
  };
}

/** Text is edited in the admin dashboard (Legal pages); 404 until it exists. */
export default async function TermsofUsePage() {
  const page = await getLegalPage("terms");
  if (!page) notFound();
  return <LegalPage page={page} />;
}
