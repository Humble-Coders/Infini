"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * The opening curtain: the supplied infinity animation, full bleed on black.
 *
 * Plays on first load, on reload, and on every route change.
 *
 * Timing. The source clip is 4s, but only the first 3.4s carries motion: past
 * that it is a black tail, measured frame by frame (lit pixels drop to 0% at
 * 3.6s). Playing all four seconds on every navigation would put a dead
 * half-second in front of the page each time, so playback is cut at the end of
 * the motion and run at 2.8x, which lands the whole curtain at about 1.2s.
 *
 * Nothing about the page waits on the video. The black ground is a plain CSS
 * background on this element, server-rendered, so the first frame the browser
 * paints is already black and the site is never glimpsed underneath, whether or
 * not the file has arrived. And three separate conditions lift the curtain:
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

export function RouteCurtain() {
  const pathname = usePathname();
  const videoRef = useRef<HTMLVideoElement>(null);
  // Which route the curtain has finished playing for. Deriving `done` from this
  // rather than resetting a boolean means a route change clears it implicitly,
  // with no state written synchronously inside the effect.
  const [donePath, setDonePath] = useState<string | null>(null);
  const done = donePath === pathname;

  useLayoutEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Reduced motion is handled entirely in CSS, which hides the curtain
    // outright, so there is nothing to schedule here.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      setDonePath(pathname);
    };

    // `defaultPlaybackRate` as well as `playbackRate`, and re-applied on load:
    // the media load algorithm resets playbackRate to defaultPlaybackRate, so
    // setting only the latter here loses the speed the moment the element
    // finishes loading its source and the clip plays at 1x.
    const applyRate = () => {
      video.defaultPlaybackRate = RATE;
      video.playbackRate = RATE;
    };
    applyRate();
    video.addEventListener("loadedmetadata", applyRate);
    video.addEventListener("play", applyRate);

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
      video.removeEventListener("ended", finish);
      video.removeEventListener("error", finish);
    };
  }, [pathname]);

  return (
    <div aria-hidden="true" className="route-curtain" data-state={done ? "done" : "playing"}>
      <video
        ref={videoRef}
        className="route-curtain-video"
        src="/infinity_animation.mp4"
        muted
        playsInline
        autoPlay
        preload="auto"
        tabIndex={-1}
      />
    </div>
  );
}
