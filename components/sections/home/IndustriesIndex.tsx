import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import type { IndustryDoc, TeaserCopy, WithId } from "@/lib/types";
import { EmphasisHeading } from "./EmphasisHeading";
import { MonoLabel } from "./MonoLabel";

const NUMBER_WORDS = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten"];

const FALLBACK_BODY =
  "Working from its own treatment labs, INFINI is poised to provide manufacturers with custom finishes to meet their specifications.";

/**
 * Industries as an editorial index rather than a card grid: number, name,
 * the industry's own headline, and a single arrow. Every row is a real link
 * to its industry page. No imagery — until real photography exists this
 * reads far more credibly than placeholder photos would.
 */
export function IndustriesIndex({
  industries,
  copy,
}: {
  industries: WithId<IndustryDoc>[];
  copy: TeaserCopy | null;
}) {
  const count = industries.length;
  const countWord = NUMBER_WORDS[count] ?? String(count);
  const heading = `${countWord} industries.\nOne controlled process.`;

  return (
    <section id="industries" className="scroll-mt-20 bg-background py-24 sm:py-32 lg:py-40">
      <Container className="flex flex-col gap-14 lg:gap-20">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="flex flex-col gap-6 lg:col-span-6">
            <MonoLabel>{copy?.eyebrow ?? "Industries"}</MonoLabel>
            <h2 className="text-[clamp(2.5rem,6vw,5.5rem)] leading-[0.95] font-semibold tracking-[-0.045em] text-balance text-foreground">
              <EmphasisHeading text={heading} />
            </h2>
          </div>
          <p className="max-w-xl self-end text-base leading-relaxed text-pretty text-muted-foreground sm:text-lg lg:col-span-5 lg:col-start-8">
            {copy?.heading ?? FALLBACK_BODY}
          </p>
        </div>

        {count === 0 ? (
          <p className="rounded-2xl border border-dashed border-border px-6 py-10 text-sm text-muted-foreground">
            Industry pages are being published. Contact us to discuss your application directly.
          </p>
        ) : (
          <ol className="border-t border-border">
            {industries.map((industry, index) => (
              <li key={industry.id} className="border-b border-border">
                <Link
                  href={`/industries/${industry.slug}`}
                  className="group grid grid-cols-[2.5rem_1fr_auto] items-center gap-4 py-6 transition-colors duration-300 hover:bg-foreground/[0.035] focus-visible:bg-foreground/[0.035] focus-visible:outline-none sm:grid-cols-[3.5rem_minmax(0,1.1fr)_minmax(0,1fr)_auto] sm:gap-8 sm:py-8 lg:py-9"
                >
                  <span className="font-mono text-xs text-muted-foreground tabular-nums">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="text-2xl leading-[1.05] font-semibold tracking-[-0.03em] text-foreground transition-[transform,color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-2 group-hover:text-accent group-focus-visible:text-accent sm:text-4xl lg:text-5xl">
                    {industry.name}
                  </span>
                  <span className="hidden max-w-md text-sm leading-snug text-muted-foreground sm:block">
                    {industry.hero.headline}
                  </span>
                  <span
                    aria-hidden="true"
                    className="flex size-11 shrink-0 items-center justify-center rounded-full border border-border text-foreground transition-all duration-300 group-hover:border-accent group-hover:bg-accent group-hover:text-accent-foreground group-focus-visible:border-accent group-focus-visible:bg-accent group-focus-visible:text-accent-foreground"
                  >
                    <ArrowUpRight className="size-4" />
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        )}

        <Link
          href="/industries"
          className="group inline-flex w-fit items-center gap-3 font-mono text-[11px] tracking-[0.22em] text-foreground uppercase transition-colors hover:text-accent"
        >
          All industries
          <span aria-hidden="true" className="h-px w-8 bg-current transition-all duration-300 group-hover:w-12" />
        </Link>
      </Container>
    </section>
  );
}
