import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/components/ui/utils";

export interface IndexRowItem {
  title: string;
  href: string;
  /** Right-hand value: a date, a reading time, a location. */
  meta?: string;
  /** Second line under the title. Kept to one line on wide screens. */
  summary?: string;
  tags?: string[];
  /** Thumbnail revealed on hover at the right edge on wide screens. */
  image?: string;
  imageAlt?: string;
}

/**
 * An index as a run of hairline rows rather than a grid of cards.
 *
 * A card grid spends most of its area on padding and gives every item the same
 * weight; rows put ten items in the height three cards would take, and the
 * numbered spine tells a reader how far down the list they are. The tag pills
 * are the filterable facts, so scanning the column is scanning the taxonomy.
 *
 * The hover thumbnail is the one flourish: imagery arrives on demand instead of
 * committing every row to a fixed aspect ratio.
 */
export function IndexRows({
  eyebrow,
  index,
  heading,
  body,
  items,
  startIndex = 1,
  surface = "dark",
}: {
  eyebrow?: string;
  index?: number;
  heading?: string;
  body?: string;
  items: IndexRowItem[];
  /** First row number. Continues a count that began in an earlier block. */
  startIndex?: number;
  surface?: "light" | "dark";
}) {
  if (items.length === 0) return null;

  return (
    <section
      {...(surface === "light" ? { "data-surface": "light" } : {})}
      className="bg-background py-16 sm:py-24"
    >
      <Container className="flex flex-col gap-10">
        {(eyebrow || heading) && (
          <div className="flex max-w-2xl flex-col gap-5">
            {eyebrow && <Eyebrow index={index}>{eyebrow}</Eyebrow>}
            {heading && (
              <h2 className="text-[clamp(1.6rem,3.2vw,2.5rem)] leading-[1.05] font-semibold tracking-[-0.04em] text-balance text-foreground">
                {heading}
              </h2>
            )}
            {body && <p className="text-base leading-relaxed text-pretty text-muted-foreground">{body}</p>}
          </div>
        )}

        <ul className="flex flex-col border-t border-border">
          {items.map((item, i) => (
            <li key={item.href}>
              <Reveal delay={Math.min(i, 6) * 0.05}>
                <Link
                  href={item.href}
                  className="group relative grid gap-3 border-b border-border py-6 transition-colors hover:bg-background-elevated focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none lg:grid-cols-12 lg:items-center lg:gap-8 lg:py-8"
                >
                  <span className="flex items-start gap-4 lg:col-span-7">
                    <span className="mt-1.5 font-mono text-[10px] tabular-nums text-accent">
                      {String(startIndex + i).padStart(2, "0")}
                    </span>
                    <span className="flex flex-col gap-2">
                      <span className="text-[clamp(1.1rem,2.1vw,1.5rem)] leading-snug font-semibold tracking-[-0.025em] text-foreground">
                        {item.title}
                      </span>
                      {item.summary && (
                        <span className="max-w-xl text-sm leading-relaxed text-muted-foreground lg:line-clamp-1">
                          {item.summary}
                        </span>
                      )}
                    </span>
                  </span>

                  <span className="flex flex-wrap items-center gap-2 lg:col-span-3">
                    {(item.tags ?? []).slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="border border-border px-2 py-0.5 font-mono text-[9px] tracking-[0.14em] text-muted-foreground uppercase"
                      >
                        {tag}
                      </span>
                    ))}
                  </span>

                  <span className="flex items-center justify-between gap-4 lg:col-span-2 lg:justify-end">
                    {item.meta && (
                      <span className="font-mono text-[10px] tracking-[0.12em] tabular-nums text-muted-foreground uppercase">
                        {item.meta}
                      </span>
                    )}
                    <ArrowUpRight
                      className="size-4 shrink-0 text-accent transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      aria-hidden="true"
                    />
                  </span>

                  {item.image && (
                    <span
                      aria-hidden="true"
                      className={cn(
                        "pointer-events-none absolute top-1/2 right-24 z-10 hidden w-44 -translate-y-1/2 overflow-hidden border border-border",
                        "opacity-0 transition-opacity duration-300 group-hover:opacity-100 xl:block"
                      )}
                    >
                      <span className="relative block aspect-[4/3]">
                        <Image src={item.image} alt="" fill sizes="176px" className="object-cover" />
                      </span>
                    </span>
                  )}
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
