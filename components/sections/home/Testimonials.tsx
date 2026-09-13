import { Container } from "@/components/ui/container";
import type { TeaserCopy, TestimonialDoc, WithId } from "@/lib/types";
import { EmphasisHeading } from "./EmphasisHeading";
import { MonoLabel } from "./MonoLabel";
import { TestimonialCarousel } from "./TestimonialCarousel";

const FALLBACK: TeaserCopy = {
  eyebrow: "Customer stories",
  heading: "What quality teams say.",
};

/**
 * Light testimonial band near the bottom of the home page: centered header
 * in the section voice, then the auto-advancing review carousel. Hidden
 * entirely when there is nothing published to show.
 */
export function Testimonials({ copy, testimonials }: { copy: TeaserCopy | null; testimonials: WithId<TestimonialDoc>[] }) {
  if (testimonials.length === 0) return null;
  const { eyebrow, heading } = { ...FALLBACK, ...(copy ?? {}) };

  return (
    <section data-surface="light" className="overflow-x-clip bg-background pt-10 sm:pt-14 pb-24 sm:pb-32">
      <Container className="flex flex-col items-center gap-12 text-center lg:gap-14">
        <div className="flex max-w-3xl flex-col items-center gap-6">
          <MonoLabel>{eyebrow}</MonoLabel>
          <h2 className="text-[clamp(2.25rem,5vw,4.5rem)] leading-[0.98] font-semibold tracking-[-0.04em] text-balance text-foreground">
            <EmphasisHeading text={heading} />
          </h2>
        </div>

        <TestimonialCarousel items={testimonials} />
      </Container>
    </section>
  );
}
