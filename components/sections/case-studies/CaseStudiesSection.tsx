import { Container } from "@/components/ui/container";
import { CaseStudyCard } from "@/components/case-studies/CaseStudyCard";
import { SectionBackground } from "@/components/sections/shared/SectionBackground";
import { SectionEyebrow } from "@/components/sections/shared/SectionEyebrow";
import type { CaseStudyDoc, TeaserCopy, WithId } from "@/lib/types";

export function CaseStudiesSection({ copy, caseStudies }: { copy: TeaserCopy; caseStudies: WithId<CaseStudyDoc>[] }) {
  return (
    <section className="relative overflow-hidden border-t border-border/60 bg-background py-20 sm:py-28">
      <SectionBackground grid />
      <Container className="relative flex flex-col gap-10">
        <div className="flex max-w-2xl flex-col gap-4">
          <SectionEyebrow>{copy.eyebrow}</SectionEyebrow>
          <h2 className="text-2xl font-light text-foreground sm:text-3xl">{copy.heading}</h2>
        </div>

        {caseStudies.length === 0 ? (
          <div className="flex flex-col items-start gap-2 rounded-xl border border-dashed border-border px-6 py-10 sm:px-10">
            <p className="max-w-lg text-sm text-muted-foreground sm:text-base">{copy.emptyState}</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {caseStudies.map((caseStudy) => (
              <CaseStudyCard key={caseStudy.slug} caseStudy={caseStudy} />
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
