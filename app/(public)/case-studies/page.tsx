import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { cn } from "@/components/ui/utils";
import { getPublishedCaseStudies, getCaseStudiesByIndustry } from "@/lib/data/caseStudies";
import { getPublishedIndustries } from "@/lib/data/industries";
import { CaseStudyCard } from "@/components/case-studies/CaseStudyCard";

const COPY = {
  eyebrow: "Proven Work",
  heading: "Case studies.",
  body: "Real components, real results — not a description of what INFINI could do, a record of what it did.",
};

export const metadata: Metadata = {
  title: "Case Studies",
  description: COPY.body,
  openGraph: { title: "Case Studies — INFINI", description: COPY.body, type: "website" },
};

export default async function CaseStudiesIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ industry?: string }>;
}) {
  const { industry: industryFilter } = await searchParams;
  const industries = await getPublishedIndustries();
  const caseStudies = industryFilter
    ? await getCaseStudiesByIndustry(industryFilter)
    : await getPublishedCaseStudies();

  const industryNameById = new Map(industries.map((i) => [i.id, i.name]));
  const activeIndustryName = industryFilter ? industryNameById.get(industryFilter) : undefined;

  return (
    <main className="min-h-screen bg-background">
      <section className="border-b border-border/60 py-20 sm:py-28">
        <Container className="flex flex-col gap-4">
          <span className="text-xs font-medium tracking-[0.2em] text-accent uppercase">{COPY.eyebrow}</span>
          <h1 className="max-w-2xl text-[clamp(2.25rem,5vw,3.5rem)] leading-[1.05] font-light tracking-[-0.02em] text-foreground">
            {COPY.heading}
          </h1>
          <p className="max-w-xl text-sm text-muted-foreground sm:text-base">{COPY.body}</p>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container className="flex flex-col gap-10">
          <nav aria-label="Filter by industry" className="flex flex-wrap gap-2">
            <Link
              href="/case-studies"
              className={cn(
                "rounded-full border px-4 py-2 text-sm transition-colors",
                !industryFilter ? "border-primary text-primary" : "border-border text-muted-foreground hover:text-foreground"
              )}
            >
              All industries
            </Link>
            {industries.map((industry) => (
              <Link
                key={industry.slug}
                href={`/case-studies?industry=${industry.slug}`}
                className={cn(
                  "rounded-full border px-4 py-2 text-sm transition-colors",
                  industryFilter === industry.slug
                    ? "border-primary text-primary"
                    : "border-border text-muted-foreground hover:text-foreground"
                )}
              >
                {industry.name}
              </Link>
            ))}
          </nav>

          {caseStudies.length === 0 ? (
            <div className="flex flex-col items-start gap-2 rounded-xl border border-dashed border-border px-6 py-10 sm:px-10">
              <p className="max-w-lg text-sm text-muted-foreground sm:text-base">
                {activeIndustryName
                  ? `Case studies for ${activeIndustryName} are in progress. Tell us about your components and we'll walk you through comparable work directly.`
                  : "We're publishing our first case studies shortly. In the meantime, tell us about your components and we'll walk you through comparable work directly."}
              </p>
            </div>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {caseStudies.map((caseStudy) => (
                <CaseStudyCard key={caseStudy.slug} caseStudy={caseStudy} industryName={industryNameById.get(caseStudy.industryId)} />
              ))}
            </div>
          )}
        </Container>
      </section>
    </main>
  );
}
