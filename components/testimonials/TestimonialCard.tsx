import Image from "next/image";
import type { TestimonialDoc, WithId } from "@/lib/types";

/** Reusable testimonial display — homepage today, available for any other page that wants social proof. Logo is fixed-size + object-contain so varying source dimensions never break the layout. */
export function TestimonialCard({ testimonial }: { testimonial: WithId<TestimonialDoc> }) {
  return (
    <figure className="flex flex-col gap-4 rounded-xl border border-border p-6">
      <blockquote className="text-sm text-foreground/90">&ldquo;{testimonial.quote}&rdquo;</blockquote>
      <figcaption className="mt-auto flex items-center gap-3">
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
        <span className="text-xs text-muted-foreground">
          {testimonial.personName}, {testimonial.designation} — {testimonial.company}
        </span>
      </figcaption>
    </figure>
  );
}
