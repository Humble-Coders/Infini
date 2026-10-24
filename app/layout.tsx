import type { Metadata, Viewport } from "next";
import { Instrument_Serif, JetBrains_Mono, Manrope } from "next/font/google";
import Script from "next/script";
import type { ReactNode } from "react";
import { RouteCurtain } from "@/components/layout/RouteCurtain";
import { Toaster } from "sonner";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { SmokeCursor } from "@/components/ui/smoke-cursor";
import { JsonLd, organizationJsonLd, webSiteJsonLd } from "@/components/seo/JsonLd";
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
const SITE_DESCRIPTION =
  "INFINI is a precision surface-finishing partner to manufacturers, applying ISO 9001-certified MMP treatment, validation through mirror-like finish.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: { default: `${SITE_NAME} | Precision Surface-Finishing`, template: `%s | ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    siteName: SITE_NAME,
    title: `${SITE_NAME} | Precision Surface-Finishing`,
    description: SITE_DESCRIPTION,
    type: "website",
  },
};

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
        <ScrollProgress />
        <SmokeCursor />
        {/*
          The industries section pins scroll while it hijacks wheel input
          (IndustriesSectionScroll), so a browser-restored mid-interaction
          scroll position lands somewhere with no context, it reads as
          "reload dropped me at the end of the industries section" rather
          than a scroll restoration you'd ever want. beforeInteractive runs
          before the browser's own auto-restore takes effect, so it wins.
        */}
        <Script id="disable-scroll-restoration" strategy="beforeInteractive">
          {`try { if ('scrollRestoration' in history) { history.scrollRestoration = 'manual'; } window.scrollTo(0, 0); } catch (e) {}`}
        </Script>
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
