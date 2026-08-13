export interface Testimonial {
  id: string;
  quote: string;
  personName: string;
  designation: string;
  company: string;
}

// Empty until content lands via T5 (data layer) + T15 (testimonials ticket).
// TestimonialsSection renders its designed empty state against this array.
export const testimonials: Testimonial[] = [];

export const testimonialsSectionCopy = {
  eyebrow: "Trusted By",
  heading: "What manufacturers say.",
  emptyState: "Client testimonials are being collected as projects complete — check back soon.",
};
