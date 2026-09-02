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

export function TechnologySection({ copy }: { copy: TechnologyCopy }) {
  return (
    <section className="relative overflow-hidden border-t border-border/60 bg-background-elevated py-20 sm:py-28">
      <SectionBackground />
      <Container className="relative flex flex-col gap-14">
        <div className="flex max-w-2xl flex-col gap-4">
          <SectionEyebrow>{copy.eyebrow}</SectionEyebrow>
          <h2 className="text-2xl font-light text-foreground sm:text-3xl">{copy.heading}</h2>
          <p className="text-sm text-muted-foreground sm:text-base">{copy.body}</p>
        </div>

        <ol className="grid gap-6 sm:grid-cols-3">
          {copy.steps.map((item, index) => {
            const Icon = STEP_ICONS[index % STEP_ICONS.length];
            return (
              <li
                key={item.step}
                className="relative flex flex-col gap-4 overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-[0_10px_30px_-20px_rgba(var(--color-shadow-rgb),0.6)]"
              >
                <span className="absolute top-4 right-5 text-4xl font-light text-foreground/[0.06]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="relative flex size-12 items-center justify-center rounded-full border border-primary/40 bg-primary-muted text-primary">
                  <Icon className="size-5" strokeWidth={1.5} aria-hidden="true" />
                </span>
                <h3 className="relative text-lg font-normal text-foreground">{item.title}</h3>
                <p className="relative text-sm text-muted-foreground">{item.description}</p>
              </li>
            );
          })}
        </ol>
      </Container>
    </section>
  );
}
