import { Container } from "@/components/ui/container";
import { TracingBeam, TracingBeamItem } from "@/components/ui/tracing-beam";
import { MonoLabel } from "@/components/sections/home/MonoLabel";
import type { StageSequenceCopy } from "@/lib/types";

/**
 * The validation protocol as a scroll-traced vertical sequence.
 *
 * This page is about a process that happens in order and takes time, so the
 * beam filling as the reader descends is the content, not decoration: you
 * cannot skip a stage, and the page does not let you skip one either.
 *
 * It is also the one shape used nowhere else on the site. Every capability
 * page carries a different centrepiece so the set does not read as a template
 * with the words swapped out.
 */
export function StageBeam({ copy, surface = "light" }: { copy: StageSequenceCopy; surface?: "light" | "dark" }) {
  if (copy.stages.length === 0) return null;

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

        <TracingBeam>
          <ol className="flex flex-col">
            {copy.stages.map((stage, index) => (
              <li key={stage.step}>
                <TracingBeamItem align={index % 2 === 0 ? "left" : "right"}>
                  <div className="grid gap-6 lg:grid-cols-12 lg:gap-10">
                    <div className="flex flex-col gap-3 lg:col-span-5">
                      <span className="font-mono text-[11px] tracking-[0.24em] text-accent tabular-nums">
                        Stage {stage.step}
                      </span>
                      <h3 className="text-[clamp(1.35rem,2.4vw,1.85rem)] leading-[1.15] font-semibold tracking-[-0.025em] text-foreground">
                        {stage.title}
                      </h3>
                    </div>
                    <div className="flex flex-col gap-5 lg:col-span-7">
                      <p className="text-base leading-relaxed text-pretty text-muted-foreground">{stage.description}</p>
                      {stage.requires && (
                        <div className="flex flex-col gap-2 border-l-2 border-accent pl-5">
                          <span className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
                            What we need from you
                          </span>
                          <span className="text-sm leading-relaxed text-foreground">{stage.requires}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </TracingBeamItem>
              </li>
            ))}
          </ol>
        </TracingBeam>
      </Container>
    </section>
  );
}
