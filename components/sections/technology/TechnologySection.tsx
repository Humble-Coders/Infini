import { Container } from "@/components/ui/container";
import { SectionBackground } from "@/components/sections/shared/SectionBackground";
import { technologySectionCopy, technologySteps } from "@/data/technology";

export function TechnologySection() {
  return (
    <section className="relative overflow-hidden border-t border-border/60 bg-background py-20 sm:py-28">
      <SectionBackground />
      <Container className="relative flex flex-col gap-14">
        <div className="flex max-w-2xl flex-col gap-4">
          <span className="text-xs font-medium tracking-[0.2em] text-accent uppercase">
            {technologySectionCopy.eyebrow}
          </span>
          <h2 className="text-2xl font-light text-foreground sm:text-3xl">{technologySectionCopy.heading}</h2>
          <p className="text-sm text-muted-foreground sm:text-base">{technologySectionCopy.body}</p>
        </div>

        <ol className="grid gap-8 sm:grid-cols-3">
          {technologySteps.map((item) => (
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
