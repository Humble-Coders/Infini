import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BadgeCheck } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { industries } from "@/data/industries";
import { caseStudies } from "@/data/case-studies";

export function generateStaticParams() {
  return industries.map((industry) => ({ slug: industry.slug }));
}

function getIndustry(slug: string) {
  return industries.find((industry) => industry.slug === slug);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const industry = getIndustry(slug);
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

export default async function IndustryDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const industry = getIndustry(slug);
  if (!industry) notFound();

  const relatedCaseStudies = caseStudies.filter((caseStudy) => caseStudy.industry === industry.name);

  return (
    <main className="min-h-screen bg-background">
      <section className="relative overflow-hidden border-b border-border/60 py-20 sm:py-28">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(70% 60% at 50% 0%, rgba(var(--color-accent-rgb),0.14), transparent 70%)",
          }}
        />
        <Container className="relative flex flex-col gap-5">
          <span className="text-xs font-medium tracking-[0.2em] text-accent uppercase">{industry.hero.eyebrow}</span>
          <h1 className="max-w-3xl text-[clamp(2.25rem,5vw,3.5rem)] leading-[1.05] font-light tracking-[-0.02em] text-foreground">
            {industry.hero.heading}
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">{industry.hero.body}</p>
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

      <section className="border-b border-border/60 py-16 sm:py-20">
        <Container className="flex flex-col gap-6">
          <h2 className="text-2xl font-light text-foreground sm:text-3xl">Relevant certifications</h2>
          <ul className="flex flex-wrap gap-3">
            {industry.certifications.map((cert) => (
              <li
                key={cert}
                className="flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm text-foreground"
              >
                <BadgeCheck className="size-4 text-accent" aria-hidden="true" />
                {cert}
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="border-b border-border/60 py-16 sm:py-20">
        <Container className="flex flex-col gap-10">
          <h2 className="text-2xl font-light text-foreground sm:text-3xl">Case studies</h2>
          {relatedCaseStudies.length === 0 ? (
            <div className="flex flex-col items-start gap-2 rounded-xl border border-dashed border-border px-6 py-10 sm:px-10">
              <p className="max-w-lg text-sm text-muted-foreground sm:text-base">
                Case studies for {industry.name} are in progress. Tell us about your components and we&rsquo;ll
                walk you through comparable work directly.
              </p>
            </div>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {relatedCaseStudies.map((caseStudy) => (
                <article key={caseStudy.slug} className="flex flex-col gap-3 rounded-xl border border-border p-6">
                  <h3 className="text-lg font-normal text-foreground">{caseStudy.title}</h3>
                  <p className="text-sm text-muted-foreground">{caseStudy.summary}</p>
                </article>
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
