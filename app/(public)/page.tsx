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

const TITLE = "INFINI — Precision Surface-Finishing";
const DESCRIPTION =
  "INFINI applies ISO 9001-certified MMP surface-finishing to components precision manufacturers already make — validated in-house, verified before it ships.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "website",
  },
};

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Hero />
      <TechnologySection />
      <IndustriesSection />
      <StatsSection />
      <CaseStudiesSection />
      <TestimonialsSection />
      <NewsSection />
      <ClosingCta />
      <ContactSection />
    </main>
  );
}
