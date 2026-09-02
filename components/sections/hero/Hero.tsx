import { Container } from "@/components/ui/container";
import { PrecisionMark } from "@/components/sections/shared/PrecisionMark";
import { HeroContent } from "./HeroContent";
import { HeroShowcase } from "./HeroShowcase";
import type { HeroCopy, IndustryDoc, WithId } from "@/lib/types";

export function Hero({ copy, industries }: { copy: HeroCopy | null; industries: WithId<IndustryDoc>[] }) {
  return (
    <section className="relative flex min-h-[80vh] flex-col overflow-hidden bg-background pt-16 pb-16 sm:min-h-[85vh]">
      <PrecisionMark className="pointer-events-none absolute -top-16 -right-16 h-[460px] w-[460px] text-foreground opacity-[0.14] sm:h-[560px] sm:w-[560px]" />
      <Container className="relative z-10 flex flex-1 flex-col justify-center gap-16">
        <HeroContent copy={copy} />
        <HeroShowcase industries={industries} />
      </Container>
    </section>
  );
}
