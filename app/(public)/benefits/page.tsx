import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { TiltCard } from "@/components/ui/tilt-card";
import { MonoLabel } from "@/components/sections/home/MonoLabel";
import { PhotoHero } from "@/components/sections/shared/PhotoHero";
import { HERO_IMAGERY } from "@/lib/constants/heroImagery";
import { TrustSection } from "@/components/sections/home/TrustSection";
import { getPublishedBenefits } from "@/lib/data/benefits";
import { ogTitle, pageTitle } from "@/lib/seo";


/*
 * ISR window. Without this the route re-renders and re-reads Firestore on
 * every request, so returning to a page costs the same round trips as
 * arriving the first time. Publishing should still revalidate the path for
 * an immediate update; this is the floor, not the mechanism.
 */
export const revalidate = 600;

const COPY = {
  eyebrow: "What MMP changes",
  heading: "Named after the failure, not after the process.",
  body: "Each page below starts with how a component actually fails, in the terms an engineer would use, and only then explains what the treatment changes about it.",
};

export const metadata: Metadata = {
  title: pageTitle("What MMP Changes"),
  description: COPY.body,
  openGraph: { title: ogTitle("What MMP Changes"), description: COPY.body, type: "website" },
};

export default async function BenefitsIndexPage() {
  const benefits = await getPublishedBenefits();

  return (
    <main className="min-h-screen bg-background">
      <PhotoHero
        eyebrow={COPY.eyebrow}
        heading={COPY.heading}
        body={COPY.body}
        stats={[{ label: "Failure modes covered", value: String(benefits.length) }]}
        image={HERO_IMAGERY.benefits.src}
        imageAlt={HERO_IMAGERY.benefits.alt}
      />

      <section data-surface="light" className="bg-background py-24 sm:py-32">
        <Container className="flex flex-col gap-10">
          <MonoLabel as="h2">Pick the one you are seeing</MonoLabel>
          {benefits.length === 0 ? (
            <p className="max-w-2xl border border-dashed border-border px-6 py-10 text-base leading-relaxed text-muted-foreground sm:px-10">
              These pages are being published shortly. In the meantime, tell us what your components are doing and our
              engineers will walk you through comparable work.
            </p>
          ) : (
            <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {benefits.map((benefit, index) => (
                <li key={benefit.id}>
                  <Reveal delay={index * 0.06}>
                    <Link
                      href={`/benefits/${benefit.slug}`}
                      className="group block h-full focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                    >
                      <TiltCard className="h-full rounded-2xl border border-border bg-background-elevated p-6 sm:p-7">
                        <div className="flex h-full flex-col gap-3">
                          <span className="font-mono text-[11px] tracking-[0.2em] text-accent tabular-nums">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <h3 className="flex items-center justify-between gap-4 text-lg leading-[1.2] font-semibold tracking-[-0.02em] text-foreground">
                            {benefit.name}
                            <ArrowUpRight
                              className="size-4 shrink-0 text-accent transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                              aria-hidden="true"
                            />
                          </h3>
                          <p className="text-sm leading-relaxed text-muted-foreground">{benefit.summary}</p>
                        </div>
                      </TiltCard>
                    </Link>
                  </Reveal>
                </li>
              ))}
            </ul>
          )}
        </Container>
      </section>

      <TrustSection />
    </main>
  );
}
