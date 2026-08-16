import type { Metadata } from "next";
import { ContactSection } from "@/components/sections/contact/ContactSection";
import { Hero } from "@/components/sections/hero/Hero";
import { IndustriesSection } from "@/components/sections/industries/IndustriesSection";
import { StatsSection } from "@/components/sections/stats/StatsSection";
import { TechnologySection } from "@/components/sections/technology/TechnologySection";
import { CaseStudiesSection } from "@/components/sections/case-studies/CaseStudiesSection";
import { TestimonialsSection } from "@/components/sections/testimonials/TestimonialsSection";
import { NewsSection } from "@/components/sections/news/NewsSection";
import { ClosingCta } from "@/components/sections/cta/ClosingCta";
import { getPage, getSection } from "@/lib/data/pages";
import { getPublishedIndustries } from "@/lib/data/industries";
import { getPublishedCaseStudies } from "@/lib/data/caseStudies";
import { getPublishedTestimonials } from "@/lib/data/testimonials";
import { getPublishedNews } from "@/lib/data/news";
import { getSettings } from "@/lib/data/settings";
import type { StatItemData, TechnologyStep, TeaserCopy, HeroCopy } from "@/lib/types";

const FALLBACK_TITLE = "INFINI — Precision Surface-Finishing";
const FALLBACK_DESCRIPTION =
  "INFINI applies ISO 9001-certified MMP surface-finishing to components precision manufacturers already make — validated in-house, verified before it ships.";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage("home");
  const title = page?.seo.title ?? FALLBACK_TITLE;
  const description = page?.seo.description ?? FALLBACK_DESCRIPTION;
  return {
    title,
    description,
    openGraph: { title, description, type: "website" },
  };
}

export default async function Home() {
  const [page, industries, caseStudies, testimonials, news, settings] = await Promise.all([
    getPage("home"),
    getPublishedIndustries(),
    getPublishedCaseStudies(),
    getPublishedTestimonials(),
    getPublishedNews(),
    getSettings(),
  ]);

  const hero = getSection<HeroCopy>(page, "hero");
  const stats = getSection<{ intro: string; items: StatItemData[] }>(page, "stats");
  const technology = getSection<{ eyebrow: string; heading: string; body: string; steps: TechnologyStep[] }>(page, "technology");
  const industriesTeaser = getSection<TeaserCopy>(page, "industriesTeaser");
  const caseStudiesTeaser = getSection<TeaserCopy>(page, "caseStudiesTeaser");
  const testimonialsTeaser = getSection<TeaserCopy>(page, "testimonialsTeaser");
  const newsTeaser = getSection<TeaserCopy>(page, "newsTeaser");
  const contactTeaser = getSection<TeaserCopy>(page, "contactTeaser");

  return (
    <main className="min-h-screen bg-background">
      <Hero copy={hero} industries={industries} />
      {technology && <TechnologySection copy={technology} />}
      {industriesTeaser && <IndustriesSection copy={industriesTeaser} industries={industries} />}
      {stats && <StatsSection intro={stats.intro} items={stats.items} />}
      {caseStudiesTeaser && <CaseStudiesSection copy={caseStudiesTeaser} caseStudies={caseStudies} />}
      {testimonialsTeaser && <TestimonialsSection copy={testimonialsTeaser} testimonials={testimonials} />}
      {newsTeaser && <NewsSection copy={newsTeaser} news={news} />}
      <ClosingCta />
      {contactTeaser && <ContactSection copy={contactTeaser} contact={settings?.contact ?? null} industries={industries} />}
    </main>
  );
}
