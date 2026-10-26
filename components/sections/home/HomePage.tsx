import type { Metadata } from "next";
import { ComponentGallery } from "@/components/sections/home/ComponentGallery";
import { PartnershipSection } from "@/components/sections/home/PartnershipSection";
import { HomeHero } from "@/components/sections/home/HomeHero";
import { TrustSection } from "@/components/sections/home/TrustSection";
import { IndustriesIndex } from "@/components/sections/home/IndustriesIndex";
import { MotionProvider } from "@/components/sections/home/MotionProvider";
import { ProcessSection } from "@/components/sections/home/ProcessSection";
import { BenefitsSection } from "@/components/sections/home/BenefitsSection";
import { ProofSection } from "@/components/sections/home/ProofSection";
import { ProvenWork } from "@/components/sections/home/ProvenWork";
import { Testimonials } from "@/components/sections/home/Testimonials";
import { Ticker } from "@/components/sections/home/Ticker";
import { SolutionFinder } from "@/components/sections/home/SolutionFinder";
import { ContactPanel } from "@/components/sections/home/ContactPanel";
import { BackToTop } from "@/components/layout/BackToTop";
import { ogTitle, pageTitle, canonicalUrl } from "@/lib/seo";
import { getPage, getSection } from "@/lib/data/pages";
import { getPublishedIndustries } from "@/lib/data/industries";
import { getPublishedCaseStudies } from "@/lib/data/caseStudies";
import { getActiveCertifications } from "@/lib/data/certifications";
import { getPublishedTestimonials } from "@/lib/data/testimonials";
import { getSettings } from "@/lib/data/settings";
import type { GalleryCopy, HeroCopy, StatsCopy, TeaserCopy, TechnologyCopy } from "@/lib/types";

const FALLBACK_TITLE = "INFINI | Precision Surface-Finishing";
const FALLBACK_DESCRIPTION =
  "INFINI applies ISO 9001-certified MMP surface-finishing to components precision manufacturers already make, validated in-house, verified before it ships.";

/** Title/description/OG for the home page from `pages/home`'s seo map, shared by / and /blue. */
export async function homeMetadata(): Promise<Metadata> {
  const page = await getPage("home");
  const title = page?.seo.title ?? FALLBACK_TITLE;
  const description = page?.seo.description ?? FALLBACK_DESCRIPTION;
  return {
    title: pageTitle(title),
    description,
    alternates: { canonical: canonicalUrl("/") },
    openGraph: { title: ogTitle(title), description, type: "website" },
  };
}

/**
 * Home. Every section reads its copy from `pages/home` (with an in-code
 * fallback so the page never renders a hole) and its content from the
 * published collections. Section order is the argument the page makes:
 * what the finish does → find your application → who INFINI is → who trusts
 * the work → what we finish → how MMP works → who it's for → proof → voices →
 * the ask.
 *
 * Certifications and news are not repeated here; each has its own page.
 */
export async function HomePage() {
  const [page, industries, caseStudies, certifications, testimonials, settings] = await Promise.all([
    getPage("home"),
    getPublishedIndustries(),
    getPublishedCaseStudies(),
    getActiveCertifications(),
    getPublishedTestimonials(),
    getSettings(),
  ]);

  const hero = getSection<HeroCopy>(page, "hero");
  const gallery = getSection<GalleryCopy>(page, "gallery");
  const technology = getSection<TechnologyCopy>(page, "technology");
  const stats = getSection<StatsCopy>(page, "stats");
  const industriesTeaser = getSection<TeaserCopy>(page, "industriesTeaser");
  const caseStudiesTeaser = getSection<TeaserCopy>(page, "caseStudiesTeaser");
  const contactTeaser = getSection<TeaserCopy>(page, "contactTeaser");
  const testimonialsTeaser = getSection<TeaserCopy>(page, "testimonialsTeaser");

  return (
    <MotionProvider>
      <main className="min-h-screen bg-background">
        <HomeHero copy={hero} />

        {/* White run straight after the hero: find your industry and the counters,
            the joint venture, then the customers who trust the work. */}
        <SolutionFinder
          industries={industries}
          certificationsCount={certifications.length}
          facts={getSection<{ items: Array<{ value: number; label: string }> }>(page, "finder")?.items}
        />
        <PartnershipSection />
        <TrustSection className="pb-28 sm:pb-36" />

        <ComponentGallery copy={gallery} />
        <Ticker items={industries.map((industry) => industry.name)} />
        <ProcessSection copy={technology} />
        <BenefitsSection />
        <IndustriesIndex industries={industries} copy={industriesTeaser} />
        <ProofSection
          stats={stats}
          certifications={certifications}
          industriesCount={industries.length}
          showCertifications={false}
        />
        <ProvenWork copy={caseStudiesTeaser} caseStudies={caseStudies} industries={industries} />
        <Testimonials copy={testimonialsTeaser} testimonials={testimonials} />
        <ContactPanel
          copy={contactTeaser}
          contact={settings.contact}
          industries={industries}
        />
        <BackToTop />
      </main>
    </MotionProvider>
  );
}
