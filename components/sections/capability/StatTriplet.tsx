import { Container } from "@/components/ui/container";
import { CountUp } from "@/components/ui/count-up";
import { Reveal } from "@/components/ui/reveal";
import { MonoLabel } from "@/components/sections/home/MonoLabel";
import type { StatTripletCopy } from "@/lib/types";

/**
 * Splits a figure like "0.02" or "100%" into a countable number plus its
 * affixes. Non-numeric figures ("ISO 9001", "Lower") return null and render as
 * plain text, the same rule the homepage proof band uses.
 */
function parse(value: string): { value: number; decimals: number; prefix: string; suffix: string } | null {
  const match = value.match(/^([^\d.-]*)(-?[\d.]+)(.*)$/);
  if (!match) return null;
  const [, prefix, digits, suffix] = match;
  const parsed = Number(digits);
  if (!Number.isFinite(parsed)) return null;
  return { value: parsed, decimals: (digits.split(".")[1] ?? "").length, prefix, suffix };
}

/**
 * The capability triplet: part envelope, measured roughness, third-party
 * outcome. Those three answer, in order, "will you take my part", "how good is
 * the result" and "why should I believe you".
 *
 * Numeric figures count up as they come into view, the same treatment the
 * homepage gives its proof numbers, so the two pages read as one site.
 */
export function StatTriplet({ copy, surface = "dark" }: { copy: StatTripletCopy; surface?: "light" | "dark" }) {
  if (copy.figures.length === 0) return null;

  return (
    <section
      {...(surface === "light" ? { "data-surface": "light" } : {})}
      className="border-y border-border bg-background-elevated py-20 sm:py-24"
    >
      <Container className="flex flex-col gap-12">
        {copy.heading && (
          <Reveal className="flex flex-col gap-5">
            <MonoLabel>Evidence</MonoLabel>
            <h2 className="max-w-2xl text-[clamp(1.6rem,3.2vw,2.5rem)] leading-[1.08] font-semibold tracking-[-0.035em] text-balance text-foreground">
              {copy.heading}
            </h2>
          </Reveal>
        )}
        <dl className="grid gap-10 sm:grid-cols-3 sm:gap-8">
          {copy.figures.map((figure, index) => {
            const parsed = parse(figure.value);
            return (
              <Reveal key={figure.label} delay={index * 0.08}>
                <div className="flex flex-col gap-3 border-t border-border pt-6">
                  <dt className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
                    {figure.label}
                  </dt>
                  <dd className="flex flex-col gap-2">
                    <span className="flex items-baseline gap-1.5">
                      <span className="text-[clamp(2.25rem,5vw,3.5rem)] leading-[0.95] font-semibold tracking-[-0.045em] tabular-nums text-foreground">
                        {parsed ? (
                          <CountUp
                            value={parsed.value}
                            decimals={parsed.decimals}
                            prefix={parsed.prefix}
                            suffix={parsed.suffix}
                          />
                        ) : (
                          figure.value
                        )}
                      </span>
                      {figure.unit && <span className="font-mono text-sm text-accent">{figure.unit}</span>}
                    </span>
                    {figure.detail && (
                      <span className="max-w-xs text-sm leading-relaxed text-muted-foreground">{figure.detail}</span>
                    )}
                  </dd>
                </div>
              </Reveal>
            );
          })}
        </dl>
      </Container>
    </section>
  );
}
