import { Container } from "@/components/ui/container";
import { SectionBackground } from "@/components/sections/shared/SectionBackground";
import { CaseStudiesIntro } from "./CaseStudiesIntro";
import { CaseStudiesDossier } from "./CaseStudiesDossier";
import type { CaseStudyDoc, TeaserCopy, WithId } from "@/lib/types";

/**
 * "Proven work" — one large featured case study that swaps in place as the
 * visitor browses an editorial nav list, rather than a card grid. Content is
 * whatever `caseStudies` the caller passes (Firestore-backed or demo data);
 * the UI makes no assumptions beyond the `CaseStudyDoc` shape.
 *
 * Server component: `seo` and `publishedAt` (a Firestore timestamp carrying a
 * `toDate` function) never cross into the client dossier below — only the
 * plain, serializable fields the UI actually renders do.
 */
export function CaseStudiesSection({ copy, caseStudies }: { copy: TeaserCopy; caseStudies: WithId<CaseStudyDoc>[] }) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- destructuring strips the two non-serializable fields before crossing the client boundary
  const dossierData = caseStudies.map(({ seo, publishedAt, ...caseStudy }) => caseStudy);

  return (
    <section className="relative overflow-hidden border-t border-border/60 bg-background py-14 sm:py-20 lg:py-28">
      <SectionBackground grid />
      <Container className="relative flex flex-col gap-8 sm:gap-12 lg:gap-16">
        <CaseStudiesIntro eyebrow={copy.eyebrow} heading={copy.heading} body={copy.body} />

        {caseStudies.length === 0 ? (
          <div className="flex flex-col items-start gap-2 rounded-xl border border-dashed border-border px-6 py-10 sm:px-10">
            <p className="max-w-lg text-sm text-muted-foreground sm:text-base">{copy.emptyState}</p>
          </div>
        ) : (
          <CaseStudiesDossier caseStudies={dossierData} />
        )}
      </Container>
    </section>
  );
}
