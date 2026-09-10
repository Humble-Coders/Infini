import Image from "next/image";
import { Container } from "@/components/ui/container";
import { Aurora } from "@/components/ui/aurora";
import { Reveal } from "@/components/ui/reveal";
import { BlurText } from "@/components/ui/blur-text";
import { MonoLabel } from "@/components/sections/home/MonoLabel";
import { Ticker } from "@/components/sections/home/Ticker";
import { CertificationsBlock } from "@/components/certifications/CertificationsBlock";
import { CaseStudyCard } from "@/components/case-studies/CaseStudyCard";
import { PageTail } from "@/components/sections/capability/PageTail";
import { IndustryIcon } from "@/lib/constants/industryIcons";
import type { CaseStudyDoc, CertificationDoc, IndustryDoc, WithId } from "@/lib/types";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";

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

// Helper to get a relevant Unsplash image for a component/application name
function getApplicationImage(appName: string, index: number) {
  // Using a seeded approach based on the index to get consistent professional industrial photos
  const seeds = [
    "photo-1581091226825-a6a2a5aee158", // precision part
    "photo-1530124566582-a618bc2615dc", // engineering
    "photo-1611117775350-ac3950990985", // powder metallurgy
    "photo-1504328345606-18bbc8c9d7d1", // forging
    "photo-1533090368676-1fd25485db88", // machinery
    "photo-1581092335397-9583eb92d232", // industrial setting
  ];
  const seed = seeds[index % seeds.length];
  return `https://images.unsplash.com/${seed}?q=80&w=800&auto=format&fit=crop`;
}

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
      {/* Dark opening: the sector */}
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

        <Container className="relative z-10 flex min-h-[20rem] flex-col justify-center gap-6 pt-24 pb-16 sm:min-h-[24rem] sm:pt-28">
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
            <p className="max-w-2xl text-base leading-relaxed text-pretty text-muted-foreground sm:text-lg border-l-2 border-accent pl-4">
              {industry.hero.subheadline}
            </p>
          </Reveal>
        </Container>
      </section>

      {/* The argument */}
      <section data-surface="light" className="bg-background py-20 sm:py-28">
        <Container className="grid gap-12 lg:grid-cols-12 lg:gap-16 items-start">
          <div className="lg:col-span-4 lg:pt-2">
            <MonoLabel>MMP Technology®</MonoLabel>
            <Reveal delay={0.1}>
              <h2 className="mt-4 text-2xl font-semibold text-foreground sm:text-3xl">
                The Engineering Standard
              </h2>
            </Reveal>
          </div>
          <div className="flex flex-col gap-8 lg:col-span-8">
            <h3 className="text-[clamp(1.5rem,3vw,2.25rem)] leading-[1.2] font-medium tracking-[-0.02em] text-foreground">
              <BlurText text={industry.overview} />
            </h3>
            <Reveal delay={0.12}>
              <div className="relative pl-6 before:absolute before:inset-y-0 before:left-0 before:w-1 before:bg-accent/50 before:rounded-full">
                <p className="text-base leading-relaxed text-foreground/80 sm:text-lg">
                  {industry.relevance}
                </p>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Capabilities / Added Values - Redesigned to be more editorial */}
      {industry.capabilities.length > 0 && (
        <section data-surface="light" className="bg-background py-24 sm:py-32 border-y border-border">
          <Container className="flex flex-col gap-14">
            <div className="flex flex-col gap-4">
              <MonoLabel>Technical Benefits</MonoLabel>
              <h2 className="max-w-2xl text-[clamp(2rem,3vw,2.75rem)] leading-[1.1] font-semibold tracking-[-0.03em] text-balance text-foreground">
                Selective Roughness Profile for Better Properties
              </h2>
            </div>
            
            <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
              {industry.capabilities.map((capability, index) => (
                <Reveal key={capability.title} delay={index * 0.08} className="flex flex-col gap-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="size-6 text-accent shrink-0 mt-0.5" />
                    <h3 className="text-xl leading-[1.2] font-semibold tracking-[-0.02em] text-foreground">
                      {capability.title}
                    </h3>
                  </div>
                  <p className="text-base leading-relaxed text-muted-foreground pl-9">
                    {capability.description}
                  </p>
                </Reveal>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Components we treat - Redesigned as an image grid */}
      <section className="bg-background py-24 sm:py-32">
        <Container className="flex flex-col gap-12">
          <div className="flex flex-col gap-4">
            <MonoLabel>Component Types</MonoLabel>
            <h2 className="text-[clamp(2rem,3vw,2.75rem)] leading-[1.1] font-semibold tracking-[-0.03em] text-balance text-foreground">
              What we treat in {industry.name}
            </h2>
          </div>
          
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {industry.applications.map((item, index) => (
              <Reveal key={item} delay={index * 0.1}>
                <div className="group relative flex h-64 flex-col justify-end overflow-hidden rounded-xl border border-border bg-black/40 p-6 sm:h-80">
                  <Image
                    src={getApplicationImage(item, index)}
                    alt={item}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="absolute inset-0 -z-10 object-cover opacity-60 transition-transform duration-700 group-hover:scale-105 group-hover:opacity-80"
                  />
                  <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-lg font-medium text-white sm:text-xl text-balance">
                      {item}
                    </span>
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition-colors group-hover:bg-accent group-hover:text-white">
                      <ArrowUpRight className="size-4" />
                    </span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {industry.materials.length > 0 && (
            <div className="mt-16 flex flex-col gap-8 rounded-3xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent p-8 shadow-2xl backdrop-blur-sm sm:p-12 relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(var(--color-primary-rgb),0.15),transparent_50%)]" />
              <div className="relative z-10 flex flex-col gap-3">
                <MonoLabel>Compatible Materials & Alloys</MonoLabel>
                <p className="text-sm text-muted-foreground max-w-lg">
                  MMP Technology® adapts dynamically to the metallurgical properties of each alloy, achieving optimal roughness reduction without altering the base material's integrity.
                </p>
              </div>
              <ul className="relative z-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {industry.materials.map((item, i) => (
                  <li key={item} className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/40 px-5 py-4 backdrop-blur-md transition-colors hover:border-accent/50 hover:bg-accent/5">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white/5 text-xs font-mono text-accent">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="text-sm font-medium text-foreground/90">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Container>
      </section>

      {hasCerts && (
        <section className="bg-background pb-24 sm:pb-28">
          <Container>
            <CertificationsBlock certifications={certifications} heading="Standards behind this work" />
          </Container>
        </section>
      )}

      {/* Evidence */}
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
