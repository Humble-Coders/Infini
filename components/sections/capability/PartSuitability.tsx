import { Check, Minus } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/components/ui/utils";
import type { SuitabilityCopy } from "@/lib/types";

/*
 * Advantages and limitations side by side, from INFINI's MMP brochure.
 *
 * Publishing where the process stops is deliberate. The brochure does it, and a
 * buyer who learns the limits here does not spend a trial finding them, which
 * is worth more to both sides than another superlative.
 */

export const FALLBACK_SUITABILITY: SuitabilityCopy = {
  eyebrow: "Is MMP right for your part?",
  heading: "What the process does well, and where it stops.",
  body: "Knowing the limits up front saves a trial that was never going to work. If you are not sure which side of the line your part sits on, send the drawing and we will tell you.",
  advantagesTitle: "Where it excels",
  advantages: [
    "Many parts finished in one batch, all to the same measured result.",
    "Complex shapes finished without losing their form.",
    "Any material, from tool steel and carbide to titanium, nickel alloys and coatings.",
    "No change to the part's composition or physical properties.",
    "Lower total cost than the finishing step it replaces.",
  ],
  limitationsTitle: "Where it stops",
  limitations: [
    "Deep scratches and form defects are not removed. They need correcting before treatment.",
    "Complex internal passages cannot be treated. The guidelines below show what can.",
    "Every part needs its own fixture, designed during validation.",
    "We treat parts as a service. MMP machines and consumables are not for sale.",
  ],
};

function Column({ title, items, tone }: { title: string; items: string[]; tone: "positive" | "limit" }) {
  const Icon = tone === "positive" ? Check : Minus;
  return (
    <div className="flex flex-col gap-6 bg-background p-6 sm:p-8">
      <h3 className="font-mono text-[11px] font-medium tracking-[0.2em] text-muted-foreground uppercase">{title}</h3>
      <ul className="flex flex-col gap-4">
        {items.map((item, index) => (
          <li key={item}>
            <Reveal delay={index * 0.05} className="flex items-start gap-3">
              <span
                aria-hidden="true"
                className={cn(
                  "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full",
                  tone === "positive" ? "bg-accent text-accent-foreground" : "border border-border text-muted-foreground"
                )}
              >
                <Icon className="size-3" strokeWidth={2.5} />
              </span>
              <span className="text-base leading-relaxed text-pretty text-foreground">{item}</span>
            </Reveal>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function PartSuitability({
  copy = FALLBACK_SUITABILITY,
  surface = "dark",
}: {
  copy?: SuitabilityCopy;
  surface?: "light" | "dark";
}) {
  return (
    <section
      {...(surface === "light" ? { "data-surface": "light" } : {})}
      className="bg-background py-20 sm:py-28"
    >
      <Container className="flex flex-col gap-12">
        <div className="flex max-w-2xl flex-col gap-5">
          {copy.eyebrow && <Eyebrow>{copy.eyebrow}</Eyebrow>}
          <h2 className="text-[clamp(1.75rem,3.6vw,2.75rem)] leading-[1.04] font-semibold tracking-[-0.04em] text-balance text-foreground">
            {copy.heading}
          </h2>
          {copy.body && (
            <p className="text-base leading-relaxed text-pretty text-muted-foreground sm:text-lg">{copy.body}</p>
          )}
        </div>

        <div className="grid gap-px border border-border bg-border md:grid-cols-2">
          <Column title={copy.advantagesTitle} items={copy.advantages} tone="positive" />
          <Column title={copy.limitationsTitle} items={copy.limitations} tone="limit" />
        </div>
      </Container>
    </section>
  );
}
