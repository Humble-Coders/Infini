import Image from "next/image";
import { Container } from "@/components/ui/container";
import type { TeaserCopy, TestimonialDoc, WithId } from "@/lib/types";
import { EmphasisHeading } from "./EmphasisHeading";
import { MonoLabel } from "./MonoLabel";

const FALLBACK: TeaserCopy = {
  eyebrow: "Trusted by",
  heading: "What manufacturers say.",
};

/** Hidden entirely with no published testimonials — an empty box reads as a company with no customers. */
export function QuoteWall({ copy, testimonials }: { copy: TeaserCopy | null; testimonials: WithId<TestimonialDoc>[] }) {
  if (testimonials.length === 0) return null;
  const { eyebrow, heading } = { ...FALLBACK, ...(copy ?? {}) };

  return (
    <section className="bg-background py-24 sm:py-32">
      <Container className="flex flex-col gap-12 lg:gap-16">
        <div className="flex flex-col gap-6">
          <MonoLabel>{eyebrow}</MonoLabel>
          <h2 className="text-[clamp(2.25rem,5vw,4.5rem)] leading-[0.98] font-semibold tracking-[-0.04em] text-balance text-foreground">
            <EmphasisHeading text={heading} />
          </h2>
        </div>

        <ul className="grid gap-6 lg:grid-cols-2">
          {testimonials.map((testimonial) => (
            <li key={testimonial.id}>
              <figure className="flex h-full flex-col gap-10 rounded-2xl border border-border p-8 sm:p-10">
                <blockquote className="relative text-xl leading-snug font-medium tracking-[-0.01em] text-foreground sm:text-2xl">
                  <span aria-hidden="true" className="absolute -top-4 -left-1 font-serif text-5xl leading-none text-accent">
                    &ldquo;
                  </span>
                  {testimonial.quote}
                </blockquote>
                <figcaption className="mt-auto flex items-center gap-4">
                  {testimonial.logoUrl && (
                    <span className="flex h-8 w-16 shrink-0 items-center justify-center">
                      <Image
                        src={testimonial.logoUrl}
                        alt={`${testimonial.company} logo`}
                        width={64}
                        height={32}
                        className="max-h-8 w-auto object-contain"
                      />
                    </span>
                  )}
                  <span className="flex flex-col gap-0.5">
                    <span className="text-sm font-medium text-foreground">{testimonial.personName}</span>
                    <span className="font-mono text-[11px] tracking-[0.12em] text-muted-foreground uppercase">
                      {testimonial.designation} · {testimonial.company}
                    </span>
                  </span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
