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
import type { StatItemData, TechnologyStep, TeaserCopy, HeroCopy, CaseStudyDoc, WithId } from "@/lib/types";

// TEMP DEMO DATA — hardcoded so the homepage section has something to show before
// real case studies are seeded in Firestore. Images are seeded picsum.photos
// placeholders (see the remotePatterns note in next.config.ts). Remove once
// content is authored in Firestore.
const DEMO_TIMESTAMP = { toDate: () => new Date(), seconds: 0, nanoseconds: 0 };
const DEMO_CASE_STUDIES: WithId<CaseStudyDoc>[] = [
  {
    id: "demo-1",
    slug: "demo-aerospace-turbine-blade",
    title: "Aerospace Turbine Blade Finishing",
    industryId: "aerospace",
    challenge: "Micro-burrs on turbine blade edges were failing fatigue inspection.",
    solution: "Applied MMP treatment to uniformly deburr and polish critical edges.",
    process: "3-stage MMP cycle with in-process surface roughness verification.",
    result: "100% pass rate on fatigue inspection, zero rework.",
    beforeImage: "https://picsum.photos/seed/infini-cs-turbine-before/1200/900",
    afterImage: "https://picsum.photos/seed/infini-cs-turbine-after/1200/900",
    gallery: [],
    specs: { material: "Inconel 718", process: "MMP Deburring", duration: "48 hrs" },
    seo: { title: "", description: "", ogTitle: "", ogDescription: "", ogImage: "", canonical: "", noindex: true },
    published: true,
    publishedAt: DEMO_TIMESTAMP,
  },
  {
    id: "demo-2",
    slug: "demo-medical-implant-mirror-finish",
    title: "Medical Implant Mirror Finish",
    industryId: "medical",
    challenge: "Orthopedic implants required a mirror-like surface for biocompatibility.",
    solution: "MMP mirror-finish process applied to complex implant geometries.",
    process: "Multi-pass MMP polishing with Ra measurement between passes.",
    result: "Achieved Ra < 0.1 µm across all surfaces, met ISO 13485 requirements.",
    beforeImage: "https://picsum.photos/seed/infini-cs-implant-before/1200/900",
    afterImage: "https://picsum.photos/seed/infini-cs-implant-after/1200/900",
    gallery: [],
    specs: { material: "Titanium Ti-6Al-4V", process: "MMP Mirror Finish", duration: "36 hrs" },
    seo: { title: "", description: "", ogTitle: "", ogDescription: "", ogImage: "", canonical: "", noindex: true },
    published: true,
    publishedAt: DEMO_TIMESTAMP,
  },
  {
    id: "demo-3",
    slug: "demo-automotive-gear-validation",
    title: "Automotive Gear Surface Validation",
    industryId: "automotive",
    challenge: "Transmission gears showed inconsistent surface finish across batches.",
    solution: "Standardized MMP treatment with batch-level validation reporting.",
    process: "Automated MMP line with per-batch surface roughness sampling.",
    result: "Reduced surface finish variance by 60% across production batches.",
    beforeImage: "https://picsum.photos/seed/infini-cs-gear-before/1200/900",
    afterImage: "https://picsum.photos/seed/infini-cs-gear-after/1200/900",
    gallery: [],
    specs: { material: "Case-hardened Steel", process: "MMP Validation", duration: "24 hrs" },
    seo: { title: "", description: "", ogTitle: "", ogDescription: "", ogImage: "", canonical: "", noindex: true },
    published: true,
    publishedAt: DEMO_TIMESTAMP,
  },
];

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
      {caseStudiesTeaser && (
        <CaseStudiesSection
          copy={caseStudiesTeaser}
          caseStudies={caseStudies.length > 0 ? caseStudies : DEMO_CASE_STUDIES}
        />
      )}
      {testimonialsTeaser && <TestimonialsSection copy={testimonialsTeaser} testimonials={testimonials} />}
      {newsTeaser && <NewsSection copy={newsTeaser} news={news} />}
      <ClosingCta />
      {contactTeaser && <ContactSection copy={contactTeaser} contact={settings?.contact ?? null} industries={industries} />}
    </main>
  );
}
