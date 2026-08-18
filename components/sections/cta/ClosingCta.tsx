import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export function ClosingCta() {
  return (
    <section className="relative overflow-hidden border-t border-border/60 bg-foreground py-20 sm:py-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 60% at 50% 0%, rgba(var(--color-accent-rgb),0.18), transparent 70%)",
        }}
      />
      <Container className="relative flex flex-col items-center gap-6 text-center">
        <h2 className="max-w-2xl text-3xl font-light text-background sm:text-4xl">
          Send us the component. We&rsquo;ll tell you what finish it needs.
        </h2>
        <p className="max-w-lg text-sm text-background/70 sm:text-base">
          Share your drawing, tolerance and volume, our engineers respond with a treatment
          recommendation, not a sales script.
        </p>
        <Button asChild variant="inverse" size="lg" className="bg-background text-foreground px-8 hover:opacity-90">
          <Link href="/request-a-quote">Request a Quote</Link>
        </Button>
      </Container>
    </section>
  );
}
