import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { BlurText } from "@/components/ui/blur-text";
import { MonoLabel } from "@/components/sections/home/MonoLabel";
import { Ticker } from "@/components/sections/home/Ticker";
import { TrustSection } from "@/components/sections/home/TrustSection";
import { PhotoHero } from "@/components/sections/shared/PhotoHero";
import { HERO_IMAGERY } from "@/lib/constants/heroImagery";
import { IndustriesBentoGrid } from "@/components/sections/industries/IndustriesBentoGrid";
import { getPublishedIndustries } from "@/lib/data/industries";
import { ogTitle, pageTitle } from "@/lib/seo";


/*
 * ISR window. Without this the route re-renders and re-reads Firestore on
 * every request, so returning to a page costs the same round trips as
 * arriving the first time. Publishing should still revalidate the path for
 * an immediate update; this is the floor, not the mechanism.
 */
export const revalidate = 600;

const COPY = {
  eyebrow: "Markets we serve",
  heading: "One controlled process. Every surface it has to answer to.",
  body: "Each sector below brings its own failure mode, its own alloys and its own standards. The pages reflect what actually matters for that application rather than a generic template with the name swapped.",
};

export const metadata: Metadata = {
  title: pageTitle("Industries We Serve"),
  description: COPY.body,
  openGraph: { title: ogTitle("Industries We Serve"), description: COPY.body, type: "website" },
};

export default async function IndustriesIndexPage() {
  const industries = await getPublishedIndustries();

  // Every count on this page is derived, so adding a ninth industry needs no
  // copy edit. The previous version hardcoded "Seven" and was already wrong.
  const materials = [...new Set(industries.flatMap((industry) => industry.materials))];
  const applicationCount = industries.reduce((total, industry) => total + industry.applications.length, 0);

  return (
    <main className="min-h-screen bg-background">
      <PhotoHero
        eyebrow={COPY.eyebrow}
        heading={COPY.heading}
        body={COPY.body}
        image={HERO_IMAGERY.industries.src}
        imageAlt={HERO_IMAGERY.industries.alt}
        badges={[
          { label: `${industries.length} sectors` },
          { label: `${applicationCount}+ component types` },
          { label: `${materials.length}+ alloy families` },
        ]}
      />

      <Ticker items={industries.map((industry) => industry.name)} />

      <section className="bg-background py-20 sm:py-24">
        <Container>
          <IndustriesBentoGrid industries={industries} />
        </Container>
      </section>

      <section data-surface="light" className="bg-background py-24 sm:py-32">
        <Container className="grid gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-3 lg:pt-3">
            <MonoLabel>The common thread</MonoLabel>
          </div>
          <div className="flex flex-col gap-8 lg:col-span-9">
            <h2 className="text-[clamp(1.75rem,4vw,3.25rem)] leading-[1.06] font-medium tracking-[-0.035em] text-balance text-foreground">
              <BlurText text="Different sectors, the same physics. Roughness is where parts fail." />
            </h2>
            <Reveal delay={0.12}>
              <p className="max-w-2xl text-base leading-relaxed text-pretty text-muted-foreground sm:text-lg">
                A turbine blade, a knee implant and an injection mould have almost nothing in common until you look at
                the surface. In each one the peaks left by machining are where fatigue starts, where lubricant escapes,
                where contaminant sits. MMP removes those peaks without touching the geometry, which is why one process
                answers to all {industries.length} of these sectors.
              </p>
            </Reveal>
          </div>
        </Container>
      </section>

      <TrustSection />
    </main>
  );
}
