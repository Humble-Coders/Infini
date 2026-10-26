"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageOff } from "lucide-react";
import { cn } from "@/components/ui/utils";

/** Hosts next/image may optimise (mirrors images.remotePatterns in next.config.ts). */
function isOptimizable(src: string): boolean {
  if (src.startsWith("/") && !src.startsWith("//")) return true;
  try {
    const host = new URL(src).hostname;
    return host === "firebasestorage.googleapis.com" || host.endsWith(".firebasestorage.app") || host === "images.unsplash.com";
  } catch {
    return false;
  }
}

/**
 * Admin thumbnail: a resized, cached image for site and Storage URLs (a grid
 * of full-size 300 KB photos made every admin screen slow), a plain <img> for
 * anything else (data: URLs from older uploads), and a clear placeholder
 * instead of a broken-image icon when a file can't be loaded.
 */
export function AdminImage({
  src,
  alt,
  sizes = "240px",
  className,
}: {
  src: string;
  alt: string;
  sizes?: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-1.5 text-muted-foreground">
        <ImageOff className="size-6" aria-hidden="true" />
        <span className="text-[10px] font-mono uppercase tracking-wider">Image unavailable</span>
      </div>
    );
  }

  if (isOptimizable(src)) {
    return <Image src={src} alt={alt} fill sizes={sizes} className={cn("object-cover", className)} onError={() => setFailed(true)} />;
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element -- data: and unknown hosts can't go through the optimizer
    <img src={src} alt={alt} loading="lazy" className={cn("h-full w-full object-cover", className)} onError={() => setFailed(true)} />
  );
}
