import type { Metadata, Viewport } from "next";
import { Instrument_Serif, JetBrains_Mono, Manrope } from "next/font/google";
import type { ReactNode } from "react";
import { RouteCurtain } from "@/components/layout/RouteCurtain";
import { Toaster } from "sonner";
import { JsonLd, organizationJsonLd, webSiteJsonLd } from "@/components/seo/JsonLd";
import { getSettings } from "@/lib/data/settings";
import { siteUrl } from "@/lib/seo";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-sans-loaded",
  display: "swap",
});

/* Editorial accent face, one italic word per heading, nothing more. */
const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-serif-loaded",
  display: "swap",
});

/* Technical readouts, labels and data, the metrology voice of the brand. */
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono-loaded",
  display: "swap",
});

const SITE_NAME = "INFINI";
const FALLBACK_TITLE = `${SITE_NAME} | Precision Surface-Finishing`;
const FALLBACK_DESCRIPTION =
  "INFINI is a precision surface-finishing partner to manufacturers, applying ISO 9001-certified MMP treatment, validation through mirror-like finish.";

/**
 * Site-wide defaults from `settings/global.defaultSeo` (admin-editable),
 * which pages override with their own title/description/OG.
 *
 * Deliberately no `alternates.canonical` here: Next inherits it into every
 * route that doesn't set its own, so a root canonical of "/" told search
 * engines that /contact, /industries and the rest were duplicates of the home
 * page. Each page declares its own canonical instead. `defaultSeo.noindex` is
 * not applied site-wide for the same inheritance reason.
 */
export async function generateMetadata(): Promise<Metadata> {
  const { defaultSeo } = await getSettings();
  // Firestore data is untyped at runtime: a blank or missing field falls back.
  const text = (value: unknown) => (typeof value === "string" ? value.trim() : "");
  const title = text(defaultSeo.title) || FALLBACK_TITLE;
  const description = text(defaultSeo.description) || FALLBACK_DESCRIPTION;
  const ogImage = text(defaultSeo.ogImage);

  return {
    metadataBase: new URL(siteUrl()),
    title: { default: title, template: `%s | ${SITE_NAME}` },
    description,
    openGraph: {
      siteName: SITE_NAME,
      title: text(defaultSeo.ogTitle) || title,
      description: text(defaultSeo.ogDescription) || description,
      type: "website",
      ...(ogImage ? { images: [ogImage] } : {}),
    },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#000000",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${manrope.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable}`}>
      <body>
        <JsonLd data={organizationJsonLd(siteUrl())} />
        <JsonLd data={webSiteJsonLd(siteUrl())} />
        {/* Lightweight subtle noise texture with zero SVG filter GPU/CPU overhead */}
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 opacity-[0.025] [background-image:radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px]"
        />
        <RouteCurtain />
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            classNames: {
              toast: "bg-primary border border-border text-foreground",
              title: "text-accent",
              description: "text-muted-foreground",
            },
          }}
        />
      </body>
    </html>
  );
}
