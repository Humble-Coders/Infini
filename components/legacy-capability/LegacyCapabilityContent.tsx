import Link from "next/link";
import { ArrowRight, type LucideIcon } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { IndustryIcon } from "@/lib/constants/industryIcons";
import type { IndustryDoc, PageHeroCopy, WithId } from "@/lib/types";

export type ContentBlock =
  | { type: "text"; heading: string; body: string }
  | { type: "list"; heading: string; items: string[] };

/**
 * Shared layout for the four T16 legacy-slug pages (technology, validation,
 * deburring-polishing, mirror-like-finish) — same chrome (hero, content
 * blocks, industry cross-links, RFQ CTA), different content per page so
 * none of the four end up substantially duplicating another's copy.
 */
export function LegacyCapabilityContent({
  hero,
  blocks,
  relatedIndustries,
  icon: Icon,
}: {
  hero: PageHeroCopy;
  blocks: ContentBlock[];
  relatedIndustries: WithId<IndustryDoc>[];
  icon: LucideIcon;
}) {
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
        <Icon
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
          <div className="mt-2">
            <Button asChild size="lg">
              <Link href="/request-a-quote">Request a Quote</Link>
            </Button>
          </div>
        </Container>
      </section>

      {blocks.map((block, index) =>
        block.type === "text" ? (
          <section key={block.heading} className="border-b border-border/60 py-16 sm:py-24">
            <Container className="flex flex-col gap-8 sm:flex-row sm:items-start">
              <div className="flex shrink-0 items-start gap-4 sm:w-56">
                <span className="font-mono text-sm text-accent/70 tabular-nums">{String(index + 1).padStart(2, "0")}</span>
                <h2 className="text-2xl leading-[1.1] font-light text-foreground sm:text-3xl">{block.heading}</h2>
              </div>
              <p className="max-w-2xl border-l border-accent/40 pl-6 text-lg leading-relaxed font-light text-foreground/85 sm:pl-8 sm:text-xl">
                {block.body}
              </p>
            </Container>
          </section>
        ) : (
          <section key={block.heading} className="border-b border-border/60 py-16 sm:py-24">
            <Container className="flex flex-col gap-6">
              <div className="flex items-baseline gap-4">
                <span className="font-mono text-sm text-accent/70 tabular-nums">{String(index + 1).padStart(2, "0")}</span>
                <h2 className="text-2xl font-light text-foreground sm:text-3xl">{block.heading}</h2>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {block.items.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-border px-4 py-2 text-sm text-foreground/90 transition-colors duration-300 hover:border-primary/60 hover:text-foreground"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </Container>
          </section>
        )
      )}

      {relatedIndustries.length > 0 && (
        <section className="py-16 sm:py-20">
          <Container className="flex flex-col gap-8">
            <h2 className="text-2xl font-light text-foreground sm:text-3xl">Where this applies</h2>
            <div className="flex flex-col divide-y divide-border border-t border-border">
              {relatedIndustries.map((industry) => (
                <Link
                  key={industry.slug}
                  href={`/industries/${industry.slug}`}
                  className="group flex items-center justify-between gap-3 py-4 transition-colors hover:bg-foreground/[0.02]"
                >
                  <span className="flex items-center gap-3">
                    <IndustryIcon
                      slug={industry.slug}
                      className="size-5 text-muted-foreground transition-colors group-hover:text-primary"
                      strokeWidth={1.5}
                      aria-hidden="true"
                    />
                    <span className="text-sm text-foreground sm:text-base">{industry.name}</span>
                  </span>
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
    </main>
  );
}
