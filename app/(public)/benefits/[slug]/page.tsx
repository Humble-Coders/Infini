import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { BlurText } from "@/components/ui/blur-text";
import { MonoLabel } from "@/components/sections/home/MonoLabel";
import { PhotoHero } from "@/components/sections/shared/PhotoHero";
import { HERO_IMAGERY } from "@/lib/constants/heroImagery";
import { AxisCrossLinks } from "@/components/sections/axes/AxisCrossLinks";
import { getBenefitBySlug, getPublishedBenefitSlugs } from "@/lib/data/benefits";
import { getComponentTypesBySlugs } from "@/lib/data/componentTypes";
import { getPublishedIndustries } from "@/lib/data/industries";
import { ogTitle, pageTitle } from "@/lib/seo";


/*
 * ISR window. Without this the route re-renders and re-reads Firestore on
 * every request, so returning to a page costs the same round trips as
 * arriving the first time. Publishing should still revalidate the path for
 * an immediate update; this is the floor, not the mechanism.
 */
export const revalidate = 600;

export async function generateStaticParams() {
  const slugs = await getPublishedBenefitSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const benefit = await getBenefitBySlug(slug);
  if (!benefit) return {};
  return {
    title: pageTitle(benefit.seo.title),
    description: benefit.seo.description || benefit.summary,
    openGraph: {
      title: ogTitle(benefit.seo.title),
      description: benefit.seo.description || benefit.summary,
      type: "website",
    },
  };
}

/*
 * One benefit page: the failure mode first, in the engineer's own terms, and
 * only then what MMP changes about it. That order is deliberate and it is the
 * pattern the strongest sites in this category follow, because a reader
 * arriving here already has the problem and is checking whether the page
 * understands it before they care who is selling.
 */
export default async function BenefitDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const benefit = await getBenefitBySlug(slug);
  if (!benefit) notFound();

  const [components, allIndustries] = await Promise.all([
    getComponentTypesBySlugs(benefit.relatedComponentSlugs),
    getPublishedIndustries(),
  ]);
  const industries = allIndustries.filter((industry) => benefit.relatedIndustrySlugs.includes(industry.slug));

  return (
    <main className="min-h-screen bg-background">
      <PhotoHero
        eyebrow={`What MMP changes / ${benefit.name}`}
        heading={benefit.headline}
        body={benefit.summary}
        stats={benefit.evidence.slice(0, 3).map((item) => ({ label: item.label, value: item.value }))}
        image={HERO_IMAGERY.benefits.src}
        imageAlt={HERO_IMAGERY.benefits.alt}
      />

      <section data-surface="light" className="bg-background py-24 sm:py-32">
        <Container className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="flex flex-col gap-6 lg:col-span-6">
            <MonoLabel>How it fails</MonoLabel>
            <h2 className="text-[clamp(1.6rem,3.2vw,2.5rem)] leading-[1.08] font-semibold tracking-[-0.035em] text-balance text-foreground">
              <BlurText text={`The mechanism behind ${benefit.name.toLowerCase()}.`} />
            </h2>
            <p className="text-base leading-relaxed text-pretty text-muted-foreground sm:text-lg">
              {benefit.mechanism}
            </p>
          </div>
          <Reveal delay={0.12} className="flex flex-col gap-6 lg:col-span-5 lg:col-start-8">
            <MonoLabel>What the treatment changes</MonoLabel>
            <p className="border-l-2 border-accent pl-6 text-base leading-relaxed text-pretty text-foreground sm:text-lg">
              {benefit.whatChanges}
            </p>
          </Reveal>
        </Container>
      </section>

      {benefit.evidence.length > 0 && (
        <section className="border-y border-border bg-background-elevated py-20 sm:py-24">
          <Container className="flex flex-col gap-10">
            <MonoLabel as="h2">What changes, measured</MonoLabel>
            <dl className="grid gap-10 sm:grid-cols-3 sm:gap-8">
              {benefit.evidence.map((item, index) => (
                <Reveal key={item.label} delay={index * 0.08}>
                  <div className="flex flex-col gap-3 border-t border-border pt-6">
                    <dt className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
                      {item.label}
                    </dt>
                    <dd className="flex flex-col gap-2">
                      <span className="text-[clamp(1.75rem,3.6vw,2.5rem)] leading-[1] font-semibold tracking-[-0.04em] text-foreground">
                        {item.value}
                      </span>
                      {item.note && (
                        <span className="text-sm leading-relaxed text-muted-foreground">{item.note}</span>
                      )}
                    </dd>
                  </div>
                </Reveal>
              ))}
            </dl>
          </Container>
        </section>
      )}

      <AxisCrossLinks
        primaryLabel="Components this applies to"
        primary={components.map((type) => ({
          slug: type.slug,
          name: type.name,
          summary: type.summary,
          href: `/components/${type.slug}`,
        }))}
        industries={industries}
      />
    </main>
  );
}
