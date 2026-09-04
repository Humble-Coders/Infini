import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import type { CaseStudyDoc, IndustryDoc, TeaserCopy, WithId } from "@/lib/types";
import { CaseStudiesRail, type CaseStudyCardData } from "./CaseStudiesRail";
import { EmphasisHeading } from "./EmphasisHeading";
import { MonoLabel } from "./MonoLabel";

const FALLBACK: TeaserCopy = {
  eyebrow: "Proven work",
  heading: "Case studies\nthat prove impact.",
  body: "Real engineering challenges. Measurable results across the industries we serve.",
  emptyState:
    "We're publishing our first case studies shortly. In the meantime, tell us about your components and we'll walk you through comparable work directly.",
};

function industryLabel(industryId: string, industries: WithId<IndustryDoc>[]) {
  const match = industries.find((industry) => industry.id === industryId || industry.slug === industryId);
  if (match) return match.name;
  return industryId.replace(/[-_]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Server wrapper: strips the non-serialisable fields (`seo`, `publishedAt`) and
 * resolves industry names before handing plain card data to the client rail.
 */
export function ProvenWork({
  copy,
  caseStudies,
  industries,
}: {
  copy: TeaserCopy | null;
  caseStudies: WithId<CaseStudyDoc>[];
  industries: WithId<IndustryDoc>[];
}) {
  const { eyebrow, heading, body, emptyState } = { ...FALLBACK, ...(copy ?? {}) };

  const items: CaseStudyCardData[] = caseStudies.map((caseStudy) => ({
    id: caseStudy.id,
    slug: caseStudy.slug,
    title: caseStudy.title,
    industry: industryLabel(caseStudy.industryId, industries),
    challenge: caseStudy.challenge,
    results: caseStudy.results ?? [],
    specs: {
      material: caseStudy.specs?.material ?? "",
      process: caseStudy.specs?.process ?? "",
      duration: caseStudy.specs?.duration ?? "",
    },
  }));

  return (
    <section data-surface="light" className="overflow-hidden bg-background py-24 sm:py-32">
      <Container className="flex flex-col gap-12 lg:gap-16">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="flex flex-col gap-6 lg:col-span-6">
            <MonoLabel>{eyebrow}</MonoLabel>
            <h2 className="text-[clamp(2.25rem,5vw,4.5rem)] leading-[0.98] font-semibold tracking-[-0.04em] text-balance text-foreground">
              <EmphasisHeading text={heading} />
            </h2>
          </div>
          <div className="flex flex-col items-start gap-6 self-end lg:col-span-5 lg:col-start-8">
            {body && <p className="max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">{body}</p>}
            <Link
              href="/case-studies"
              className="group inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.22em] text-foreground uppercase transition-colors hover:text-accent"
            >
              All case studies
              <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
            </Link>
          </div>
        </div>

        {items.length === 0 ? (
          <p className="max-w-2xl rounded-2xl border border-dashed border-border px-6 py-10 text-sm leading-relaxed text-muted-foreground sm:px-10 sm:text-base">
            {emptyState}
          </p>
        ) : (
          <CaseStudiesRail items={items} />
        )}
      </Container>
    </section>
  );
}
