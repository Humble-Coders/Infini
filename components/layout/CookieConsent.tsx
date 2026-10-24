"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import Script from "next/script";

/*
 * Cookie consent that genuinely gates tracking.
 *
 * The site sets no optional cookies of its own, so this whole component is
 * inert until an analytics ID is configured (NEXT_PUBLIC_GA_MEASUREMENT_ID).
 * Once it is, visitors are asked first, and Google Analytics is only loaded
 * after they accept. Declining is as easy as accepting, and the choice can be
 * changed any time from "Cookie settings" in the footer.
 */

const STORAGE_KEY = "infini:analytics-consent";
const OPEN_EVENT = "infini:open-cookie-settings";
type Choice = "granted" | "denied" | null;

function readChoice(): Choice {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    return value === "granted" || value === "denied" ? value : null;
  } catch {
    return null;
  }
}

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(OPEN_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(OPEN_EVENT, onChange);
  };
}

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

/** Records a conversion if, and only if, the visitor allowed analytics. */
export function trackEvent(name: string, params: Record<string, string> = {}) {
  if (readChoice() === "granted") window.gtag?.("event", name, params);
}

/** Footer link that reopens the banner; renders nothing when analytics isn't configured. */
export function CookieSettingsLink({ className }: { className?: string }) {
  if (!process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID) return null;
  return (
    <button type="button" className={className} onClick={() => window.dispatchEvent(new Event(OPEN_EVENT))}>
      Cookie settings
    </button>
  );
}

export function CookieConsent({ message }: { message?: string }) {
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const stored = useSyncExternalStore(subscribe, readChoice, () => "denied" as Choice);
  const [reopened, setReopened] = useState(false);
  const [choice, setChoice] = useState<Choice>(null);

  useEffect(() => {
    const open = () => setReopened(true);
    window.addEventListener(OPEN_EVENT, open);
    return () => window.removeEventListener(OPEN_EVENT, open);
  }, []);

  if (!measurementId) return null;
  const current = choice ?? stored;
  const showBanner = current === null || reopened;

  function decide(next: "granted" | "denied") {
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Storage blocked: the choice still applies for this visit.
    }
    if (next === "denied" && current === "granted") {
      // Analytics already loaded this visit: a reload is the reliable way to stop it.
      window.location.reload();
      return;
    }
    setChoice(next);
    setReopened(false);
  }

  return (
    <>
      {current === "granted" && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`} strategy="afterInteractive" />
          <Script id="ga-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config',${JSON.stringify(measurementId)});`}
          </Script>
        </>
      )}

      {showBanner && (
        <div
          role="dialog"
          aria-live="polite"
          aria-label="Cookie preferences"
          className="fixed inset-x-3 bottom-3 z-[150] mx-auto max-w-xl rounded-2xl border border-border bg-background/95 p-4 shadow-2xl backdrop-blur sm:inset-x-6 sm:bottom-6 sm:p-5"
        >
          <p className="text-sm leading-relaxed text-foreground/90">
            {message ||
              "We'd like to use analytics cookies to understand how visitors use this site. They're off unless you allow them."}{" "}
            <Link href="/privacy" className="text-accent underline-offset-4 hover:underline">
              Privacy Policy
            </Link>
          </p>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => decide("denied")}
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-border px-5 text-sm font-medium text-foreground transition-colors hover:border-foreground"
            >
              Decline
            </button>
            <button
              type="button"
              onClick={() => decide("granted")}
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Allow analytics
            </button>
          </div>
        </div>
      )}
    </>
  );
}
