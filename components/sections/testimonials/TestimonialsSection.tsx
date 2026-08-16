import { Container } from "@/components/ui/container";
import { SectionBackground } from "@/components/sections/shared/SectionBackground";
import { TestimonialCard } from "@/components/testimonials/TestimonialCard";
import type { TeaserCopy, TestimonialDoc, WithId } from "@/lib/types";

/** Hides entirely with zero published testimonials — an empty box here reads as a company with no customers, worse than not showing the section at all (T15 acceptance criterion). */
export function TestimonialsSection({ copy, testimonials }: { copy: TeaserCopy; testimonials: WithId<TestimonialDoc>[] }) {
  if (testimonials.length === 0) return null;

  return (
    <section className="relative overflow-hidden border-t border-border/60 bg-background py-20 sm:py-28">
      <SectionBackground />
      <Container className="relative flex flex-col gap-10">
        <div className="flex max-w-2xl flex-col gap-4">
          <span className="text-xs font-medium tracking-[0.2em] text-accent uppercase">{copy.eyebrow}</span>
          <h2 className="text-2xl font-light text-foreground sm:text-3xl">{copy.heading}</h2>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
      </Container>
    </section>
  );
}
