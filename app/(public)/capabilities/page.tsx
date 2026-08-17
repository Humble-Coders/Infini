import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Wrench } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { getPage, getSection } from "@/lib/data/pages";
import { getActiveCertifications } from "@/lib/data/certifications";
import { getSettings } from "@/lib/data/settings";
import { CertificationsBlock } from "@/components/certifications/CertificationsBlock";

interface HeroCopy {
  eyebrow: string;
  heading: string;
  body: string;
}
interface ItemsCopy {
  items: { title: string; description: string }[];
}
interface TextBlockCopy {
  heading: string;
  body: string;
}

const FALLBACK: Metadata = {
  title: "Capabilities — MMP Surface Finishing Process",
  description:
    "INFINI's treatment capabilities: MMP surface finishing from controlled roughness to mirror-like brilliance, with measured, traceable batch validation.",
};

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage("capabilities");
  if (!page) return FALLBACK;
  return {
    title: page.seo.title,
    description: page.seo.description,
    openGraph: { title: `${page.seo.title} — INFINI`, description: page.seo.description, type: "website" },
  };
}

export default async function CapabilitiesPage() {
  const [page, certifications, settings] = await Promise.all([
    getPage("capabilities"),
    getActiveCertifications(),
    getSettings(),
  ]);

  const hero = getSection<HeroCopy>(page, "hero");
  const processCapabilities = getSection<ItemsCopy>(page, "processCapabilities");
  const capacity = getSection<TextBlockCopy>(page, "capacity");
  const legacyCapabilityLinks = settings?.nav.find((item) => item.href === "/capabilities")?.children ?? [];

  return (
    <main className="min-h-screen bg-background">
      {hero && (
        <section className="relative overflow-hidden border-b border-border/60 py-20 sm:py-28">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background: "radial-gradient(70% 60% at 50% 0%, rgba(var(--color-accent-rgb),0.14), transparent 70%)",
            }}
          />
          <Wrench
            strokeWidth={0.6}
            aria-hidden="true"
            className="pointer-events-none absolute -right-10 -bottom-20 size-72 text-foreground/[0.05] sm:size-96"
          />
          <Container className="relative flex flex-col gap-5">
            <span className="text-xs font-medium tracking-[0.2em] text-accent uppercase">{hero.eyebrow}</span>
            <h1 className="max-w-3xl text-[clamp(2.25rem,5vw,3.5rem)] leading-[1.05] font-light tracking-[-0.02em] text-foreground">
              {hero.heading}
            </h1>
            <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">{hero.body}</p>
          </Container>
        </section>
      )}

      {processCapabilities && (
        <section className="border-b border-border/60 py-16 sm:py-24">
          <Container className="flex flex-col gap-2">
            <h2 className="mb-8 text-2xl font-light text-foreground sm:text-3xl">The MMP process</h2>
            {processCapabilities.items.map((capability, index) => (
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
      )}

      {capacity && (
        <section className="border-b border-border/60 py-16 sm:py-24">
          <Container className="flex flex-col gap-8 sm:flex-row sm:items-start">
            <div className="flex shrink-0 items-start sm:w-56">
              <h2 className="text-2xl leading-[1.1] font-light text-foreground sm:text-3xl">{capacity.heading}</h2>
            </div>
            <p className="max-w-2xl border-l border-accent/40 pl-6 text-lg leading-relaxed font-light text-foreground/85 sm:pl-8 sm:text-xl">
              {capacity.body}
            </p>
          </Container>
        </section>
      )}

      {legacyCapabilityLinks.length > 0 && (
        <section className="border-b border-border/60 py-16 sm:py-20">
          <Container className="flex flex-col gap-6">
            <h2 className="text-2xl font-light text-foreground sm:text-3xl">Go deeper on a specific finish</h2>
            <div className="flex flex-col divide-y divide-border border-t border-border">
              {legacyCapabilityLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group flex items-center justify-between py-4 transition-colors hover:bg-foreground/[0.02]"
                >
                  <span className="text-sm text-foreground sm:text-base">{link.label}</span>
                  <ArrowRight
                    className="size-4 text-accent opacity-0 transition-all duration-300 ease-out group-hover:translate-x-1 group-hover:opacity-100"
                    aria-hidden="true"
                  />
                </Link>
              ))}
            </div>
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
