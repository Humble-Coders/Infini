// Facility label comes from INFINI_CONTACT (Treatment & validation labs).
import type { Metadata } from "next";
import { ContactPanel } from "@/components/sections/home/ContactPanel";
import { Container } from "@/components/ui/container";
import { getPage, getSection } from "@/lib/data/pages";
import { getPublishedIndustries } from "@/lib/data/industries";
import { INFINI_CONTACT } from "@/lib/constants/contact";
import { ogTitle, pageTitle } from "@/lib/seo";
import type { TeaserCopy } from "@/lib/types";


/*
 * ISR window. Without this the route re-renders and re-reads Firestore on
 * every request, so returning to a page costs the same round trips as
 * arriving the first time. Publishing should still revalidate the path for
 * an immediate update; this is the floor, not the mechanism.
 */
export const revalidate = 600;

const COPY = {
  title: "Contact Us",
  description: "Get in touch with INFINI engineers for your surface finishing requirements.",
};

export const metadata: Metadata = {
  title: pageTitle(COPY.title),
  description: COPY.description,
  // Without its own openGraph block this page inherited the root layout's,
  // so sharing /contact or /request-a-quote surfaced the home page's title.
  openGraph: { title: ogTitle(COPY.title), description: COPY.description, type: "website" },
};

export default async function ContactPage() {
  const [page, industries] = await Promise.all([
    getPage("home"), // Reusing home page content for the contact teaser
    getPublishedIndustries(),
  ]);

  const contactTeaser = getSection<TeaserCopy>(page, "contactTeaser");

  return (
    <main className="min-h-screen bg-background">
      <ContactPanel
        copy={contactTeaser}
        contact={INFINI_CONTACT}
        industries={industries}
        headingLevel="h1"
        compact
      />

      {/* Google Map of the INFINI facility in Parwanoo, India. */}
      <section aria-label="Our facility on the map" className="bg-background pb-20 sm:pb-24">
        <Container>
          <div className="overflow-hidden rounded-3xl border border-border">
            <iframe
              title="INFINI facility, 1 Taksal Road, Parwanoo, Himachal Pradesh, India"
              src="https://maps.google.com/maps?q=1%20Taksal%20Road%2C%20Parwanoo%2C%20Himachal%20Pradesh%20173220&z=14&output=embed"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="block h-[380px] w-full border-0 sm:h-[460px]"
            />
          </div>
        </Container>
      </section>
    </main>
  );
}
