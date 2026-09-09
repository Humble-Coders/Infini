import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { BlurText } from "@/components/ui/blur-text";
import { MonoLabel } from "@/components/sections/home/MonoLabel";

/**
 * The one sentence the page exists to land, given a full band and nothing to
 * compete with.
 *
 * Every credible site in this category has a moment like this: a single line
 * that shows the writer understands the physics rather than the marketing. It
 * gets the largest type on the page and the most air, which is why the band is
 * mostly empty by design.
 */
export function MechanismStatement({ label, heading, body }: { label: string; heading: string; body: string }) {
  return (
    <section data-surface="light" className="bg-background py-24 sm:py-32 lg:py-40">
      <Container className="grid gap-10 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-3 lg:pt-4">
          <MonoLabel>{label}</MonoLabel>
        </div>
        <div className="flex flex-col gap-10 lg:col-span-9">
          <h2 className="text-[clamp(1.9rem,4.4vw,4rem)] leading-[1.05] font-medium tracking-[-0.035em] text-balance text-foreground">
            <BlurText text={heading} accentLast />
          </h2>
          <Reveal delay={0.15}>
            <p className="max-w-2xl text-base leading-relaxed text-pretty text-muted-foreground sm:text-lg">{body}</p>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
