"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { INFINITY_PATH } from "@/components/ui/infinity";

/**
 * The opening curtain: the supplied infinity animation, full bleed on black.
 *
 * Plays on first load, on reload, and on every route change.
 *
 * Two layers, zero blank frames. The server HTML always contains a small
 * inline-SVG infinity whose draw animation is pure CSS, so the very first
 * paint already shows the mark moving — even before hydration, on a slow
 * phone, with JS still downloading. On desktop the effect then attaches the
 * 16:9 source clip and swaps it in the moment it can play; on mobile the
 * video element is never given a source (CSS keeps it `display: none` under
 * 640px and `preload="none"` means it never fetches), so phones get the
 * lightweight SVG only: small, fully visible, ~1s, no megabytes.
 *
 * Timing (desktop). The source clip is 4s, but only the first 3.4s carries
 * motion: past that it is a black tail, measured frame by frame (lit pixels
 * drop to 0% at 3.6s). Playing all four seconds on every navigation would
 * put a dead half-second in front of the page each time, so playback is cut
 * at the end of the motion and run at 2.8x, which lands the whole curtain at
 * about 1.2s.
 *
 * Nothing about the page waits on the video. The black ground is a plain CSS
 * background on this element, server-rendered, so the first frame the browser
 * paints is already black and the site is never glimpsed underneath, whether
 * or not the file has arrived. And three separate conditions lift the curtain:
 * reaching the cut point, the video erroring, or a hard timeout. If the network
 * is slow, the codec is unsupported, or autoplay is refused, the site still
 * appears on schedule; the animation is decoration and is never load-bearing.
 *
 * The cut is a single timer rather than a frame loop watching `currentTime`.
 * Playback speed is fixed, so the wall-clock length is known exactly and a
 * timer expresses it directly. It also keeps working in a backgrounded tab,
 * where requestAnimationFrame is suspended and a frame loop would simply never
 * reach the cut point, stranding the curtain over the page.
 */

/** Seconds of source to play. The clip is black from here to its 4s end. */
const CUT_AT = 3.4;
/** Playback speed, chosen so CUT_AT lands a little over a second. */
const RATE = 2.8;
/** How long the curtain is up: the played span at the played speed. */
const PLAY_MS = Math.round((CUT_AT / RATE) * 1000);
/** Mobile SVG curtain: shorter on purpose, phones should feel instant. */
const MOBILE_PLAY_MS = 950;
const MOBILE_QUERY = "(max-width: 640px)";

export function RouteCurtain() {
  const pathname = usePathname();
  const videoRef = useRef<HTMLVideoElement>(null);
  // Which route the curtain has finished playing for. Deriving `done` from this
  // rather than resetting a boolean means a route change clears it implicitly,
  // with no state written synchronously inside the effect.
  const [donePath, setDonePath] = useState<string | null>(null);
  const done = donePath === pathname;
  // Flips once the desktop clip can actually paint, swapping the SVG out.
  // Never set on mobile, where the video stays sourceless and hidden.
  const [videoReady, setVideoReady] = useState(false);

  useLayoutEffect(() => {
    // Reduced motion is handled entirely in CSS, which hides the curtain
    // outright, so there is nothing to schedule here.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      setDonePath(pathname);
    };

    // Mobile path: pure-CSS/SVG mark, no video, no network. Just the timer.
    if (window.matchMedia(MOBILE_QUERY).matches) {
      const timer = window.setTimeout(finish, MOBILE_PLAY_MS);
      return () => window.clearTimeout(timer);
    }

    const video = videoRef.current;
    if (!video) {
      finish();
      return;
    }

    // Attached client-side on desktop only: a phone that only ever sees the
    // SVG must never start downloading the ~2MB clip ahead of hydration.
    if (!video.getAttribute("src")) {
      video.src = "/infinity_animation.mp4";
      video.load();
    }

    // `defaultPlaybackRate` as well as `playbackRate`, and re-applied on load:
    // the media load algorithm resets playbackRate to defaultPlaybackRate, so
    // setting only the latter here loses the speed the moment the element
    // finishes loading its source and the clip plays at 1x.
    const applyRate = () => {
      video.defaultPlaybackRate = RATE;
      video.playbackRate = RATE;
    };
    const markReady = () => setVideoReady(true);
    applyRate();
    video.addEventListener("loadedmetadata", applyRate);
    video.addEventListener("play", applyRate);
    video.addEventListener("canplay", markReady);

    try {
      video.currentTime = 0;
    } catch {
      // Seeking before metadata is ready throws in some browsers; playback
      // starts at zero anyway on a fresh element.
    }
    // Autoplay refused, decode failure, missing file: the site must still
    // appear, so every failure path lifts the curtain rather than waiting.
    video.play().catch(finish);
    video.addEventListener("ended", finish);
    video.addEventListener("error", finish);

    const timer = window.setTimeout(finish, PLAY_MS);

    return () => {
      window.clearTimeout(timer);
      video.removeEventListener("loadedmetadata", applyRate);
      video.removeEventListener("play", applyRate);
      video.removeEventListener("canplay", markReady);
      video.removeEventListener("ended", finish);
      video.removeEventListener("error", finish);
    };
  }, [pathname]);

  return (
    <div
      aria-hidden="true"
      className="route-curtain"
      data-state={done ? "done" : "playing"}
      data-video={videoReady ? "ready" : "waiting"}
    >
      <svg viewBox="0 0 200 100" className="route-curtain-glyph" role="presentation">
        <defs>
          <filter id="route-curtain-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" />
          </filter>
        </defs>
        <path
          d={INFINITY_PATH}
          pathLength={1}
          fill="none"
          stroke="var(--color-accent)"
          strokeOpacity={0.7}
          strokeWidth={4.5}
          strokeLinecap="round"
          className="route-curtain-draw"
        />
        <path
          d={INFINITY_PATH}
          pathLength={1}
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth={8}
          strokeLinecap="round"
          className="route-curtain-dot"
          filter="url(#route-curtain-glow)"
        />
      </svg>
      <video
        ref={videoRef}
        className="route-curtain-video"
        muted
        playsInline
        autoPlay
        preload="none"
        tabIndex={-1}
      />
    </div>
  );
}
