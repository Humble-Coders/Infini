import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { BlurText } from "@/components/ui/blur-text";
import { MonoLabel } from "@/components/sections/home/MonoLabel";
import { PhotoHero } from "@/components/sections/shared/PhotoHero";
import { HERO_IMAGERY } from "@/lib/constants/heroImagery";
import { AxisCrossLinks } from "@/components/sections/axes/AxisCrossLinks";
import { Ticker } from "@/components/sections/home/Ticker";
import { getComponentTypeBySlug, getPublishedComponentTypeSlugs } from "@/lib/data/componentTypes";
import { getBenefitsBySlugs } from "@/lib/data/benefits";
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
  const slugs = await getPublishedComponentTypeSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const type = await getComponentTypeBySlug(slug);
  if (!type) return {};
  return {
    title: pageTitle(type.seo.title),
    description: type.seo.description || type.summary,
    openGraph: {
      title: ogTitle(type.seo.title),
      description: type.seo.description || type.summary,
      type: "website",
    },
  };
}

/*
 * One component-type page. The part's own engineering problem comes first, the
 * treatment second, and the envelope third.
 *
 * The envelope is the reason this page exists in this shape: a reader can tell
 * from four rows whether INFINI will take their part at all, which is the
 * question that otherwise costs a sales call.
 */
export default async function ComponentTypeDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const type = await getComponentTypeBySlug(slug);
  if (!type) notFound();

  const [benefits, allIndustries] = await Promise.all([
    getBenefitsBySlugs(type.relatedBenefitSlugs),
    getPublishedIndustries(),
  ]);
  const industries = allIndustries.filter((industry) => type.relatedIndustrySlugs.includes(industry.slug));

  return (
    <main className="min-h-screen bg-background">
      <PhotoHero
        eyebrow={`Components / ${type.name}`}
        heading={type.headline}
        body={type.summary}
        image={HERO_IMAGERY.components.src}
        imageAlt={HERO_IMAGERY.components.alt}
      />

      {type.materials.length > 0 && <Ticker items={type.materials} />}

      <section data-surface="light" className="bg-background py-24 sm:py-32">
        <Container className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="flex flex-col gap-6 lg:col-span-6">
            <MonoLabel>The problem with the part</MonoLabel>
            <h2 className="text-[clamp(1.6rem,3.2vw,2.5rem)] leading-[1.08] font-semibold tracking-[-0.035em] text-balance text-foreground">
              <BlurText text={`What makes ${type.name.toLowerCase()} hard to finish.`} />
            </h2>
            <p className="text-base leading-relaxed text-pretty text-muted-foreground sm:text-lg">{type.challenge}</p>
          </div>
          <Reveal delay={0.12} className="flex flex-col gap-6 lg:col-span-5 lg:col-start-8">
            <MonoLabel>How MMP treats it</MonoLabel>
            <p className="border-l-2 border-accent pl-6 text-base leading-relaxed text-pretty text-foreground sm:text-lg">
              {type.treatment}
            </p>
          </Reveal>
        </Container>
      </section>

      <section className="bg-background py-24 sm:py-28">
        <Container className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="flex flex-col gap-6 lg:col-span-7">
            <MonoLabel as="h2">Will we take your part</MonoLabel>
            <dl className="flex flex-col border-t border-border">
              {type.envelope.map((row) => (
                <div key={row.label} className="flex items-baseline justify-between gap-6 border-b border-border py-4">
                  <dt className="text-sm font-medium text-foreground">{row.label}</dt>
                  <dd className="text-right font-mono text-sm tabular-nums text-muted-foreground">{row.value}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="flex flex-col gap-6 lg:col-span-4 lg:col-start-9">
            <MonoLabel as="h2">Materials</MonoLabel>
            <ul className="flex flex-col border-t border-border">
              {type.materials.map((material) => (
                <li key={material} className="border-b border-border py-4 font-mono text-sm text-foreground">
                  {material}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      <AxisCrossLinks
        primaryLabel="What MMP changes here"
        primary={benefits.map((benefit) => ({
          slug: benefit.slug,
          name: benefit.name,
          summary: benefit.summary,
          href: `/benefits/${benefit.slug}`,
        }))}
        industries={industries}
        surface="light"
      />
    </main>
  );
}
