"use client";

import { useState, useSyncExternalStore } from "react";
import { Calendar, MapPin, X } from "lucide-react";
import { Container } from "@/components/ui/container";

interface ExhibitionBannerProps {
  title?: string;
  date?: string;
  location?: string;
  booth?: string;
  isActive?: boolean;
}

/** Dismissal is remembered per event, so the next exhibition shows again. */
function storageKey(title: string, date: string) {
  return `infini:exhibition-dismissed:${title}:${date}`;
}

function readDismissed(key: string) {
  try {
    return window.localStorage.getItem(key) === "1";
  } catch {
    // Storage can be blocked (private windows, strict settings). The banner then simply stays.
    return false;
  }
}

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  return () => window.removeEventListener("storage", onChange);
}

/**
 * Post-mount flag as an external store: server snapshot false, client
 * snapshot true. The subscription fires once on mount (see below).
 */
function subscribeMounted(callback: () => void) {
  callback();
  return () => {};
}

export function ExhibitionBanner({
  title = "Upcoming Exhibition: EMO Hannover",
  date = "September 18-23, 2026",
  location = "Hannover, Germany",
  booth = "Hall 11, Booth D32",
  isActive = true,
}: ExhibitionBannerProps) {
  const key = storageKey(title, date);
  // Server render and hydration assume "not dismissed"; the stored choice
  // applies right after. Without the mounted gate, a return visitor who
  // dismissed the banner renders null on the first client pass where the
  // server rendered the aside, shifting every useId below it and tripping a
  // hydration mismatch.
  const storedDismissed = useSyncExternalStore(subscribe, () => readDismissed(key), () => false);
  const mounted = useSyncExternalStore(subscribeMounted, () => true, () => false);
  const dismissedEarlier = storedDismissed && mounted;
  const [dismissedNow, setDismissedNow] = useState(false);

  if (!isActive || dismissedEarlier || dismissedNow) return null;

  function dismiss() {
    setDismissedNow(true);
    try {
      window.localStorage.setItem(key, "1");
    } catch {
      // Not persisted, but still hidden for this visit.
    }
  }

  return (
    <aside aria-label="Upcoming exhibition" className="relative bg-primary text-primary-foreground">
      <Container className="py-3 pr-14 pl-14 sm:py-4">
        <div className="flex flex-col items-center justify-center gap-3 text-sm sm:flex-row sm:text-base">
          <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-6 text-center sm:text-left">
            <strong className="font-semibold tracking-wide uppercase text-xs sm:text-sm bg-background/20 px-2 py-1 rounded">
              Meet Us
            </strong>
            <span className="font-medium">{title}</span>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-primary-foreground/80 text-xs sm:text-sm text-center">
              <span className="flex items-center gap-1.5">
                <Calendar className="size-3.5" aria-hidden="true" />
                {date}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="size-3.5" aria-hidden="true" />
                {location} ({booth})
              </span>
            </div>
          </div>
        </div>
      </Container>

      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss the exhibition banner"
        className="absolute top-1/2 right-1 flex size-11 -translate-y-1/2 items-center justify-center rounded-full text-primary-foreground/80 transition-colors hover:bg-background/20 hover:text-primary-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-foreground sm:right-3"
      >
        <X className="size-5" aria-hidden="true" />
      </button>
    </aside>
  );
}
