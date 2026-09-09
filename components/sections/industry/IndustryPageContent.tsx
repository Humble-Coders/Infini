import Image from "next/image";
import { Container } from "@/components/ui/container";
import { Aurora } from "@/components/ui/aurora";
import { Reveal } from "@/components/ui/reveal";
import { BlurText } from "@/components/ui/blur-text";
import { TiltCard } from "@/components/ui/tilt-card";
import { MonoLabel } from "@/components/sections/home/MonoLabel";
import { Ticker } from "@/components/sections/home/Ticker";
import { CertificationsBlock } from "@/components/certifications/CertificationsBlock";
import { CaseStudyCard } from "@/components/case-studies/CaseStudyCard";
import { PageTail } from "@/components/sections/capability/PageTail";
import { IndustryIcon } from "@/lib/constants/industryIcons";
import type { CaseStudyDoc, CertificationDoc, IndustryDoc, WithId } from "@/lib/types";

/*
 * One industry page, told as an argument rather than as a taxonomy: why finish
 * matters in this sector, what MMP changes, the components and alloys it
 * applies to, the standards behind it, then the evidence.
 *
 * The eight industry pages deliberately share this one layout, because they are
 * a series and a reader moving between them should recognise the shape. What
 * varies is the content: each page's hero image, its own materials running in
 * the ticker, its own capability cards and its own certifications. The tilt
 * cards are used only here, so an industry page still reads as its own kind of
 * page next to the capability pages.
 */

const RELATED = [
  {
    label: "The MMP process",
    href: "/technology",
    description: "The mechanism behind the treatment, and why part form survives it.",
  },
  {
    label: "Validation",
    href: "/validation",
    description: "How a finish is proven on your component before it runs in series.",
  },
  {
    label: "All industries",
    href: "/industries",
    description: "Every sector INFINI treats components for.",
  },
];

export function IndustryPageContent({
  industry,
  certifications,
  caseStudies,
  siblings,
}: {
  industry: WithId<IndustryDoc>;
  certifications: WithId<CertificationDoc>[];
  caseStudies: WithId<CaseStudyDoc>[];
  siblings: WithId<IndustryDoc>[];
}) {
  const hasCerts = certifications.length > 0;
  const orderLabel = String(industry.order).padStart(2, "0");

  return (
    <main className="min-h-screen bg-background">
      {/* Dark opening: the sector, then its own alloys running past. */}
      <section className="relative isolate overflow-hidden bg-background">
        <div className="absolute inset-0 z-0">
          {industry.hero.image ? (
            <Image src={industry.hero.image} alt="" fill priority sizes="100vw" className="object-cover" />
          ) : (
            <Aurora />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/85 to-background/40" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/75 via-transparent to-transparent" />
        </div>

        <IndustryIcon
          slug={industry.slug}
          strokeWidth={0.45}
          aria-hidden="true"
          className="pointer-events-none absolute z-10 -right-12 -bottom-20 size-[24rem] text-foreground/[0.05] sm:size-[32rem]"
        />

        <Container className="relative z-10 flex min-h-[26rem] flex-col justify-end gap-6 py-14 sm:min-h-[30rem] sm:py-16 lg:min-h-[min(34rem,calc(100svh-5rem))]">
          <Reveal>
            <MonoLabel>
              {orderLabel} / {industry.hero.eyebrow}
            </MonoLabel>
          </Reveal>
          <Reveal delay={0.08}>
            <h1 className="max-w-3xl text-[clamp(2.25rem,5.6vw,4.25rem)] leading-[1.0] font-semibold tracking-[-0.045em] text-balance text-foreground">
              {industry.hero.headline}
            </h1>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="max-w-2xl text-base leading-relaxed text-pretty text-muted-foreground sm:text-lg">
              {industry.hero.subheadline}
            </p>
          </Reveal>
        </Container>
      </section>

      {industry.materials.length > 0 && <Ticker items={industry.materials} />}

      {/* Light run: the argument, then what MMP changes, on cards used only here. */}
      <section data-surface="light" className="bg-background py-24 sm:py-32">
        <Container className="grid gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-3 lg:pt-3">
            <MonoLabel>Why finish matters here</MonoLabel>
          </div>
          <div className="flex flex-col gap-10 lg:col-span-9">
            <h2 className="text-[clamp(1.75rem,4vw,3.5rem)] leading-[1.06] font-medium tracking-[-0.035em] text-balance text-foreground">
              <BlurText text={industry.overview} />
            </h2>
            <Reveal delay={0.12}>
              <p className="max-w-2xl text-base leading-relaxed text-pretty text-muted-foreground sm:text-lg">
                {industry.relevance}
              </p>
            </Reveal>
          </div>
        </Container>
      </section>

      {industry.capabilities.length > 0 && (
        <section data-surface="light" className="bg-background pb-24 sm:pb-32">
          <Container className="flex flex-col gap-10">
            <h2 className="max-w-xl text-[clamp(1.5rem,2.8vw,2.25rem)] leading-[1.1] font-semibold tracking-[-0.03em] text-balance text-foreground">
              What MMP changes on {industry.name.toLowerCase()} components
            </h2>
            <ol className="grid gap-6 md:grid-cols-3">
              {industry.capabilities.map((capability, index) => (
                <li key={capability.title}>
                  <Reveal delay={index * 0.08}>
                    <TiltCard className="h-full rounded-2xl border border-border bg-background-elevated p-6 sm:p-7">
                      <div className="flex h-full flex-col gap-3">
                        <span className="font-mono text-[11px] tracking-[0.2em] text-accent tabular-nums">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <h3 className="text-lg leading-[1.2] font-semibold tracking-[-0.02em] text-foreground">
                          {capability.title}
                        </h3>
                        <p className="text-sm leading-relaxed text-muted-foreground">{capability.description}</p>
                      </div>
                    </TiltCard>
                  </Reveal>
                </li>
              ))}
            </ol>
          </Container>
        </section>
      )}

      {/* Dark run: the parts and the alloys, as two indexes. */}
      <section className="bg-background py-24 sm:py-32">
        <Container className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="flex flex-col gap-6 lg:col-span-7">
            <MonoLabel as="h2">Components we treat</MonoLabel>
            <ul className="grid gap-x-10 border-t border-border sm:grid-cols-2">
              {industry.applications.map((item, index) => (
                <li
                  key={item}
                  className="flex items-baseline gap-4 border-b border-border py-4 text-base text-foreground"
                >
                  <span className="font-mono text-[10px] text-accent tabular-nums">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col gap-6 lg:col-span-4 lg:col-start-9">
            <MonoLabel as="h2">Materials</MonoLabel>
            <ul className="flex flex-col border-t border-border">
              {industry.materials.map((item) => (
                <li key={item} className="border-b border-border py-4 font-mono text-sm text-foreground">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      {hasCerts && (
        <section className="bg-background pb-24 sm:pb-28">
          <Container>
            <CertificationsBlock certifications={certifications} heading="Standards behind this work" />
          </Container>
        </section>
      )}

      {/* Light: the evidence. */}
      <section data-surface="light" className="bg-background py-24 sm:py-28">
        <Container className="flex flex-col gap-10">
          <MonoLabel as="h2">Evidence</MonoLabel>
          {caseStudies.length === 0 ? (
            <p className="max-w-2xl border border-dashed border-border px-6 py-10 text-base leading-relaxed text-muted-foreground sm:px-10">
              Case studies for {industry.name.toLowerCase()} are in progress. Send us a component and we will walk you
              through comparable work directly, with the measured result.
            </p>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {caseStudies.map((caseStudy) => (
                <CaseStudyCard key={caseStudy.slug} caseStudy={caseStudy} />
              ))}
            </div>
          )}
        </Container>
      </section>

      <PageTail industries={siblings} related={RELATED} surface="dark" />
    </main>
  );
}
