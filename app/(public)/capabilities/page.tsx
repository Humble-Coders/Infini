import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
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

      {processCapabilities && (
        <section className="border-b border-border/60 py-16 sm:py-20">
          <Container className="flex flex-col gap-10">
            <h2 className="text-2xl font-light text-foreground sm:text-3xl">The MMP process</h2>
            <div className="grid gap-8 sm:grid-cols-3">
              {processCapabilities.items.map((capability) => (
                <div key={capability.title} className="flex flex-col gap-2 border-t border-border pt-6">
                  <h3 className="text-lg font-normal text-foreground">{capability.title}</h3>
                  <p className="text-sm text-muted-foreground">{capability.description}</p>
                </div>
              ))}
            </div>
          </Container>
        </section>
      )}

      {capacity && (
        <section className="border-b border-border/60 py-16 sm:py-20">
          <Container className="flex flex-col gap-6">
            <h2 className="text-2xl font-light text-foreground sm:text-3xl">{capacity.heading}</h2>
            <p className="max-w-3xl text-sm text-muted-foreground sm:text-base">{capacity.body}</p>
          </Container>
        </section>
      )}

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
