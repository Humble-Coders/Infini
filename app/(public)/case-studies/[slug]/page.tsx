import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Container } from "@/components/ui/container";
import { getCaseStudyBySlug, getPublishedCaseStudySlugs } from "@/lib/data/caseStudies";
import { getIndustryById } from "@/lib/data/industries";
import { BeforeAfterComparison } from "@/components/case-studies/BeforeAfterComparison";
import { ogTitle, pageTitle } from "@/lib/seo";


/*
 * ISR window. Without this the route re-renders and re-reads Firestore on
 * every request, so returning to a page costs the same round trips as
 * arriving the first time. Publishing should still revalidate the path for
 * an immediate update; this is the floor, not the mechanism.
 */
export const revalidate = 600;

export async function generateStaticParams() {
  const slugs = await getPublishedCaseStudySlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const caseStudy = await getCaseStudyBySlug(slug);
  if (!caseStudy) return {};

  return {
    title: pageTitle(caseStudy.seo.title),
    description: caseStudy.seo.description,
    openGraph: {
      title: ogTitle(caseStudy.seo.title),
      description: caseStudy.seo.description,
      type: "article",
    },
  };
}

export default async function CaseStudyDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const caseStudy = await getCaseStudyBySlug(slug);
  if (!caseStudy) notFound();

  const industry = await getIndustryById(caseStudy.industryId);
  const specEntries = Object.entries(caseStudy.specs).filter(([, value]) => value);

  return (
    <main className="min-h-screen bg-background">
      <section className="border-b border-border/60 py-16 sm:py-24">
        <Container className="flex flex-col gap-5">
          {industry && (
            <Link
              href={`/industries/${industry.slug}`}
              className="flex w-fit items-center gap-1.5 text-xs tracking-[0.2em] text-accent uppercase transition-opacity hover:opacity-80"
            >
              <ArrowLeft className="size-3.5" aria-hidden="true" />
              {industry.name}
            </Link>
          )}
          <h1 className="max-w-3xl text-[clamp(2.25rem,5vw,3.5rem)] leading-[1.05] font-light tracking-[-0.02em] text-foreground">
            {caseStudy.title}
          </h1>
        </Container>
      </section>

      <section className="border-b border-border/60 py-16 sm:py-20">
        <Container>
          <BeforeAfterComparison
            beforeImage={caseStudy.beforeImage}
            afterImage={caseStudy.afterImage}
            beforeAlt={`${caseStudy.title} before MMP treatment`}
            afterAlt={`${caseStudy.title} after MMP treatment`}
          />
        </Container>
      </section>

      <section className="border-b border-border/60 py-16 sm:py-20">
        <Container className="grid gap-10 sm:grid-cols-2">
          <div className="flex flex-col gap-3">
            <h2 className="text-xs font-medium tracking-[0.2em] text-muted-foreground uppercase">Challenge</h2>
            <p className="text-sm text-foreground/90 sm:text-base">{caseStudy.challenge}</p>
          </div>
          <div className="flex flex-col gap-3">
            <h2 className="text-xs font-medium tracking-[0.2em] text-muted-foreground uppercase">Solution</h2>
            <p className="text-sm text-foreground/90 sm:text-base">{caseStudy.solution}</p>
          </div>
        </Container>
      </section>

      {caseStudy.process && (
        <section className="border-b border-border/60 py-16 sm:py-20">
          <Container className="flex flex-col gap-3">
            <h2 className="text-xs font-medium tracking-[0.2em] text-muted-foreground uppercase">Process</h2>
            <p className="max-w-3xl text-sm text-foreground/90 sm:text-base">{caseStudy.process}</p>
          </Container>
        </section>
      )}

      <section className="border-b border-border/60 py-16 sm:py-20">
        <Container className="flex flex-col gap-3">
          <h2 className="text-xs font-medium tracking-[0.2em] text-muted-foreground uppercase">Result</h2>
          <p className="max-w-3xl text-sm text-foreground/90 sm:text-base">{caseStudy.result}</p>
        </Container>
      </section>

      {specEntries.length > 0 && (
        <section className="border-b border-border/60 py-16 sm:py-20">
          <Container>
            <dl className="grid gap-6 sm:grid-cols-3">
              {specEntries.map(([label, value]) => (
                <div key={label} className="flex flex-col gap-1 border-t border-border pt-4">
                  <dt className="text-xs font-medium tracking-[0.2em] text-muted-foreground uppercase capitalize">{label}</dt>
                  <dd className="text-sm text-foreground/90">{value}</dd>
                </div>
              ))}
            </dl>
          </Container>
        </section>
      )}

      {caseStudy.gallery.length > 0 && (
        <section className="border-b border-border/60 py-16 sm:py-20">
          <Container className="grid gap-4 sm:grid-cols-3">
            {caseStudy.gallery.map((image, index) => (
              <div key={image} className="relative aspect-square overflow-hidden rounded-xl border border-border bg-muted">
                <Image
                  src={image}
                  alt={`${caseStudy.title}, additional photo ${index + 1}`}
                  fill
                  sizes="(min-width: 640px) 33vw, 100vw"
                  className="object-cover"
                />
              </div>
            ))}
          </Container>
        </section>
      )}
    </main>
  );
}
