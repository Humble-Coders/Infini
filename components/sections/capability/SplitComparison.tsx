import { Check, Minus } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { MonoLabel } from "@/components/sections/home/MonoLabel";
import type { ComparisonCopy } from "@/lib/types";

/**
 * The same comparison data as ComparisonTable, drawn as two facing columns
 * instead of a grid.
 *
 * A table asks the reader to scan across; a split asks them to pick a side,
 * which is what someone weighing MMP against the finishing they already buy is
 * actually doing. The MMP column carries the accent rule and the tick, the
 * alternative is set quieter, and the criterion sits between them as a spine.
 */
export function SplitComparison({ copy, surface = "light" }: { copy: ComparisonCopy; surface?: "light" | "dark" }) {
  if (copy.rows.length === 0) return null;

  return (
    <section
      {...(surface === "light" ? { "data-surface": "light" } : {})}
      className="bg-background py-24 sm:py-32"
    >
      <Container className="flex flex-col gap-14">
        <div className="flex max-w-2xl flex-col gap-5">
          {copy.eyebrow && <MonoLabel>{copy.eyebrow}</MonoLabel>}
          <h2 className="text-[clamp(1.9rem,4vw,3.25rem)] leading-[1.05] font-semibold tracking-[-0.035em] text-balance text-foreground">
            {copy.heading}
          </h2>
          {copy.body && (
            <p className="text-base leading-relaxed text-pretty text-muted-foreground sm:text-lg">{copy.body}</p>
          )}
        </div>

        <div className="flex flex-col">
          <div className="hidden grid-cols-12 gap-8 border-b border-border pb-4 lg:grid">
            <span className="col-span-3 font-mono text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
              Criterion
            </span>
            <span className="col-span-5 font-mono text-[10px] tracking-[0.2em] text-accent uppercase">
              MMP treatment
            </span>
            <span className="col-span-4 font-mono text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
              {copy.alternativeLabel}
            </span>
          </div>

          <ul className="flex flex-col">
            {copy.rows.map((row, index) => (
              <Reveal key={row.criterion} delay={index * 0.06}>
                <li className="grid gap-5 border-b border-border py-8 lg:grid-cols-12 lg:gap-8">
                  <h3 className="text-base leading-snug font-semibold tracking-[-0.015em] text-foreground lg:col-span-3">
                    {row.criterion}
                  </h3>
                  <p className="flex items-start gap-3 text-sm leading-relaxed text-foreground lg:col-span-5">
                    <Check className="mt-0.5 size-4 shrink-0 text-accent" strokeWidth={2.5} aria-hidden="true" />
                    <span>
                      <span className="font-mono text-[10px] tracking-[0.18em] text-accent uppercase lg:hidden">
                        MMP
                      </span>
                      <span className="block">{row.mmp}</span>
                    </span>
                  </p>
                  <p className="flex items-start gap-3 text-sm leading-relaxed text-muted-foreground lg:col-span-4">
                    <Minus className="mt-0.5 size-4 shrink-0 opacity-60" strokeWidth={2.5} aria-hidden="true" />
                    <span>
                      <span className="font-mono text-[10px] tracking-[0.18em] uppercase lg:hidden">
                        {copy.alternativeLabel}
                      </span>
                      <span className="block">{row.alternative}</span>
                    </span>
                  </p>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
