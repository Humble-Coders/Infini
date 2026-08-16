import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { getPage, getSection } from "@/lib/data/pages";
import { getActiveCertifications } from "@/lib/data/certifications";
import { CertificationsBlock } from "@/components/certifications/CertificationsBlock";

interface HeroCopy {
  eyebrow: string;
  heading: string;
  body: string;
}
interface FactsCopy {
  items: { label: string; value: string }[];
}
interface TextBlockCopy {
  heading: string;
  body: string;
}

const FALLBACK: Metadata = {
  title: "About INFINI — Precision Surface Finishing",
  description:
    "INFINI Precision Pvt. Ltd. applies MMP surface-finishing technology from its treatment facility in Parwanoo, Himachal Pradesh, serving precision manufacturers across seven industries.",
};

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage("company");
  if (!page) return FALLBACK;
  return {
    title: page.seo.title,
    description: page.seo.description,
    openGraph: { title: `${page.seo.title} — INFINI`, description: page.seo.description, type: "website" },
  };
}

export default async function CompanyPage() {
  const [page, certifications] = await Promise.all([getPage("company"), getActiveCertifications()]);

  const hero = getSection<HeroCopy>(page, "hero");
  const facts = getSection<FactsCopy>(page, "facts");
  const processSummary = getSection<TextBlockCopy>(page, "process");
  const quality = getSection<TextBlockCopy>(page, "quality");

  return (
    <main className="min-h-screen bg-background">
      {hero && (
        <section className="border-b border-border/60 py-20 sm:py-28">
          <Container className="flex flex-col gap-5">
            <span className="text-xs font-medium tracking-[0.2em] text-accent uppercase">{hero.eyebrow}</span>
            <h1 className="max-w-3xl text-[clamp(2.25rem,5vw,3.5rem)] leading-[1.05] font-light tracking-[-0.02em] text-foreground">
              {hero.heading}
            </h1>
            <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">{hero.body}</p>
          </Container>
        </section>
      )}

      {facts && (
        <section className="border-b border-border/60 py-16 sm:py-20">
          <Container>
            <dl className="grid gap-8 sm:grid-cols-2">
              {facts.items.map((fact) => (
                <div key={fact.label} className="flex flex-col gap-1 border-t border-border pt-4">
                  <dt className="text-xs font-medium tracking-[0.2em] text-muted-foreground uppercase">{fact.label}</dt>
                  <dd className="text-sm text-foreground/90 sm:text-base">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </Container>
        </section>
      )}

      {processSummary && (
        <section className="border-b border-border/60 py-16 sm:py-20">
          <Container className="flex flex-col gap-6">
            <h2 className="text-2xl font-light text-foreground sm:text-3xl">{processSummary.heading}</h2>
            <p className="max-w-3xl text-sm text-muted-foreground sm:text-base">{processSummary.body}</p>
          </Container>
        </section>
      )}

      {quality && (
        <section className="border-b border-border/60 py-16 sm:py-20">
          <Container className="flex flex-col gap-6">
            <h2 className="text-2xl font-light text-foreground sm:text-3xl">{quality.heading}</h2>
            <p className="max-w-3xl text-sm text-muted-foreground sm:text-base">{quality.body}</p>
          </Container>
        </section>
      )}

      {certifications.length > 0 && (
        <section className="border-b border-border/60 py-16 sm:py-20">
          <Container>
            <CertificationsBlock certifications={certifications} />
          </Container>
        </section>
      )}

      <section className="py-16 sm:py-20">
        <Container className="flex flex-col items-center gap-6 text-center">
          <h2 className="max-w-xl text-2xl font-light text-foreground sm:text-3xl">
            Have a component that needs finishing?
          </h2>
          <Button asChild size="lg" className="px-8">
            <Link href="/request-a-quote">Request a Quote</Link>
          </Button>
        </Container>
      </section>
    </main>
  );
}
