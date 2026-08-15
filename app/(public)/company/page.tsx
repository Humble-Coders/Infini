import type { Metadata } from "next";
import Link from "next/link";
import { BadgeCheck } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { companySeo, companyHero, companyFacts, companyProcessSummary, companyQualitySummary } from "@/data/company";

export const metadata: Metadata = {
  title: companySeo.title,
  description: companySeo.description,
  openGraph: {
    title: `${companySeo.title} — INFINI`,
    description: companySeo.description,
    type: "website",
  },
};

export default function CompanyPage() {
  return (
    <main className="min-h-screen bg-background">
      <section className="border-b border-border/60 py-20 sm:py-28">
        <Container className="flex flex-col gap-5">
          <span className="text-xs font-medium tracking-[0.2em] text-accent uppercase">{companyHero.eyebrow}</span>
          <h1 className="max-w-3xl text-[clamp(2.25rem,5vw,3.5rem)] leading-[1.05] font-light tracking-[-0.02em] text-foreground">
            {companyHero.heading}
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">{companyHero.body}</p>
        </Container>
      </section>

      <section className="border-b border-border/60 py-16 sm:py-20">
        <Container>
          <dl className="grid gap-8 sm:grid-cols-2">
            {companyFacts.map((fact) => (
              <div key={fact.label} className="flex flex-col gap-1 border-t border-border pt-4">
                <dt className="text-xs font-medium tracking-[0.2em] text-muted-foreground uppercase">{fact.label}</dt>
                <dd className="text-sm text-foreground/90 sm:text-base">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      <section className="border-b border-border/60 py-16 sm:py-20">
        <Container className="flex flex-col gap-6">
          <h2 className="text-2xl font-light text-foreground sm:text-3xl">{companyProcessSummary.heading}</h2>
          <p className="max-w-3xl text-sm text-muted-foreground sm:text-base">{companyProcessSummary.body}</p>
        </Container>
      </section>

      <section className="border-b border-border/60 py-16 sm:py-20">
        <Container className="flex flex-col gap-6">
          <h2 className="text-2xl font-light text-foreground sm:text-3xl">{companyQualitySummary.heading}</h2>
          <p className="max-w-3xl text-sm text-muted-foreground sm:text-base">{companyQualitySummary.body}</p>
        </Container>
      </section>

      <section className="border-b border-border/60 py-16 sm:py-20">
        <Container className="flex flex-col gap-6">
          <h2 className="text-2xl font-light text-foreground sm:text-3xl">Certifications</h2>
          <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
            INFINI holds ISO 9001, ISO 13485, ISO 14001, ISO 45001, and Udyam registration.
          </p>
          <Link
            href="/certifications"
            className="flex w-fit items-center gap-2 rounded-full border border-border px-4 py-2 text-sm text-foreground transition-colors duration-300 ease-out hover:border-primary hover:text-primary"
          >
            <BadgeCheck className="size-4 text-accent" aria-hidden="true" />
            View certificate details
          </Link>
        </Container>
      </section>

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
