import Link from "next/link";
import { ArrowRight } from "lucide-react";
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
}: {
  hero: PageHeroCopy;
  blocks: ContentBlock[];
  relatedIndustries: WithId<IndustryDoc>[];
}) {
  return (
    <main className="min-h-screen bg-background">
      <section className="border-b border-border/60 py-20 sm:py-28">
        <Container className="flex flex-col gap-5">
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

      {blocks.map((block) => (
        <section key={block.heading} className="border-b border-border/60 py-16 sm:py-20">
          <Container className="flex flex-col gap-6">
            <h2 className="text-2xl font-light text-foreground sm:text-3xl">{block.heading}</h2>
            {block.type === "text" ? (
              <p className="max-w-3xl text-sm text-foreground/90 sm:text-base">{block.body}</p>
            ) : (
              <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {block.items.map((item) => (
                  <li
                    key={item}
                    className="rounded-lg border border-border px-4 py-3 text-sm text-foreground/90"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </Container>
        </section>
      ))}

      {relatedIndustries.length > 0 && (
        <section className="py-16 sm:py-20">
          <Container className="flex flex-col gap-8">
            <h2 className="text-2xl font-light text-foreground sm:text-3xl">Where this applies</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {relatedIndustries.map((industry) => (
                <Link
                  key={industry.slug}
                  href={`/industries/${industry.slug}`}
                  className="group flex items-center justify-between gap-3 rounded-xl border border-border px-5 py-4 transition-colors hover:border-primary"
                >
                  <span className="flex items-center gap-3">
                    <IndustryIcon slug={industry.slug} className="size-5 text-muted-foreground" strokeWidth={1.5} aria-hidden="true" />
                    <span className="text-sm text-foreground sm:text-base">{industry.name}</span>
                  </span>
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
    </main>
  );
}
