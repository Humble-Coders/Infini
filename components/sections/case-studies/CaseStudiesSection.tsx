import { Container } from "@/components/ui/container";
import type { CaseStudyDoc, TeaserCopy, WithId } from "@/lib/types";

export function CaseStudiesSection({ copy, caseStudies }: { copy: TeaserCopy; caseStudies: WithId<CaseStudyDoc>[] }) {
  return (
    <section className="relative border-t border-border/60 bg-background py-20 sm:py-28">
      <Container className="flex flex-col gap-10">
        <div className="flex max-w-2xl flex-col gap-4">
          <span className="text-xs font-medium tracking-[0.2em] text-accent uppercase">{copy.eyebrow}</span>
          <h2 className="text-2xl font-light text-foreground sm:text-3xl">{copy.heading}</h2>
        </div>

        {caseStudies.length === 0 ? (
          <div className="flex flex-col items-start gap-2 rounded-xl border border-dashed border-border px-6 py-10 sm:px-10">
            <p className="max-w-lg text-sm text-muted-foreground sm:text-base">{copy.emptyState}</p>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {caseStudies.map((caseStudy) => (
              <article key={caseStudy.slug} className="flex flex-col gap-3 rounded-xl border border-border p-6">
                <h3 className="text-lg font-normal text-foreground">{caseStudy.title}</h3>
                <p className="text-sm text-muted-foreground">{caseStudy.challenge}</p>
              </article>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
