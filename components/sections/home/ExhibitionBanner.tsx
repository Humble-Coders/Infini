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
      <Container className="px-4 py-2 pr-12 sm:py-4 sm:pr-14 sm:pl-14">
        <div className="flex flex-col items-center justify-center gap-1 text-center sm:gap-3 sm:text-base">
          <div className="flex flex-row flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center sm:gap-6 sm:text-left">
            <strong className="font-semibold tracking-wide uppercase text-[10px] sm:text-sm bg-background/20 px-2 py-1 rounded">
              Meet Us
            </strong>
            <span className="font-medium text-xs sm:text-base">{title}</span>
            <div className="flex flex-row flex-wrap items-center justify-center gap-x-3 gap-y-0.5 text-primary-foreground/80 text-[11px] sm:gap-4 sm:text-sm text-center">
              <span className="flex items-center gap-1.5">
                <Calendar className="size-3.5" aria-hidden="true" />
                {date}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="size-3.5" aria-hidden="true" />
                {location}
                <span className="hidden sm:inline">({booth})</span>
              </span>
            </div>
          </div>
        </div>
      </Container>

      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss the exhibition banner"
        className="absolute top-1/2 right-0.5 flex size-11 -translate-y-1/2 items-center justify-center rounded-full text-primary-foreground/80 transition-colors hover:bg-background/20 hover:text-primary-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-foreground sm:right-3"
      >
        <X className="size-5" aria-hidden="true" />
      </button>
    </aside>
  );
}
