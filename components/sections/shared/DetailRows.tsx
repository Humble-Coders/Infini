import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Reveal } from "@/components/ui/reveal";

export interface DetailRow {
  label: string;
  detail: string;
  href?: string;
}

/**
 * Dense hairline rows: a large label on the left, its detail right-aligned,
 * an arrow if the row goes somewhere.
 *
 * This is the highest information-per-pixel block in the set, which is why it
 * exists. A page of headings and paragraphs reads as a document; a page with
 * one of these reads as a specification, and the right-hand column carries real
 * values rather than another sentence of prose.
 *
 * An optional image sits in the header beside the heading, which stops the
 * block reading as a plain table and ties it back to the work. It is placed
 * rather than floated: an image absolutely positioned over the list lands on
 * top of the first row's detail column whenever the header runs short.
 */
export function DetailRows({
  eyebrow,
  heading,
  body,
  rows,
  image,
  imageAlt,
  imageLabel,
  action,
  surface = "dark",
}: {
  eyebrow: string;
  heading: string;
  body?: string;
  rows: DetailRow[];
  image?: string;
  imageAlt?: string;
  imageLabel?: string;
  action?: { label: string; href: string };
  surface?: "light" | "dark";
}) {
  if (rows.length === 0) return null;

  return (
    <section
      {...(surface === "light" ? { "data-surface": "light" } : {})}
      className="relative bg-background py-20 sm:py-28"
    >
      <Container className="flex flex-col gap-10">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
          <div className="flex max-w-xl flex-col gap-5">
            <Eyebrow>{eyebrow}</Eyebrow>
            <h2 className="text-[clamp(1.75rem,3.6vw,2.75rem)] leading-[1.04] font-semibold tracking-[-0.04em] text-balance text-foreground">
              {heading}
            </h2>
            {body && <p className="text-base leading-relaxed text-pretty text-muted-foreground">{body}</p>}
          </div>

          {(image || action) && (
            <div className="flex shrink-0 items-end gap-6">
              {image && (
                <div className="hidden w-44 lg:block">
                  <div className="relative aspect-[4/3] overflow-hidden border border-border">
                    <Image src={image} alt={imageAlt ?? ""} fill sizes="176px" className="object-cover" />
                    {imageLabel && (
                      <span className="absolute inset-x-0 bottom-0 bg-background/80 px-2 py-1 text-center font-mono text-[9px] tracking-[0.16em] text-foreground uppercase backdrop-blur-sm">
                        {imageLabel}
                      </span>
                    )}
                  </div>
                </div>
              )}
              {action && (
                <Button asChild variant="outline" size="lg">
                  <Link href={action.href}>{action.label}</Link>
                </Button>
              )}
            </div>
          )}
        </div>

        <div>
          <ul className="flex flex-col border-t border-border">
            {rows.map((row, index) => {
              const inner = (
                <>
                  <span className="flex items-baseline gap-4 lg:col-span-4">
                    <span className="font-mono text-[10px] text-muted-foreground tabular-nums">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="text-[clamp(1.15rem,2.2vw,1.6rem)] leading-snug font-semibold tracking-[-0.025em] text-foreground">
                      {row.label}
                    </span>
                  </span>
                  <span className="text-sm leading-relaxed text-muted-foreground lg:col-span-7 lg:text-right">
                    {row.detail}
                  </span>
                  <span className="hidden justify-end lg:col-span-1 lg:flex">
                    {row.href && (
                      <ArrowRight
                        className="size-4 text-accent transition-transform group-hover:translate-x-1"
                        aria-hidden="true"
                      />
                    )}
                  </span>
                </>
              );

              return (
                <li key={row.label}>
                  <Reveal delay={index * 0.05}>
                    {row.href ? (
                      <Link
                        href={row.href}
                        className="group grid items-baseline gap-3 border-b border-border py-6 transition-colors hover:bg-background-elevated focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none lg:grid-cols-12 lg:gap-8 lg:py-7"
                      >
                        {inner}
                      </Link>
                    ) : (
                      <div className="grid items-baseline gap-3 border-b border-border py-6 lg:grid-cols-12 lg:gap-8 lg:py-7">
                        {inner}
                      </div>
                    )}
                  </Reveal>
                </li>
              );
            })}
          </ul>
        </div>
      </Container>
    </section>
  );
}
