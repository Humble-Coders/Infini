import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { MonoLabel } from "@/components/sections/home/MonoLabel";
import { IndustryIcon } from "@/lib/constants/industryIcons";
import type { IndustryDoc, WithId } from "@/lib/types";

export interface AxisLink {
  slug: string;
  name: string;
  summary: string;
  href: string;
}

/**
 * The band that makes the matrix navigable.
 *
 * A benefit page names the components it applies to and the sectors it bites
 * in; a component page names the benefits it delivers and the same sectors.
 * Every leaf therefore sits at an intersection and can be entered from any of
 * the three axes, which is the single strongest structural idea in this
 * category and the reason these two collections exist at all.
 */
export function AxisCrossLinks({
  primaryLabel,
  primary,
  industries,
  surface = "dark",
}: {
  primaryLabel: string;
  primary: AxisLink[];
  industries: WithId<IndustryDoc>[];
  surface?: "light" | "dark";
}) {
  if (primary.length === 0 && industries.length === 0) return null;

  return (
    <section
      {...(surface === "light" ? { "data-surface": "light" } : {})}
      className="bg-background py-24 sm:py-28"
    >
      <Container className="grid gap-14 lg:grid-cols-12 lg:gap-10">
        {primary.length > 0 && (
          <div className="flex flex-col gap-6 lg:col-span-7">
            <MonoLabel as="h2">{primaryLabel}</MonoLabel>
            <ul className="flex flex-col border-t border-border">
              {primary.map((item) => (
                <li key={item.slug}>
                  <Link
                    href={item.href}
                    className="group flex flex-col gap-1.5 border-b border-border py-5 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                  >
                    <span className="flex items-center justify-between gap-4 text-base font-semibold tracking-[-0.015em] text-foreground">
                      {item.name}
                      <ArrowUpRight
                        className="size-4 shrink-0 text-accent transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        aria-hidden="true"
                      />
                    </span>
                    <span className="text-sm leading-relaxed text-muted-foreground">{item.summary}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {industries.length > 0 && (
          <div className="flex flex-col gap-6 lg:col-span-4 lg:col-start-9">
            <MonoLabel as="h2">Sectors it matters in</MonoLabel>
            <ul className="grid grid-cols-2 gap-px border border-border bg-border">
              {industries.map((industry) => (
                <li key={industry.id}>
                  <Link
                    href={`/industries/${industry.slug}`}
                    className="flex h-full flex-col gap-3 bg-background p-5 transition-colors hover:bg-background-elevated focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                  >
                    <IndustryIcon slug={industry.slug} className="size-5 text-accent" aria-hidden="true" />
                    <span className="text-sm leading-snug font-medium text-foreground">{industry.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Container>
    </section>
  );
}
