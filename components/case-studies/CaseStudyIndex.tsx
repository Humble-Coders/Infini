"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Eyebrow } from "@/components/ui/eyebrow";
import { cn } from "@/components/ui/utils";
import { CaseStudyCard, type ClientCaseStudy } from "@/components/case-studies/CaseStudyCard";
import { CaseStudyShowcase } from "@/components/case-studies/CaseStudyShowcase";

export interface IndustryOption {
  id: string;
  slug: string;
  name: string;
}

interface CaseStudyIndexProps {
  caseStudies: ClientCaseStudy[];
  industries: IndustryOption[];
}

const FILTER_CLASS = "border px-4 py-2 font-mono text-[10px] tracking-[0.14em] uppercase transition-colors";
const FILTER_ON = "border-foreground bg-foreground text-background";
const FILTER_OFF = "border-border text-muted-foreground hover:border-foreground hover:text-foreground";

/**
 * The dossier list with its industry filter. The page itself is static: the
 * server HTML always carries the full list (the Suspense fallback), and the
 * `?industry=` filter is applied in the browser, so filtering never turns the
 * route into a per-request render.
 */
export function CaseStudyIndexView({ caseStudies, industries, filter }: CaseStudyIndexProps & { filter: string | null }) {
  const industryNameById = new Map<string, string | undefined>();
  for (const industry of industries) {
    industryNameById.set(industry.id, industry.name);
    industryNameById.set(industry.slug, industry.name);
  }
  const active = filter ? industries.find((i) => i.slug === filter) : undefined;
  const shown = active
    ? caseStudies.filter((cs) => cs.industryId === active.id || cs.industryId === active.slug)
    : caseStudies;

  return (
    <>
      <div className="flex flex-col gap-6 border-b border-border pb-8">
        <div className="flex flex-col gap-5">
          <Eyebrow index={2}>Dossiers</Eyebrow>
          <h2 className="text-[clamp(1.6rem,3.2vw,2.5rem)] leading-[1.05] font-semibold tracking-[-0.04em] text-balance text-foreground">
            {active ? `${active.name} work.` : "Filter by industry."}
          </h2>
        </div>

        <nav aria-label="Filter by industry" className="flex flex-wrap gap-2">
          <Link href="/case-studies" scroll={false} className={cn(FILTER_CLASS, !active ? FILTER_ON : FILTER_OFF)}>
            All industries
          </Link>
          {industries.map((industry) => (
            <Link
              key={industry.slug}
              href={`/case-studies?industry=${industry.slug}`}
              scroll={false}
              className={cn(FILTER_CLASS, active?.slug === industry.slug ? FILTER_ON : FILTER_OFF)}
            >
              {industry.name}
            </Link>
          ))}
        </nav>
      </div>

      {shown.length === 0 ? (
        <div className="flex max-w-2xl flex-col gap-4">
          <p className="text-lg leading-relaxed text-foreground">
            {active ? `No ${active.name} dossier is published yet.` : "The first dossiers are being prepared for publication."}
          </p>
          <p className="text-sm leading-relaxed text-muted-foreground">
            The trial work behind them is running now. Until a dossier clears customer sign-off it stays unpublished,
            because a result nobody has agreed to is not evidence.
          </p>
        </div>
      ) : (
        <>
          {/* Sticky scroll showcase (desktop only): pinned left text + scrolling imagery */}
          <CaseStudyShowcase caseStudies={shown} industryNameById={industryNameById} />

          <div className="flex items-center gap-4 pt-6">
            <span className="h-px flex-1 bg-border" />
            <span className="font-mono text-[10px] tracking-[0.18em] tabular-nums text-muted-foreground uppercase">
              All {shown.length} dossiers
            </span>
            <span className="h-px flex-1 bg-border" />
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {shown.map((caseStudy) => (
              <CaseStudyCard
                key={caseStudy.slug}
                caseStudy={caseStudy}
                industryName={industryNameById.get(caseStudy.industryId)}
              />
            ))}
          </div>
        </>
      )}
    </>
  );
}

export function CaseStudyIndex(props: CaseStudyIndexProps) {
  const filter = useSearchParams().get("industry");
  return <CaseStudyIndexView {...props} filter={filter} />;
}
