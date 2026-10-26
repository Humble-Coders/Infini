// Facility label comes from INFINI_CONTACT (Treatment & validation labs) or live settings.
import type { Metadata } from "next";
import { ContactPanel } from "@/components/sections/home/ContactPanel";
import { Container } from "@/components/ui/container";
import { getPage, getSection } from "@/lib/data/pages";
import { getPublishedIndustries } from "@/lib/data/industries";
import { getSettings } from "@/lib/data/settings";
import { INFINI_CONTACT } from "@/lib/constants/contact";
import { canonicalUrl, ogTitle, pageTitle } from "@/lib/seo";
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
  // Also re-exported by /request-a-quote, which is the same page: both declare
  // /contact as canonical so search engines index one URL, not two.
  alternates: { canonical: canonicalUrl("/contact") },
};

export default async function ContactPage() {
  const [page, industries, settings] = await Promise.all([
    getPage("home"), // Reusing home page content for the contact teaser
    getPublishedIndustries(),
    getSettings(),
  ]);

  const contactTeaser = getSection<TeaserCopy>(page, "contactTeaser");
  const contact = settings?.contact ?? INFINI_CONTACT;
  const mapSrc =
    contact.googleMapsUrl ||
    "https://maps.google.com/maps?q=1%20Taksal%20Road%2C%20Parwanoo%2C%20Himachal%20Pradesh%20173220&z=14&output=embed";

  return (
    <main className="min-h-screen bg-background">
      <ContactPanel
        copy={contactTeaser}
        contact={contact}
        industries={industries}
        headingLevel="h1"
        compact
      />

      {/* Google Map of the INFINI facility in Parwanoo, India. */}
      <section aria-label="Our facility on the map" className="bg-background pb-20 sm:pb-24">
        <Container>
          <div className="overflow-hidden rounded-3xl border border-border bg-card">
            <iframe
              title={`INFINI facility on the map: ${contact.address}`}
              src={mapSrc}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              // Google's embed can't take a custom map style, so the dark look is a
              // filter: inverting the tiles makes them dark, and rotating the hue
              // 180deg turns the inverted colours (red pin, blue water) back to their own.
              className="block h-[380px] w-full border-0 [filter:invert(0.9)_hue-rotate(180deg)_brightness(0.95)_contrast(0.9)] sm:h-[460px]"
            />
          </div>
        </Container>
      </section>
    </main>
  );
}
