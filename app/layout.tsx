import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import Script from "next/script";
import type { ReactNode } from "react";
import { Toaster } from "sonner";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-sans-loaded",
  display: "swap",
});

const SITE_NAME = "INFINI";
const SITE_DESCRIPTION =
  "INFINI is a precision surface-finishing partner to manufacturers, applying ISO 9001-certified MMP treatment, validation through mirror-like finish.";

export const metadata: Metadata = {
  title: { default: `${SITE_NAME} | Precision Surface-Finishing`, template: `%s | ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  openGraph: {
    siteName: SITE_NAME,
    title: `${SITE_NAME} | Precision Surface-Finishing`,
    description: SITE_DESCRIPTION,
    type: "website",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={manrope.variable}>
      <body>
        {/*
          The industries section pins scroll while it hijacks wheel input
          (IndustriesSectionScroll), so a browser-restored mid-interaction
          scroll position lands somewhere with no context — it reads as
          "reload dropped me at the end of the industries section" rather
          than a scroll restoration you'd ever want. beforeInteractive runs
          before the browser's own auto-restore takes effect, so it wins.
        */}
        <Script id="disable-scroll-restoration" strategy="beforeInteractive">
          {`try { if ('scrollRestoration' in history) { history.scrollRestoration = 'manual'; } window.scrollTo(0, 0); } catch (e) {}`}
        </Script>
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          }}
        />
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
