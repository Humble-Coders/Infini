"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { ArrowRight, Calendar, MapPin, X } from "lucide-react";
import { Container } from "@/components/ui/container";
import type { EventBannerData } from "@/lib/data/events";

export interface ExhibitionBannerProps {
  banner?: EventBannerData | null;
  title?: string;
  badge?: string;
  subtitle?: string;
  location?: string;
  booth?: string;
  date?: string;
  startDate?: string;
  endDate?: string;
  ctaText?: string;
  ctaUrl?: string;
  theme?: "red" | "dark" | "gold";
  isActive?: boolean;
}

function formatBannerDate(startDate?: string, endDate?: string, fallbackDate?: string): string {
  if (!startDate) return fallbackDate || "";
  try {
    const s = new Date(startDate);
    if (isNaN(s.getTime())) return fallbackDate || startDate;

    const startDay = s.getDate();
    const startMonth = s.toLocaleDateString("en-US", { month: "short" });
    const startYear = s.getFullYear();

    if (!endDate) {
      return `${startDay} ${startMonth} ${startYear}`;
    }

    const e = new Date(endDate);
    if (isNaN(e.getTime())) return `${startDate} - ${endDate}`;

    const endDay = e.getDate();
    const endMonth = e.toLocaleDateString("en-US", { month: "short" });
    const endYear = e.getFullYear();

    if (startYear === endYear && startMonth === endMonth) {
      return `${startDay} - ${endDay} ${startMonth} ${startYear}`;
    }
    if (startYear === endYear) {
      return `${startDay} ${startMonth} - ${endDay} ${endMonth} ${startYear}`;
    }
    return `${startDay} ${startMonth} ${startYear} - ${endDay} ${endMonth} ${endYear}`;
  } catch {
    return startDate && endDate ? `${startDate} - ${endDate}` : startDate || fallbackDate || "";
  }
}

/** Dismissal is remembered per event title + date, so a new event shows again. */
function storageKey(title: string, date: string) {
  return `infini:exhibition-dismissed:${title}:${date}`;
}

function readDismissed(key: string) {
  try {
    return window.localStorage.getItem(key) === "1";
  } catch {
    return false;
  }
}

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  return () => window.removeEventListener("storage", onChange);
}

function subscribeMounted(callback: () => void) {
  callback();
  return () => {};
}

export function ExhibitionBanner(props: ExhibitionBannerProps) {
  const { banner } = props;

  // Resolve values prioritizing banner object, falling back to individual props or defaults
  const isActive = banner ? (banner.enabled ?? true) : (props.isActive ?? true);
  const badge = banner?.badge || props.badge || "Upcoming Exhibition";
  const title = banner?.title || props.title || "EMO Hannover 2026";
  const subtitle = banner?.subtitle !== undefined ? banner.subtitle : props.subtitle;
  const location = banner?.location || props.location || "Hannover, Germany (Hall 11, Booth D32)";
  const booth = banner?.booth || props.booth;
  const startDate = banner?.startDate || props.startDate;
  const endDate = banner?.endDate || props.endDate;
  const formattedDate = formatBannerDate(startDate, endDate, props.date || "18 - 23 Sep 2026");
  const ctaText = banner?.ctaText !== undefined ? banner.ctaText : props.ctaText;
  const ctaUrl = banner?.ctaUrl || props.ctaUrl || "/contact";
  const theme: "red" | "dark" | "gold" = banner?.theme || props.theme || "red";

  const key = storageKey(title, formattedDate);
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
      // Ignore if localStorage unavailable
    }
  }

  // Theme-specific styles matching the admin design system
  const themeStyles = {
    red: {
      bar: "border-b border-accent/30 bg-neutral-950/95 text-foreground shadow-sm shadow-accent/5",
      badge: "border-accent/40 bg-accent/15 text-accent",
      dot: "bg-accent",
      cta: "bg-accent text-accent-foreground shadow-sm shadow-accent/25 hover:bg-accent/90",
      closeHover: "hover:bg-accent/10 hover:text-foreground text-muted-foreground",
    },
    gold: {
      bar: "border-b border-amber-500/30 bg-neutral-950/95 text-foreground shadow-sm shadow-amber-500/5",
      badge: "border-amber-500/40 bg-amber-500/15 text-amber-400",
      dot: "bg-amber-400",
      cta: "bg-amber-500 text-black shadow-sm shadow-amber-500/25 hover:bg-amber-400",
      closeHover: "hover:bg-amber-500/10 hover:text-foreground text-muted-foreground",
    },
    dark: {
      bar: "border-b border-neutral-700 bg-neutral-900/95 text-foreground shadow-sm",
      badge: "border-neutral-600 bg-neutral-800 text-neutral-300",
      dot: "bg-neutral-300",
      cta: "bg-white text-neutral-950 shadow-sm hover:bg-neutral-200",
      closeHover: "hover:bg-white/10 hover:text-foreground text-muted-foreground",
    },
  }[theme];

  return (
    <aside
      aria-label="Upcoming exhibition and announcement"
      className={`relative z-50 backdrop-blur-md transition-all duration-300 ${themeStyles.bar}`}
    >
      <Container className="px-4 py-2 sm:py-2.5 pr-12 sm:pr-14">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
          {/* Main content row */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-3 gap-y-1.5 text-center md:text-left">
            {/* Pulsing Category Badge */}
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-mono font-medium shrink-0 border ${themeStyles.badge}`}
            >
              <span className={`size-1.5 rounded-full animate-pulse ${themeStyles.dot}`} />
              {badge}
            </span>

            {/* Headline Title */}
            <span className="font-bold text-foreground text-xs sm:text-sm tracking-tight shrink-0">
              {title}
            </span>

            {/* Subtitle / Details */}
            {subtitle ? (
              <>
                <span className="text-muted-foreground/50 hidden lg:inline">•</span>
                <span className="text-muted-foreground text-xs line-clamp-1 max-w-xl hidden sm:inline">
                  {subtitle}
                </span>
              </>
            ) : null}

            {/* Date and Location coordinates */}
            {(formattedDate || location) && (
              <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-muted-foreground text-[11px] sm:text-xs">
                {formattedDate && (
                  <span className="inline-flex items-center gap-1 shrink-0">
                    <Calendar className="size-3 text-muted-foreground/80" aria-hidden="true" />
                    <span>{formattedDate}</span>
                  </span>
                )}
                {location && (
                  <span className="inline-flex items-center gap-1 shrink-0">
                    <MapPin className="size-3 text-muted-foreground/80" aria-hidden="true" />
                    <span>{location}</span>
                    {booth && !location.includes(booth) && (
                      <span className="hidden sm:inline">({booth})</span>
                    )}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Action CTA Button */}
          {ctaText && (
            <div className="shrink-0 flex items-center">
              <Link
                href={ctaUrl}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1 text-xs font-semibold transition-all group ${themeStyles.cta}`}
              >
                <span>{ctaText}</span>
                <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          )}
        </div>
      </Container>

      {/* Dismiss Button */}
      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss announcement banner"
        className={`absolute top-1/2 right-2 sm:right-3 flex size-8 -translate-y-1/2 items-center justify-center rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 ${themeStyles.closeHover}`}
      >
        <X className="size-4" aria-hidden="true" />
      </button>
    </aside>
  );
}
