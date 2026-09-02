import { Fragment } from "react";
import { ScanSearch, Sparkles, ShieldCheck } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionBackground } from "@/components/sections/shared/SectionBackground";
import { SectionEyebrow } from "@/components/sections/shared/SectionEyebrow";
import type { TechnologyStep } from "@/lib/types";

interface TechnologyCopy {
  eyebrow: string;
  heading: string;
  body: string;
  steps: TechnologyStep[];
}

// Fixed 3-step order (Validation, Treatment, Verification) per the MMP process — icons map by position.
const STEP_ICONS = [ScanSearch, Sparkles, ShieldCheck];

/** Wraps a standalone "not" in the heading so the mmp-industrial theme can emphasize it — a no-op on every other theme. */
function renderHeading(heading: string) {
  const parts = heading.split(/\b(not)\b/i);
  return parts.map((part, index) =>
    part.toLowerCase() === "not" ? (
      <em key={index} className="mmp-heading-emphasis">
        {part}
      </em>
    ) : (
      <Fragment key={index}>{part}</Fragment>
    )
  );
}

export function TechnologySection({ copy }: { copy: TechnologyCopy }) {
  return (
    <section className="mmp-process relative overflow-hidden border-t border-border/60 bg-background-elevated py-20 sm:py-28">
      <SectionBackground className="mmp-legacy-decor" />

      {/* Bespoke precision-engineering backdrop — inert everywhere except the mmp-industrial preview. */}
      <div className="mmp-decor pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-28 -right-28 h-[440px] w-[440px] rounded-full border border-[color:var(--mp-decor)]" />
        <div className="absolute -top-28 -right-28 h-[320px] w-[320px] translate-x-[60px] translate-y-[60px] rounded-full border border-[color:var(--mp-decor)]" />
        <div className="absolute -top-28 -right-28 h-[200px] w-[200px] translate-x-[120px] translate-y-[120px] rounded-full border border-[color:var(--mp-decor)]" />
        <span className="absolute top-[132px] right-[132px] size-2 rounded-full bg-[color:var(--mp-accent)]" />

        <div
          className="absolute top-[38%] right-0 h-56 w-56 opacity-70 [mask-image:linear-gradient(to_left,black,transparent)]"
          style={{ backgroundImage: "radial-gradient(var(--mp-decor) 1px, transparent 1px)", backgroundSize: "16px 16px" }}
        />

        <svg className="absolute top-[18%] right-[22%] h-24 w-24 text-[color:var(--mp-decor)]" viewBox="0 0 100 100" fill="none">
          <path d="M4 60 L60 4" stroke="currentColor" strokeWidth="1" />
          <path d="M60 4 L60 22 M60 4 L42 4" stroke="currentColor" strokeWidth="1" />
        </svg>

        <div className="absolute -bottom-32 -left-32 h-[380px] w-[380px] rounded-full border border-[color:var(--mp-decor)] opacity-60" />
        <div className="absolute -bottom-20 -left-20 h-[220px] w-[220px] rounded-full border border-[color:var(--mp-decor)] opacity-40" />
      </div>

      <Container className="mmp-content relative flex flex-col gap-14">
        <div className="mmp-heading-block flex max-w-2xl flex-col gap-4">
          <SectionEyebrow>{copy.eyebrow}</SectionEyebrow>
          <h2 className="mmp-heading text-2xl font-light text-foreground sm:text-3xl">{renderHeading(copy.heading)}</h2>
          <p className="mmp-body text-sm text-muted-foreground sm:text-base">{copy.body}</p>
        </div>

        <div className="mmp-cards-row relative flex flex-col gap-10 sm:flex-row sm:items-stretch sm:gap-0">
          {copy.steps.map((item, index) => {
            const Icon = STEP_ICONS[index % STEP_ICONS.length];
            const isLast = index === copy.steps.length - 1;
            return (
              <Fragment key={item.step}>
                <div className="mmp-card group relative flex flex-1 flex-col gap-4 overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-[0_10px_30px_-20px_rgba(var(--color-shadow-rgb),0.6)]">
                  <div className="flex items-start justify-between">
                    <span className="mmp-card-icon relative flex size-12 items-center justify-center rounded-full border border-primary/40 bg-primary-muted text-primary">
                      <Icon className="size-5" strokeWidth={1.5} aria-hidden="true" />
                    </span>
                    <span className="mmp-card-number text-4xl font-light text-foreground/[0.06]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="mmp-card-heading text-lg font-normal text-foreground">{item.title}</h3>
                    <span aria-hidden="true" className="mmp-card-underline h-px w-8 bg-transparent" />
                  </div>
                  <p className="mmp-card-body text-sm text-muted-foreground">{item.description}</p>
                </div>

                {!isLast && (
                  <div
                    className="mmp-connector relative shrink-0 items-center justify-center sm:w-14 lg:w-20"
                    aria-hidden="true"
                  >
                    <div className="absolute top-10 right-0 left-0 hidden h-px border-t-2 border-dotted border-[color:var(--mp-accent)] opacity-40 sm:block" />
                    <span className="absolute top-10 left-1/2 hidden size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[color:var(--mp-accent)] sm:block" />

                    <div className="mx-auto block h-8 w-px border-l-2 border-dotted border-[color:var(--mp-accent)] opacity-40 sm:hidden" />
                    <span className="absolute top-1/2 left-1/2 block size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[color:var(--mp-accent)] sm:hidden" />
                  </div>
                )}
              </Fragment>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
