import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { PhotoHero } from "@/components/sections/shared/PhotoHero";
import { ProcessStrip } from "@/components/sections/shared/ProcessStrip";
import { MarqueeBand } from "@/components/sections/shared/MarqueeBand";
import { DetailRows } from "@/components/sections/shared/DetailRows";
import { HERO_IMAGERY } from "@/lib/constants/heroImagery";
import { cn } from "@/components/ui/utils";
import { getPublishedCaseStudies, getCaseStudiesByIndustry } from "@/lib/data/caseStudies";
import { getPublishedIndustries } from "@/lib/data/industries";
import { CaseStudyCard } from "@/components/case-studies/CaseStudyCard";
import { CaseStudyShowcaseLoader } from "@/components/case-studies/CaseStudyShowcaseLoader";


/*
 * ISR window. Without this the route re-renders and re-reads Firestore on
 * every request, so returning to a page costs the same round trips as
 * arriving the first time. Publishing should still revalidate the path for
 * an immediate update; this is the floor, not the mechanism.
 */
export const revalidate = 600;

const COPY = {
  eyebrow: "Proven work",
  heading: "Case studies.",
  body: "Real components, real results. Not a description of what INFINI could do, a record of what it did.",
};

/**
 * How a case study on this page comes to exist.
 *
 * Publishing results without saying how they were obtained is the thing that
 * makes a finishing claim unverifiable. This strip is the method, with the
 * timings a customer would plan around.
 */
const METHOD_STAGES = [
  {
    timing: "Day 1",
    step: "01",
    title: "Baseline the part",
    points: [
      "Roughness traced on the untreated component",
      "Ra, Rz and Rsk recorded per surface",
      "Critical dimensions measured and logged",
    ],
  },
  {
    timing: "Days 2 to 10",
    step: "02",
    title: "Trial the cycle",
    points: [
      "Media and chemistry matched to the alloy",
      "Cycle time varied across a sample set",
      "Geometry checked for edge and radius retention",
    ],
  },
  {
    timing: "Days 10 to 14",
    step: "03",
    title: "Validate against tolerance",
    points: [
      "Post-treatment trace on the same surfaces",
      "Dimensional conformance re-confirmed",
      "Results signed off with the customer",
    ],
  },
  {
    timing: "Ongoing",
    step: "04",
    title: "Release to production",
    points: [
      "Cycle fixed as a repeatable recipe",
      "Batch records kept per shipment",
      "Finish audited against the released baseline",
    ],
  },
];

/** What every dossier on this page is required to state. */
const DOSSIER_FIELDS = [
  {
    label: "Named alloy",
    detail: "The actual material, not a family. Inconel 718 behaves nothing like 17-4 PH under the same cycle.",
  },
  {
    label: "Before and after Ra",
    detail: "Both values from the same instrument on the same surface, so the delta means something.",
  },
  {
    label: "Geometry treated",
    detail: "Which faces, flanks or internal passages, because reach is the whole question.",
  },
  {
    label: "Cycle duration",
    detail: "How long the treatment ran, so the result can be priced rather than admired.",
  },
];

export const metadata: Metadata = {
  title: "Case Studies",
  description: COPY.body,
  openGraph: { title: "Case Studies | INFINI", description: COPY.body, type: "website" },
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
      <PhotoHero
        eyebrow={COPY.eyebrow}
        heading={COPY.heading}
        body={COPY.body}
        image={HERO_IMAGERY.caseStudies.src}
        imageAlt={HERO_IMAGERY.caseStudies.alt}
        priority
        badges={[{ label: "Measured results" }, { label: "Named alloys" }, { label: "Real components" }]}
        spec={{
          title: "Every result traced",
          body: "Before and after roughness on the same surface, on the same instrument, against the same drawing.",
        }}
      />

      <ProcessStrip
        eyebrow="Method"
        heading="How each of these results was obtained."
        body="Fourteen days from an untreated component to a signed-off cycle. The same sequence runs behind every dossier below."
        stages={METHOD_STAGES}
        surface="light"
      />

      <section className="bg-background py-16 sm:py-24">
        <Container className="flex flex-col gap-10">
          <div className="flex flex-col gap-6 border-b border-border pb-8">
            <div className="flex flex-col gap-5">
              <Eyebrow index={2}>Dossiers</Eyebrow>
              <h2 className="text-[clamp(1.6rem,3.2vw,2.5rem)] leading-[1.05] font-semibold tracking-[-0.04em] text-balance text-foreground">
                {activeIndustryName ? `${activeIndustryName} work.` : "Filter by industry."}
              </h2>
            </div>

            <nav aria-label="Filter by industry" className="flex flex-wrap gap-2">
              <Link
                href="/case-studies"
                className={cn(
                  "border px-4 py-2 font-mono text-[10px] tracking-[0.14em] uppercase transition-colors",
                  !industryFilter
                    ? "border-foreground bg-foreground text-background"
                    : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
                )}
              >
                All industries
              </Link>
              {industries.map((industry) => (
                <Link
                  key={industry.slug}
                  href={`/case-studies?industry=${industry.slug}`}
                  className={cn(
                    "border px-4 py-2 font-mono text-[10px] tracking-[0.14em] uppercase transition-colors",
                    industryFilter === industry.slug
                      ? "border-foreground bg-foreground text-background"
                      : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
                  )}
                >
                  {industry.name}
                </Link>
              ))}
            </nav>
          </div>

          {caseStudies.length === 0 ? (
            <div className="flex max-w-2xl flex-col gap-4">
              <p className="text-lg leading-relaxed text-foreground">
                {activeIndustryName
                  ? `No ${activeIndustryName} dossier is published yet.`
                  : "The first dossiers are being prepared for publication."}
              </p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                The trial work behind them is running now. Until a dossier clears customer sign-off it stays unpublished,
                because a result nobody has agreed to is not evidence.
              </p>
            </div>
          ) : (
            <>
              {/* Sticky scroll showcase: pinned left text + scrolling imagery */}
              <CaseStudyShowcaseLoader caseStudies={caseStudies} industryNameById={industryNameById} />

              <div className="flex items-center gap-4 pt-6">
                <span className="h-px flex-1 bg-border" />
                <span className="font-mono text-[10px] tracking-[0.18em] tabular-nums text-muted-foreground uppercase">
                  All {caseStudies.length} dossiers
                </span>
                <span className="h-px flex-1 bg-border" />
              </div>

              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {caseStudies.map((caseStudy) => (
                  <CaseStudyCard
                    key={caseStudy.slug}
                    caseStudy={caseStudy}
                    industryName={industryNameById.get(caseStudy.industryId)}
                  />
                ))}
              </div>
            </>
          )}
        </Container>
      </section>

      <MarqueeBand text={["Traced", "Treated", "Traced again", "Signed off"]} />

      <DetailRows
        eyebrow="Dossier fields"
        heading="What every entry has to state."
        body="A case study that omits any of these four is a testimonial, not evidence. These are the fields we hold ourselves to."
        rows={DOSSIER_FIELDS}
        surface="light"
        image={HERO_IMAGERY.caseStudies.src}
        imageAlt={HERO_IMAGERY.caseStudies.alt}
        imageLabel="Before / after"
      />
    </main>
  );
}
