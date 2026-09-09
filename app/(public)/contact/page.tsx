import type { Metadata } from "next";
import { ContactPanel } from "@/components/sections/home/ContactPanel";
import { getPage, getSection } from "@/lib/data/pages";
import { getPublishedIndustries } from "@/lib/data/industries";
import { getSettings } from "@/lib/data/settings";
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
  const [page, industries, settings] = await Promise.all([
    getPage("home"), // Reusing home page content for the contact teaser
    getPublishedIndustries(),
    getSettings(),
  ]);

  const contactTeaser = getSection<TeaserCopy>(page, "contactTeaser");

  return (
    <main className="min-h-screen bg-background">
      <ContactPanel
        copy={contactTeaser}
        contact={settings?.contact ?? null}
        industries={industries}
        headingLevel="h1"
        compact
      />
    </main>
  );
}
