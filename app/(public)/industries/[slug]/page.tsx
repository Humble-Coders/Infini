import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { IndustryIcon } from "@/lib/constants/industryIcons";
import { getIndustryBySlug, getPublishedIndustrySlugs } from "@/lib/data/industries";
import { getCaseStudiesByIndustry } from "@/lib/data/caseStudies";
import { getCertificationsByIds } from "@/lib/data/certifications";
import { CertificationsBlock } from "@/components/certifications/CertificationsBlock";
import { CaseStudyCard } from "@/components/case-studies/CaseStudyCard";

export async function generateStaticParams() {
  const slugs = await getPublishedIndustrySlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const industry = await getIndustryBySlug(slug);
  if (!industry) return {};

  return {
    title: industry.seo.title,
    description: industry.seo.description,
    openGraph: {
      title: `${industry.seo.title} — INFINI`,
      description: industry.seo.description,
      type: "website",
    },
  };
}

export default async function IndustryDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const industry = await getIndustryBySlug(slug);
  if (!industry) notFound();

  const [relatedCaseStudies, certifications] = await Promise.all([
    getCaseStudiesByIndustry(industry.id),
    getCertificationsByIds(industry.relatedCertIds),
  ]);

  const orderLabel = String(industry.order + 1).padStart(2, "0");

  return (
    <main className="min-h-screen bg-background">
      <section className="relative isolate overflow-hidden border-b border-border/60">
        <div className="absolute inset-0 -z-10">
          {industry.hero.image ? (
            <Image
              src={industry.hero.image}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          ) : (
            <div
              aria-hidden="true"
              className="absolute inset-0"
              style={{
                background:
                  "conic-gradient(from 200deg at 50% 50%, var(--color-popover), var(--color-muted) 25%, var(--color-background) 50%, var(--color-primary-muted) 70%, var(--color-popover))",
              }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/85 to-background/40" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/70 via-transparent to-transparent" />
        </div>

        <IndustryIcon
          slug={industry.slug}
          strokeWidth={0.6}
          aria-hidden="true"
          className="pointer-events-none absolute -right-10 -bottom-16 size-[22rem] text-foreground/[0.06] sm:size-[30rem]"
        />

        <Container className="relative flex min-h-[32rem] flex-col justify-end gap-5 py-16 sm:min-h-[36rem] sm:py-20">
          <span className="font-mono text-xs tracking-[0.3em] text-accent/80">{orderLabel} / INDUSTRY</span>
          <span className="text-xs font-medium tracking-[0.2em] text-accent uppercase">{industry.hero.eyebrow}</span>
          <h1 className="max-w-3xl text-[clamp(2.25rem,5vw,3.5rem)] leading-[1.05] font-light tracking-[-0.02em] text-foreground">
            {industry.hero.headline}
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">{industry.hero.subheadline}</p>
          <div className="mt-2">
            <Button asChild size="lg">
              <Link href={`/request-a-quote?industry=${industry.slug}`}>Request a Quote</Link>
            </Button>
          </div>
        </Container>
      </section>

      <section className="relative overflow-hidden border-b border-border/60 py-16 sm:py-24">
        <IndustryIcon
          slug={industry.slug}
          strokeWidth={0.6}
          aria-hidden="true"
          className="pointer-events-none absolute -top-10 -left-14 size-64 -rotate-12 text-foreground/[0.04] sm:size-80"
        />
        <Container className="relative flex flex-col gap-8 sm:flex-row sm:items-start">
          <div className="flex shrink-0 items-start sm:w-56">
            <h2 className="text-2xl leading-[1.1] font-light text-foreground sm:text-3xl">
              Why surface finish matters here
            </h2>
          </div>
          <p className="max-w-2xl border-l border-accent/40 pl-6 text-lg leading-relaxed font-light text-foreground/85 sm:pl-8 sm:text-xl">
            {industry.relevance}
          </p>
        </Container>
      </section>

      <section className="border-b border-border/60 py-16 sm:py-24">
        <Container className="flex flex-col gap-2">
          <h2 className="mb-8 text-2xl font-light text-foreground sm:text-3xl">Capabilities</h2>
          {industry.capabilities.map((capability, index) => (
            <div
              key={capability.title}
              className="group flex flex-col gap-3 border-t border-border py-7 transition-colors duration-300 last:border-b hover:bg-foreground/[0.02] sm:flex-row sm:items-baseline sm:gap-8 sm:py-8"
            >
              <span className="font-mono text-sm text-accent/70 tabular-nums sm:w-16 sm:shrink-0">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="text-lg font-normal text-foreground sm:w-64 sm:shrink-0">{capability.title}</h3>
              <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">{capability.description}</p>
            </div>
          ))}
        </Container>
      </section>

      <section className="border-b border-border/60 py-16 sm:py-24">
        <Container className="flex flex-col gap-12 sm:flex-row sm:gap-16">
          <div className="flex flex-1 flex-col gap-5">
            <h2 className="text-xs font-medium tracking-[0.2em] text-muted-foreground uppercase">
              Products &amp; applications
            </h2>
            <div className="flex flex-wrap gap-2.5">
              {industry.applications.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-border px-4 py-2 text-sm text-foreground/90 transition-colors duration-300 hover:border-primary/60 hover:text-foreground"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
          <div className="flex flex-1 flex-col gap-5">
            <h2 className="text-xs font-medium tracking-[0.2em] text-muted-foreground uppercase">Materials</h2>
            <div className="flex flex-wrap gap-2.5">
              {industry.materials.map((item) => (
                <span
                  key={item}
                  className="rounded-full bg-secondary px-4 py-2 text-sm text-foreground/90 transition-colors duration-300 hover:bg-primary/15 hover:text-foreground"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {certifications.length > 0 && (
        <section className="border-b border-border/60 py-16 sm:py-20">
          <Container>
            <CertificationsBlock certifications={certifications} heading="Relevant certifications" />
          </Container>
        </section>
      )}

      <section className="border-b border-border/60 py-16 sm:py-20">
        <Container className="flex flex-col gap-10">
          <h2 className="text-2xl font-light text-foreground sm:text-3xl">Case studies</h2>
          {relatedCaseStudies.length === 0 ? (
            <div className="flex flex-col items-start gap-2 rounded-xl border border-dashed border-border px-6 py-10 sm:px-10">
              <p className="max-w-lg text-sm text-muted-foreground sm:text-base">
                Case studies for {industry.name} are in progress. Tell us about your components and we&rsquo;ll walk
                you through comparable work directly.
              </p>
            </div>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {relatedCaseStudies.map((caseStudy) => (
                <CaseStudyCard key={caseStudy.slug} caseStudy={caseStudy} />
              ))}
            </div>
          )}
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container className="flex flex-col items-center gap-6 text-center">
          <h2 className="max-w-xl text-2xl font-light text-foreground sm:text-3xl">
            Have a {industry.name.toLowerCase()} component that needs finishing?
          </h2>
          <Button asChild size="lg" className="px-8">
            <Link href={`/request-a-quote?industry=${industry.slug}`}>Request a Quote</Link>
          </Button>
        </Container>
      </section>
    </main>
  );
}
