import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { MonoLabel } from "@/components/sections/home/MonoLabel";
import { IndustryIcon } from "@/lib/constants/industryIcons";
import type { IndustryDoc, WithId } from "@/lib/types";

export interface RelatedPage {
  label: string;
  href: string;
  description: string;
}

/**
 * The tail every capability and industry page ends with, whatever its body
 * length: where the process applies, where to read next, then the ask.
 *
 * Cross-links and further reading share one band rather than taking one each.
 * Two consecutive link grids in different colours read as a stripe, and they
 * are the same idea anyway, so they belong together under one heading with the
 * ask following on brand red.
 */
export function PageTail({
  industries,
  related,
  surface = "light",
}: {
  industries: WithId<IndustryDoc>[];
  related: RelatedPage[];
  surface?: "light" | "dark";
}) {
  return (
    <>
      {(industries.length > 0 || related.length > 0) && (
        <section
          {...(surface === "light" ? { "data-surface": "light" } : {})}
          className="bg-background py-24 sm:py-28"
        >
          <Container className="grid gap-14 lg:grid-cols-12 lg:gap-10">
            {industries.length > 0 && (
              <div className="flex flex-col gap-6 lg:col-span-7">
                <MonoLabel as="h2">Where this applies</MonoLabel>
                <ul className="grid grid-cols-2 gap-px border border-border bg-border sm:grid-cols-3">
                  {industries.map((industry) => (
                    <li key={industry.id}>
                      <Link
                        href={`/industries/${industry.slug}`}
                        className="group flex h-full flex-col gap-3 bg-background p-5 transition-colors hover:bg-background-elevated focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                      >
                        <IndustryIcon slug={industry.slug} className="size-5 text-accent" aria-hidden="true" />
                        <span className="text-sm leading-snug font-medium text-foreground">{industry.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {related.length > 0 && (
              <div className="flex flex-col gap-6 lg:col-span-4 lg:col-start-9">
                <MonoLabel as="h2">Read next</MonoLabel>
                <ul className="flex flex-col border-t border-border">
                  {related.map((page) => (
                    <li key={page.href}>
                      <Link
                        href={page.href}
                        className="group flex flex-col gap-1.5 border-b border-border py-5 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                      >
                        <span className="flex items-center justify-between gap-4 text-base font-semibold tracking-[-0.015em] text-foreground">
                          {page.label}
                          <ArrowUpRight
                            className="size-4 shrink-0 text-accent transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                            aria-hidden="true"
                          />
                        </span>
                        <span className="text-sm leading-relaxed text-muted-foreground">{page.description}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Container>
        </section>
      )}

    </>
  );
}
