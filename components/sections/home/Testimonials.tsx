import { Container } from "@/components/ui/container";
import type { TeaserCopy, TestimonialDoc, WithId } from "@/lib/types";
import { EmphasisHeading } from "./EmphasisHeading";
import { MonoLabel } from "./MonoLabel";
import { StackedTestimonials, type StackedTestimonial } from "./StackedTestimonials";

const FALLBACK: TeaserCopy = {
  eyebrow: "Customer stories",
  heading: "What quality teams say.",
};

/**
 * Light testimonial band for the bottom of the home page (below news):
 * centered header in the section voice, then the stacked flipping-card
 * deck (dark premium cards for contrast against the white band). Hidden
 * entirely when there is nothing published to show. Imagery flows from each
 * testimonial's own logo; the stack falls back to initials avatars.
 */
export function Testimonials({ copy, testimonials }: { copy: TeaserCopy | null; testimonials: WithId<TestimonialDoc>[] }) {
  if (testimonials.length === 0) return null;
  const { eyebrow, heading } = { ...FALLBACK, ...(copy ?? {}) };

  const items: StackedTestimonial[] = testimonials.map((testimonial) => ({
    id: testimonial.id,
    quote: testimonial.quote,
    personName: testimonial.personName,
    designation: testimonial.designation,
    company: testimonial.company,
    logoUrl: testimonial.logoUrl ?? "",
  }));

  return (
    <section data-surface="light" className="bg-background py-24 sm:py-32">
      <Container className="flex flex-col items-center gap-12 text-center lg:gap-14">
        <div className="flex max-w-3xl flex-col items-center gap-6">
          <MonoLabel>{eyebrow}</MonoLabel>
          <h2 className="text-[clamp(2.25rem,5vw,4.5rem)] leading-[0.98] font-semibold tracking-[-0.04em] text-balance text-foreground">
            <EmphasisHeading text={heading} />
          </h2>
        </div>

        <StackedTestimonials items={items} />
      </Container>
    </section>
  );
}
