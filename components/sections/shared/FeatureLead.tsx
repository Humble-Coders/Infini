import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Reveal } from "@/components/ui/reveal";

/**
 * The lead item of an index, given the space a magazine gives its cover story.
 *
 * An index page whose newest item sits in the same card as its oldest tells the
 * reader nothing about what to open first. This block answers that: one item
 * runs full width with its photography and an oversized title, and the rest of
 * the index stays dense below it.
 *
 * The meta rail carries the values a reader actually sorts on, so the block is
 * navigation rather than decoration.
 */
export function FeatureLead({
  eyebrow,
  index,
  title,
  excerpt,
  href,
  image,
  imageAlt,
  meta = [],
  tags = [],
  linkLabel = "Read the note",
  surface = "dark",
}: {
  eyebrow: string;
  index?: number;
  title: string;
  excerpt?: string;
  href: string;
  image?: string;
  imageAlt?: string;
  /** Label/value pairs for the rail under the title. */
  meta?: { label: string; value: string }[];
  tags?: string[];
  linkLabel?: string;
  surface?: "light" | "dark";
}) {
  return (
    <section
      {...(surface === "light" ? { "data-surface": "light" } : {})}
      className="bg-background py-16 sm:py-20"
    >
      <Container className="flex flex-col gap-10">
        <div className="flex items-center justify-between gap-6 border-b border-border pb-6">
          <Eyebrow index={index}>{eyebrow}</Eyebrow>
          <span className="font-mono text-[10px] tracking-[0.18em] text-muted-foreground uppercase">
            Most recent
          </span>
        </div>

        <Reveal>
          <Link href={href} className="group grid gap-8 lg:grid-cols-12 lg:gap-12">
            {image && (
              <div className="relative aspect-[16/10] overflow-hidden border border-border bg-background-elevated lg:col-span-7 lg:aspect-[4/3]">
                <Image
                  src={image}
                  alt={imageAlt ?? title}
                  fill
                  sizes="(min-width: 1024px) 58vw, 100vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                />
              </div>
            )}

            <div className="flex flex-col justify-between gap-8 lg:col-span-5">
              <div className="flex flex-col gap-5">
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="border border-border px-2.5 py-1 font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                <h2 className="text-[clamp(1.75rem,3.4vw,2.75rem)] leading-[1.03] font-semibold tracking-[-0.04em] text-balance text-foreground">
                  {title}
                </h2>
                {excerpt && (
                  <p className="text-base leading-relaxed text-pretty text-muted-foreground">{excerpt}</p>
                )}
              </div>

              <div className="flex flex-col gap-6">
                {meta.length > 0 && (
                  <dl className="grid grid-cols-2 gap-x-6 gap-y-4 border-t border-border pt-6">
                    {meta.map((entry) => (
                      <div key={entry.label} className="flex flex-col gap-1">
                        <dt className="font-mono text-[10px] tracking-[0.16em] text-muted-foreground uppercase">
                          {entry.label}
                        </dt>
                        <dd className="text-sm font-medium text-foreground">{entry.value}</dd>
                      </div>
                    ))}
                  </dl>
                )}
                <span className="flex items-center gap-2 font-mono text-[11px] tracking-[0.18em] text-accent uppercase">
                  {linkLabel}
                  <ArrowUpRight
                    className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden="true"
                  />
                </span>
              </div>
            </div>
          </Link>
        </Reveal>
      </Container>
    </section>
  );
}
