import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { MonoLabel } from "@/components/sections/home/MonoLabel";

/**
 * The roughness scale, drawn to scale.
 *
 * Engineers arrive at this page holding a number off a drawing, so the job is
 * to let them find their own value and see what it means. A table of grades
 * would do that; a logarithmic scale does it better, because the distance
 * between as-machined and mirror is the actual argument, and on a linear axis
 * or in a list that distance is invisible.
 *
 * Positions are computed from the Ra values themselves rather than hand-placed,
 * so the drawing cannot drift out of step with the numbers beside it.
 */

interface Grade {
  name: string;
  raFrom: number;
  raTo: number;
  note: string;
  mmp?: boolean;
}

const GRADES: Grade[] = [
  { name: "As machined", raFrom: 3.2, raTo: 1.6, note: "The condition most components arrive in" },
  { name: "Fine ground", raFrom: 0.8, raTo: 0.4, note: "Conventional grinding, still directional" },
  { name: "Superfinished", raFrom: 0.2, raTo: 0.1, note: "Where MMP typically starts", mmp: true },
  { name: "Mirror-like", raFrom: 0.05, raTo: 0.02, note: "Optically reflective, non-directional", mmp: true },
];

const MIN = 0.01;
const MAX = 5;
const TICKS = [5, 1, 0.1, 0.02];

/** Log position, 0 at the roughest end of the scale and 1 at the smoothest. */
function pos(ra: number): number {
  const t = (Math.log10(MAX) - Math.log10(ra)) / (Math.log10(MAX) - Math.log10(MIN));
  return Math.min(1, Math.max(0, t)) * 100;
}

const micronsToMicroinches = (ra: number) => Math.round(ra * 39.37 * 10) / 10;

export function GradeLadder({ heading, body }: { heading: string; body: string }) {
  return (
    <section data-surface="light" className="bg-background py-24 sm:py-32">
      <Container className="flex flex-col gap-14">
        <div className="flex max-w-2xl flex-col gap-5">
          <MonoLabel>The scale</MonoLabel>
          <h2 className="text-[clamp(1.9rem,4vw,3.25rem)] leading-[1.05] font-semibold tracking-[-0.035em] text-balance text-foreground">
            {heading}
          </h2>
          <p className="text-base leading-relaxed text-pretty text-muted-foreground sm:text-lg">{body}</p>
        </div>

        <div className="flex flex-col gap-8">
          {/* Axis */}
          <div className="relative hidden h-8 sm:block" aria-hidden="true">
            <div className="absolute inset-x-0 top-1/2 h-px bg-border" />
            {TICKS.map((tick) => (
              <div key={tick} className="absolute top-0 flex flex-col items-center gap-1" style={{ left: `${pos(tick)}%` }}>
                <span className="h-3 w-px bg-border" />
                <span className="font-mono text-[10px] tracking-[0.12em] text-muted-foreground tabular-nums">
                  {tick} µm
                </span>
              </div>
            ))}
          </div>

          <ul className="flex flex-col gap-4">
            {GRADES.map((grade, index) => {
              const from = pos(grade.raFrom);
              const to = pos(grade.raTo);
              return (
                <Reveal key={grade.name} delay={index * 0.08}>
                  <li className="grid items-center gap-4 sm:grid-cols-12 sm:gap-6">
                    <div className="flex flex-col gap-1 sm:col-span-3">
                      <span
                        className={
                          grade.mmp
                            ? "text-base leading-snug font-semibold text-foreground"
                            : "text-base leading-snug font-medium text-muted-foreground"
                        }
                      >
                        {grade.name}
                      </span>
                      <span className="font-mono text-[11px] text-muted-foreground tabular-nums">
                        {grade.raFrom} to {grade.raTo} µm ({micronsToMicroinches(grade.raFrom)} to{" "}
                        {micronsToMicroinches(grade.raTo)} µin)
                      </span>
                    </div>

                    <div className="relative hidden h-10 sm:col-span-5 sm:block" aria-hidden="true">
                      <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-border/60" />
                      <div
                        className={
                          grade.mmp
                            ? "absolute top-1/2 h-2.5 -translate-y-1/2 rounded-full bg-accent"
                            : "absolute top-1/2 h-2.5 -translate-y-1/2 rounded-full bg-muted-foreground/35"
                        }
                        style={{ left: `${from}%`, width: `${Math.max(1.5, to - from)}%` }}
                      />
                    </div>

                    <p className="text-sm leading-relaxed text-muted-foreground sm:col-span-4">{grade.note}</p>
                  </li>
                </Reveal>
              );
            })}
          </ul>

          <p className="flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-border pt-5 font-mono text-[10px] tracking-[0.16em] text-muted-foreground uppercase">
            <span className="flex items-center gap-2">
              <span aria-hidden="true" className="h-2.5 w-6 rounded-full bg-accent" />
              Reached by MMP
            </span>
            <span>Logarithmic scale. Ra per ISO 4287.</span>
          </p>
        </div>
      </Container>
    </section>
  );
}
