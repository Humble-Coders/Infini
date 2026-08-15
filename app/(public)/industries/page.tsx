import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { industries, industriesIndexCopy } from "@/data/industries";

export const metadata: Metadata = {
  title: "Industries We Serve",
  description: industriesIndexCopy.body,
  openGraph: {
    title: "Industries We Serve — INFINI",
    description: industriesIndexCopy.body,
    type: "website",
  },
};

export default function IndustriesIndexPage() {
  return (
    <main className="min-h-screen bg-background">
      <section className="border-b border-border/60 py-20 sm:py-28">
        <Container className="flex flex-col gap-4">
          <span className="text-xs font-medium tracking-[0.2em] text-accent uppercase">
            {industriesIndexCopy.eyebrow}
          </span>
          <h1 className="max-w-2xl text-[clamp(2.25rem,5vw,3.5rem)] leading-[1.05] font-light tracking-[-0.02em] text-foreground">
            {industriesIndexCopy.heading}
          </h1>
          <p className="max-w-xl text-sm text-muted-foreground sm:text-base">{industriesIndexCopy.body}</p>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {industries.map((industry) => {
              const Icon = industry.icon;
              return (
                <Link
                  key={industry.slug}
                  href={`/industries/${industry.slug}`}
                  className="group flex flex-col gap-4 rounded-xl border border-border p-6 transition-colors duration-300 ease-out hover:border-primary"
                >
                  <span className="flex size-12 items-center justify-center rounded-full border border-border text-foreground transition-all duration-300 ease-out group-hover:border-primary group-hover:text-primary">
                    <Icon className="size-6" strokeWidth={1.5} aria-hidden="true" />
                  </span>
                  <div className="flex flex-col gap-1">
                    <h2 className="text-lg font-normal text-foreground">{industry.name}</h2>
                    <p className="text-sm text-muted-foreground">{industry.hero.body}</p>
                  </div>
                  <span className="flex items-center gap-1.5 text-xs text-accent opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100">
                    View industry
                    <ArrowRight className="size-3.5" aria-hidden="true" />
                  </span>
                </Link>
              );
            })}
          </div>
        </Container>
      </section>
    </main>
  );
}
