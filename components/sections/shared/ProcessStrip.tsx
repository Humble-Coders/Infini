import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/components/ui/utils";

export interface ProcessStage {
  /** Timing label above the stage, e.g. "1 to 2 days". This is the detail that makes the strip useful. */
  timing: string;
  step: string;
  title: string;
  points: string[];
}

/**
 * The four-stage process strip: timing above, stage title, then a tick list.
 *
 * The first stage is a filled card and the rest are open columns divided by
 * hairlines. That asymmetry is the point: it gives the row a starting place and
 * stops four identical boxes reading as a grid of nothing.
 *
 * The timing labels are what turn this from decoration into information. A
 * reader can price the whole engagement off this strip without contacting
 * anyone, which is exactly why it earns a band.
 */
export function ProcessStrip({
  eyebrow,
  heading,
  body,
  stages,
  surface = "light",
}: {
  eyebrow: string;
  heading: string;
  body?: string;
  stages: ProcessStage[];
  surface?: "light" | "dark";
}) {
  if (stages.length === 0) return null;

  return (
    <section
      {...(surface === "light" ? { "data-surface": "light" } : {})}
      className="bg-background py-20 sm:py-28"
    >
      <Container className="flex flex-col gap-12">
        <div className="flex max-w-2xl flex-col gap-5">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h2 className="text-[clamp(1.75rem,3.6vw,2.75rem)] leading-[1.04] font-semibold tracking-[-0.04em] text-balance text-foreground">
            {heading}
          </h2>
          {body && <p className="text-base leading-relaxed text-pretty text-muted-foreground">{body}</p>}
        </div>

        <ol className="grid gap-6 border-t border-border pt-8 md:grid-cols-2 lg:grid-cols-4 lg:gap-0">
          {stages.map((stage, index) => (
            <li key={stage.step}>
              <Reveal delay={index * 0.07}>
                <div
                  className={cn(
                    "flex h-full flex-col gap-4 p-6",
                    index === 0
                      ? "bg-foreground text-background"
                      : "lg:border-l lg:border-border"
                  )}
                >
                  <span
                    className={cn(
                      "font-mono text-[10px] tracking-[0.2em] uppercase",
                      index === 0 ? "text-background/60" : "text-muted-foreground"
                    )}
                  >
                    {stage.timing}
                  </span>
                  <h3
                    className={cn(
                      "flex items-baseline gap-2 text-lg leading-snug font-semibold tracking-[-0.02em]",
                      index === 0 ? "text-background" : "text-foreground"
                    )}
                  >
                    <span className={index === 0 ? "text-background/50" : "text-accent"}>{stage.step}</span>
                    {stage.title}
                  </h3>
                  <ul className="flex flex-col gap-2.5">
                    {stage.points.map((point) => (
                      <li
                        key={point}
                        className={cn(
                          "flex items-start gap-2.5 text-sm leading-relaxed",
                          index === 0 ? "text-background/80" : "text-muted-foreground"
                        )}
                      >
                        <span
                          aria-hidden="true"
                          className={cn(
                            "mt-2 h-px w-2.5 shrink-0",
                            index === 0 ? "bg-background/50" : "bg-accent"
                          )}
                        />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
