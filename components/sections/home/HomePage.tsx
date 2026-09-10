import type { Metadata } from "next";
import { ExhibitionBanner } from "@/components/sections/home/ExhibitionBanner";
import { ComponentGallery } from "@/components/sections/home/ComponentGallery";
import { PartnershipSection } from "@/components/sections/home/PartnershipSection";
import { HomeHero } from "@/components/sections/home/HomeHero";
import { TrustSection } from "@/components/sections/home/TrustSection";
import { IndustriesIndex } from "@/components/sections/home/IndustriesIndex";
import { MotionProvider } from "@/components/sections/home/MotionProvider";
import { NewsIndex } from "@/components/sections/home/NewsIndex";
import { ProcessSection } from "@/components/sections/home/ProcessSection";
import { BenefitsSection } from "@/components/sections/home/BenefitsSection";
import { ProofSection } from "@/components/sections/home/ProofSection";
import { ProvenWork } from "@/components/sections/home/ProvenWork";
import { Statement } from "@/components/sections/home/Statement";
import { Testimonials } from "@/components/sections/home/Testimonials";
import { Ticker } from "@/components/sections/home/Ticker";
import { SolutionFinder } from "@/components/sections/home/SolutionFinder";
import { ContactPanel } from "@/components/sections/home/ContactPanel";
import { BackToTop } from "@/components/layout/BackToTop";
import { ogTitle, pageTitle } from "@/lib/seo";
import { getPage, getSection } from "@/lib/data/pages";
import { getPublishedIndustries } from "@/lib/data/industries";
import { getPublishedCaseStudies } from "@/lib/data/caseStudies";
import { getActiveCertifications } from "@/lib/data/certifications";
import { getPublishedTestimonials } from "@/lib/data/testimonials";
import { getPublishedNews } from "@/lib/data/news";
import { getSettings } from "@/lib/data/settings";
import { DEMO_CASE_STUDIES } from "@/lib/demo/caseStudies";
import { DEMO_TESTIMONIALS } from "@/lib/demo/testimonials";
import type { GalleryCopy, HeroCopy, StatementCopy, StatsCopy, TeaserCopy, TechnologyCopy } from "@/lib/types";

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
    openGraph: { title: ogTitle(title), description, type: "website" },
  };
}

/**
 * Home. Every section reads its copy from `pages/home` (with an in-code
 * fallback so the page never renders a hole) and its content from the
 * published collections. Section order is the argument the page makes:
 * what the finish does → what we finish → what INFINI is → how MMP works → who it's for →
 * why to believe it → proof → voices → trusted-by logo band → news → the ask.
 */
export async function HomePage() {
  const [page, industries, caseStudies, certifications, testimonials, news, settings] = await Promise.all([
    getPage("home"),
    getPublishedIndustries(),
    getPublishedCaseStudies(),
    getActiveCertifications(),
    getPublishedTestimonials(),
    getPublishedNews(),
    getSettings(),
  ]);

  const hero = getSection<HeroCopy>(page, "hero");
  const gallery = getSection<GalleryCopy>(page, "gallery");
  const statement = getSection<StatementCopy>(page, "statement");
  const technology = getSection<TechnologyCopy>(page, "technology");
  const stats = getSection<StatsCopy>(page, "stats");
  const industriesTeaser = getSection<TeaserCopy>(page, "industriesTeaser");
  const caseStudiesTeaser = getSection<TeaserCopy>(page, "caseStudiesTeaser");
  const newsTeaser = getSection<TeaserCopy>(page, "newsTeaser");
  const contactTeaser = getSection<TeaserCopy>(page, "contactTeaser");

  // Demo quotes while the testimonials collection is empty; real documents win.
  const voices = testimonials.length > 0 ? testimonials : DEMO_TESTIMONIALS;

  return (
    <MotionProvider>
      <main className="min-h-screen bg-background">
        <ExhibitionBanner />
        <HomeHero copy={hero} />
        <SolutionFinder industries={industries} />
        <ComponentGallery copy={gallery} />
        <PartnershipSection />
        <Ticker items={industries.map((industry) => industry.name)} />
        <Statement copy={statement} />
        <ProcessSection copy={technology} />
        <BenefitsSection />
        <IndustriesIndex industries={industries} copy={industriesTeaser} />
        <ProofSection stats={stats} certifications={certifications} industriesCount={industries.length} />
        {/* Demo studies stand in until the collection is seeded. Their slugs have no
            Firestore document, so the cards must not link to a detail page. */}
        <ProvenWork
          copy={caseStudiesTeaser}
          caseStudies={caseStudies.length > 0 ? caseStudies : DEMO_CASE_STUDIES}
          industries={industries}
          linkToDetail={caseStudies.length > 0}
        />
        <TrustSection />
        <NewsIndex copy={newsTeaser} news={news} />
        <Testimonials copy={null} testimonials={voices} />
        <ContactPanel
          copy={contactTeaser}
          contact={settings?.contact ?? null}
          industries={industries}
        />
        <BackToTop />
      </main>
    </MotionProvider>
  );
}
