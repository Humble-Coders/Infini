import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
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

  return (
    <main className="min-h-screen bg-background">
      <section className="relative overflow-hidden border-b border-border/60 py-20 sm:py-28">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background: "radial-gradient(70% 60% at 50% 0%, rgba(var(--color-accent-rgb),0.14), transparent 70%)",
          }}
        />
        <Container className="relative flex flex-col gap-5">
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

      <section className="border-b border-border/60 py-16 sm:py-20">
        <Container className="flex flex-col gap-6">
          <h2 className="text-2xl font-light text-foreground sm:text-3xl">Why surface finish matters here</h2>
          <p className="max-w-3xl text-sm text-muted-foreground sm:text-base">{industry.relevance}</p>
        </Container>
      </section>

      <section className="border-b border-border/60 py-16 sm:py-20">
        <Container className="flex flex-col gap-10">
          <h2 className="text-2xl font-light text-foreground sm:text-3xl">Capabilities</h2>
          <div className="grid gap-8 sm:grid-cols-3">
            {industry.capabilities.map((capability) => (
              <div key={capability.title} className="flex flex-col gap-2 border-t border-border pt-6">
                <h3 className="text-lg font-normal text-foreground">{capability.title}</h3>
                <p className="text-sm text-muted-foreground">{capability.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-b border-border/60 py-16 sm:py-20">
        <Container className="grid gap-10 sm:grid-cols-2">
          <div className="flex flex-col gap-4">
            <h2 className="text-xs font-medium tracking-[0.2em] text-muted-foreground uppercase">
              Products & applications
            </h2>
            <ul className="flex flex-col gap-2">
              {industry.applications.map((item) => (
                <li key={item} className="text-sm text-foreground/90 sm:text-base">
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col gap-4">
            <h2 className="text-xs font-medium tracking-[0.2em] text-muted-foreground uppercase">Materials</h2>
            <ul className="flex flex-col gap-2">
              {industry.materials.map((item) => (
                <li key={item} className="text-sm text-foreground/90 sm:text-base">
                  {item}
                </li>
              ))}
            </ul>
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
