import type { Metadata } from "next";
import { ContactSection } from "@/components/sections/contact/ContactSection";
import { Hero } from "@/components/sections/hero/Hero";
import { IndustriesShowcase } from "@/components/sections/industries/IndustriesShowcase";
import { ApplicationsSection } from "@/components/sections/applications/ApplicationsSection";
import { TrustedByCompanies } from "@/components/sections/trust/TrustedByCompanies";
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
import type { TechnologyStep, TeaserCopy, HeroCopy, CaseStudyDoc, WithId } from "@/lib/types";

// TEMP DEMO DATA — hardcoded so the homepage section has something to show before
// real case studies are seeded in Firestore. Images are seeded picsum.photos
// placeholders (see the remotePatterns note in next.config.ts). Remove once
// content is authored in Firestore.
const DEMO_TIMESTAMP = { toDate: () => new Date(), seconds: 0, nanoseconds: 0 };
const DEMO_SEO = { title: "", description: "", ogTitle: "", ogDescription: "", ogImage: "", canonical: "", noindex: true };

const DEMO_CASE_STUDIES: WithId<CaseStudyDoc>[] = [
  {
    id: "demo-1",
    slug: "demo-aerospace-turbine-blade",
    title: "Aerospace Turbine Blade Finishing",
    industryId: "aerospace",
    challenge: "Micro-burrs on turbine blade edges were affecting fatigue inspection and surface reliability.",
    solution: "Applied MMP treatment to uniformly deburr and polish critical edges.",
    process: "3-stage MMP cycle with in-process surface roughness verification.",
    result: "Reduced surface roughness, improved fatigue performance, consistent finish quality.",
    results: [
      { label: "Surface roughness", value: "Improved", direction: "down" },
      { label: "Fatigue performance", value: "Enhanced", direction: "up" },
      { label: "Finish quality", value: "Consistent", direction: "check" },
    ],
    beforeImage: "https://picsum.photos/seed/infini-cs-turbine-before/1200/900",
    afterImage: "https://picsum.photos/seed/infini-cs-turbine-after/1200/900",
    gallery: [],
    specs: { material: "Inconel 718", process: "MMP Deburring", duration: "48 hrs" },
    seo: DEMO_SEO,
    published: true,
    publishedAt: DEMO_TIMESTAMP,
  },
  {
    id: "demo-2",
    slug: "demo-medical-implant-mirror-finish",
    title: "Medical Implant Mirror Finish",
    industryId: "medical",
    challenge: "Orthopedic implant surfaces required an ultra-consistent finish for demanding medical applications.",
    solution: "MMP mirror-finish process applied to complex implant geometries.",
    process: "Multi-pass MMP polishing with roughness measurement between passes.",
    result: "Improved surface consistency, reduced surface roughness, improved finishing quality.",
    results: [
      { label: "Surface consistency", value: "Improved", direction: "up" },
      { label: "Surface roughness", value: "Reduced", direction: "down" },
      { label: "Finishing quality", value: "Improved", direction: "check" },
    ],
    beforeImage: "https://picsum.photos/seed/infini-cs-implant-before/1200/900",
    afterImage: "https://picsum.photos/seed/infini-cs-implant-after/1200/900",
    gallery: [],
    specs: { material: "Titanium Ti-6Al-4V", process: "MMP Mirror Finish", duration: "36 hrs" },
    seo: DEMO_SEO,
    published: true,
    publishedAt: DEMO_TIMESTAMP,
  },
  {
    id: "demo-3",
    slug: "demo-automotive-gear-validation",
    title: "Automotive Gear Surface Validation",
    industryId: "automotive",
    challenge: "Transmission gears showed inconsistent surface finish across production batches.",
    solution: "Standardized MMP treatment with batch-level validation reporting.",
    process: "Automated MMP line with per-batch surface roughness sampling.",
    result: "Improved consistency, reduced friction, improved surface quality.",
    results: [
      { label: "Consistency", value: "Improved", direction: "up" },
      { label: "Friction", value: "Reduced", direction: "down" },
      { label: "Surface quality", value: "Improved", direction: "check" },
    ],
    beforeImage: "https://picsum.photos/seed/infini-cs-gear-before/1200/900",
    afterImage: "https://picsum.photos/seed/infini-cs-gear-after/1200/900",
    gallery: [],
    specs: { material: "Case-hardened steel", process: "MMP Validation", duration: "24 hrs" },
    seo: DEMO_SEO,
    published: true,
    publishedAt: DEMO_TIMESTAMP,
  },
  {
    id: "demo-4",
    slug: "demo-precision-component-optimization",
    title: "Precision Component Optimization",
    industryId: "industrial",
    challenge: "Precision industrial components required a more consistent finishing process.",
    solution: "Standardized MMP treatment tuned to the component's tolerance and duty cycle.",
    process: "Repeatable MMP cycle with in-process variation sampling.",
    result: "Improved repeatability, better surface quality, reduced process variation.",
    results: [
      { label: "Repeatability", value: "Improved", direction: "up" },
      { label: "Surface quality", value: "Better", direction: "check" },
      { label: "Process variation", value: "Reduced", direction: "down" },
    ],
    beforeImage: "https://picsum.photos/seed/infini-cs-industrial-before/1200/900",
    afterImage: "https://picsum.photos/seed/infini-cs-industrial-after/1200/900",
    gallery: [],
    specs: { material: "Engineering alloy", process: "MMP Finishing", duration: "30 hrs" },
    seo: DEMO_SEO,
    published: true,
    publishedAt: DEMO_TIMESTAMP,
  },
  {
    id: "demo-5",
    slug: "demo-turbine-component-finishing",
    title: "Turbine Component Finishing",
    industryId: "energy",
    challenge: "High-performance turbine components required controlled finishing for demanding operating conditions.",
    solution: "Applied MMP treatment calibrated to the component's operating tolerances.",
    process: "Controlled MMP cycle with in-process surface verification.",
    result: "Improved surface quality, consistent finishing, improved component performance.",
    results: [
      { label: "Surface quality", value: "Improved", direction: "up" },
      { label: "Finishing", value: "Consistent", direction: "check" },
      { label: "Component performance", value: "Improved", direction: "up" },
    ],
    beforeImage: "https://picsum.photos/seed/infini-cs-energy-before/1200/900",
    afterImage: "https://picsum.photos/seed/infini-cs-energy-after/1200/900",
    gallery: [],
    specs: { material: "High-performance alloy", process: "MMP Finishing", duration: "40 hrs" },
    seo: DEMO_SEO,
    published: true,
    publishedAt: DEMO_TIMESTAMP,
  },
];

const FALLBACK_TITLE = "INFINI | Precision Surface-Finishing";
const FALLBACK_DESCRIPTION =
  "INFINI applies ISO 9001-certified MMP surface-finishing to components precision manufacturers already make, validated in-house, verified before it ships.";

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
  const technology = getSection<{ eyebrow: string; heading: string; body: string; steps: TechnologyStep[] }>(page, "technology");
  const caseStudiesTeaser = getSection<TeaserCopy>(page, "caseStudiesTeaser");
  const testimonialsTeaser = getSection<TeaserCopy>(page, "testimonialsTeaser");
  const newsTeaser = getSection<TeaserCopy>(page, "newsTeaser");
  const contactTeaser = getSection<TeaserCopy>(page, "contactTeaser");

  return (
    <main className="min-h-screen bg-background">
      <Hero copy={hero} industries={industries} />
      {technology && <TechnologySection copy={technology} />}
      <IndustriesShowcase />
      <ApplicationsSection />
      <TrustedByCompanies />
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
