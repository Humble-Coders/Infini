import { Container } from "@/components/ui/container";
import { HeroContent } from "./HeroContent";
import { HeroShowcase } from "./HeroShowcase";

export function Hero() {
  return (
    <section className="relative flex min-h-[80vh] flex-col overflow-hidden bg-background pt-16 pb-16 sm:min-h-[85vh]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 60% at 50% 0%, rgba(var(--color-accent-rgb),0.16), transparent 60%), radial-gradient(80% 50% at 50% 100%, rgba(var(--color-accent-rgb),0.10), transparent 70%), linear-gradient(180deg, var(--color-background) 0%, var(--color-background-elevated) 55%, var(--color-background) 100%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, rgba(var(--color-foreground-rgb),0.6) 0px, rgba(var(--color-foreground-rgb),0.6) 1px, transparent 1px, transparent 64px)",
        }}
      />

      <Container className="relative z-10 flex flex-1 flex-col justify-center gap-16">
        <HeroContent />
        <HeroShowcase />
      </Container>
    </section>
  );
}
