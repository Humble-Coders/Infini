/** `testimonials` collection — social proof. */
export interface TestimonialDoc {
  quote: string;
  personName: string;
  designation: string;
  company: string;
  logoUrl: string;
  order: number;
  published: boolean;
}
