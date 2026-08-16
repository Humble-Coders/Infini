import { Container } from "@/components/ui/container";
import { SectionBackground } from "@/components/sections/shared/SectionBackground";
import type { TechnologyStep } from "@/lib/types";

interface TechnologyCopy {
  eyebrow: string;
  heading: string;
  body: string;
  steps: TechnologyStep[];
}

export function TechnologySection({ copy }: { copy: TechnologyCopy }) {
  return (
    <section className="relative overflow-hidden border-t border-border/60 bg-background py-20 sm:py-28">
      <SectionBackground />
      <Container className="relative flex flex-col gap-14">
        <div className="flex max-w-2xl flex-col gap-4">
          <span className="text-xs font-medium tracking-[0.2em] text-accent uppercase">{copy.eyebrow}</span>
          <h2 className="text-2xl font-light text-foreground sm:text-3xl">{copy.heading}</h2>
          <p className="text-sm text-muted-foreground sm:text-base">{copy.body}</p>
        </div>

        <ol className="grid gap-8 sm:grid-cols-3">
          {copy.steps.map((item) => (
            <li key={item.step} className="flex flex-col gap-3 border-t border-border pt-6">
              <span className="text-xs font-medium tracking-[0.2em] text-muted-foreground">{item.step}</span>
              <h3 className="text-lg font-normal text-foreground">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
