import { Container } from "@/components/ui/container";
import { SectionBackground } from "@/components/sections/shared/SectionBackground";
import type { TeaserCopy, TestimonialDoc, WithId } from "@/lib/types";

export function TestimonialsSection({ copy, testimonials }: { copy: TeaserCopy; testimonials: WithId<TestimonialDoc>[] }) {
  return (
    <section className="relative overflow-hidden border-t border-border/60 bg-background py-20 sm:py-28">
      <SectionBackground />
      <Container className="relative flex flex-col gap-10">
        <div className="flex max-w-2xl flex-col gap-4">
          <span className="text-xs font-medium tracking-[0.2em] text-accent uppercase">{copy.eyebrow}</span>
          <h2 className="text-2xl font-light text-foreground sm:text-3xl">{copy.heading}</h2>
        </div>

        {testimonials.length === 0 ? (
          <div className="flex flex-col items-start gap-2 rounded-xl border border-dashed border-border px-6 py-10 sm:px-10">
            <p className="max-w-lg text-sm text-muted-foreground sm:text-base">{copy.emptyState}</p>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial) => (
              <figure key={testimonial.id} className="flex flex-col gap-4 rounded-xl border border-border p-6">
                <blockquote className="text-sm text-foreground/90">&ldquo;{testimonial.quote}&rdquo;</blockquote>
                <figcaption className="text-xs text-muted-foreground">
                  {testimonial.personName}, {testimonial.designation} — {testimonial.company}
                </figcaption>
              </figure>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
