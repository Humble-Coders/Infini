import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BadgeCheck } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import {
  capabilitiesSeo,
  capabilitiesHero,
  processCapabilities,
  capacitySummary,
} from "@/data/capabilities";
import { navItems } from "@/data/nav";

export const metadata: Metadata = {
  title: capabilitiesSeo.title,
  description: capabilitiesSeo.description,
  openGraph: {
    title: `${capabilitiesSeo.title} — INFINI`,
    description: capabilitiesSeo.description,
    type: "website",
  },
};

const legacyCapabilityLinks = navItems.find((item) => item.href === "/capabilities")?.children ?? [];

export default function CapabilitiesPage() {
  return (
    <main className="min-h-screen bg-background">
      <section className="border-b border-border/60 py-20 sm:py-28">
        <Container className="flex flex-col gap-5">
          <span className="text-xs font-medium tracking-[0.2em] text-accent uppercase">{capabilitiesHero.eyebrow}</span>
          <h1 className="max-w-3xl text-[clamp(2.25rem,5vw,3.5rem)] leading-[1.05] font-light tracking-[-0.02em] text-foreground">
            {capabilitiesHero.heading}
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">{capabilitiesHero.body}</p>
        </Container>
      </section>

      <section className="border-b border-border/60 py-16 sm:py-20">
        <Container className="flex flex-col gap-10">
          <h2 className="text-2xl font-light text-foreground sm:text-3xl">The MMP process</h2>
          <div className="grid gap-8 sm:grid-cols-3">
            {processCapabilities.map((capability) => (
              <div key={capability.title} className="flex flex-col gap-2 border-t border-border pt-6">
                <h3 className="text-lg font-normal text-foreground">{capability.title}</h3>
                <p className="text-sm text-muted-foreground">{capability.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-b border-border/60 py-16 sm:py-20">
        <Container className="flex flex-col gap-6">
          <h2 className="text-2xl font-light text-foreground sm:text-3xl">{capacitySummary.heading}</h2>
          <p className="max-w-3xl text-sm text-muted-foreground sm:text-base">{capacitySummary.body}</p>
        </Container>
      </section>

      {legacyCapabilityLinks.length > 0 && (
        <section className="border-b border-border/60 py-16 sm:py-20">
          <Container className="flex flex-col gap-6">
            <h2 className="text-2xl font-light text-foreground sm:text-3xl">Go deeper on a specific finish</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {legacyCapabilityLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group flex items-center justify-between rounded-xl border border-border px-6 py-4 transition-colors duration-300 ease-out hover:border-primary"
                >
                  <span className="text-sm text-foreground sm:text-base">{link.label}</span>
                  <ArrowRight
                    className="size-4 text-accent opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100"
                    aria-hidden="true"
                  />
                </Link>
              ))}
            </div>
          </Container>
        </section>
      )}

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
