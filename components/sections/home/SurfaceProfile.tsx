"use client";

import { useEffect, useId, useRef } from "react";

/*
 * A live surface-roughness trace, the way a profilometer would draw it:
 * a rough, as-machined profile that a red scan line sweeps across, leaving
 * the surface finished behind it. The low-frequency FORM of the line is kept
 * on both sides — only the high-frequency roughness is removed — which is
 * precisely what MMP does, so the animation is the pitch, not decoration.
 *
 * Deterministic (seeded) geometry so the server-rendered path and the client's
 * first frame are byte-identical; everything after that is written straight to
 * the DOM from a requestAnimationFrame loop, paused while off-screen. Under
 * prefers-reduced-motion it renders the finished state, static.
 */

const WIDTH = 640;
const HEIGHT = 220;
const POINTS = 180;
const BASELINE = HEIGHT * 0.56;
const TRANSITION_PX = 70;

const RA_ROUGH = 3.2;
const RA_FINE = 0.05;

const PAUSE_MS = 600;
const SWEEP_MS = 4200;
const HOLD_MS = 2800;
const RESET_MS = 900;
const CYCLE_MS = PAUSE_MS + SWEEP_MS + HOLD_MS + RESET_MS;

function mulberry32(seed: number) {
  return function next() {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface Profile {
  xs: number[];
  rough: number[];
  fine: number[];
}

function buildProfile(): Profile {
  const random = mulberry32(20260904);
  const xs: number[] = [];
  const rough: number[] = [];
  const fine: number[] = [];

  for (let i = 0; i < POINTS; i++) {
    const t = i / (POINTS - 1);
    const form = Math.sin(t * Math.PI * 2.2 + 0.6) * 9; // preserved
    const waviness = Math.sin(t * 46 + 1.1) * 7 + Math.sin(t * 83 + 2.4) * 4; // removed
    const roughness = (random() - 0.5) * 30; // removed
    xs.push(t * WIDTH);
    rough.push(BASELINE + form + waviness + roughness);
    fine.push(BASELINE + form + (random() - 0.5) * 1.2);
  }
  return { xs, rough, fine };
}

const PROFILE = buildProfile();

function smoothstep(value: number) {
  const clamped = Math.min(1, Math.max(0, value));
  return clamped * clamped * (3 - 2 * clamped);
}

function easeInOut(t: number) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

function scanPosition(progress: number) {
  return progress * (WIDTH + TRANSITION_PX);
}

function pathAt(progress: number): string {
  const scanX = scanPosition(progress);
  let d = "";
  for (let i = 0; i < POINTS; i++) {
    const blend = smoothstep((scanX - PROFILE.xs[i]) / TRANSITION_PX);
    const y = PROFILE.rough[i] + (PROFILE.fine[i] - PROFILE.rough[i]) * blend;
    d += `${i === 0 ? "M" : "L"}${PROFILE.xs[i].toFixed(1)} ${y.toFixed(1)}`;
  }
  return d;
}

function raAt(progress: number) {
  return (RA_ROUGH + (RA_FINE - RA_ROUGH) * progress).toFixed(2);
}

const GRID_ROWS = [0.2, 0.38, 0.56, 0.74, 0.92];

export function SurfaceProfile() {
  const id = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const scanRef = useRef<SVGGElement>(null);
  const raRef = useRef<HTMLSpanElement>(null);
  const statusRef = useRef<HTMLSpanElement>(null);
  const dotRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const path = pathRef.current;
    const scan = scanRef.current;
    const ra = raRef.current;
    const status = statusRef.current;
    const dot = dotRef.current;
    const bar = barRef.current;
    if (!root || !path || !scan || !ra || !status || !dot || !bar) return;

    function apply(progress: number, fade = 1) {
      path!.setAttribute("d", pathAt(progress));
      path!.style.opacity = fade.toFixed(2);

      const x = Math.min(WIDTH, Math.max(0, scanPosition(progress) - TRANSITION_PX / 2));
      scan!.setAttribute("transform", `translate(${x.toFixed(1)} 0)`);
      scan!.style.opacity = progress > 0 && progress < 1 ? "1" : "0";

      ra!.textContent = raAt(progress);
      bar!.style.transform = `scaleX(${progress.toFixed(3)})`;

      const label = progress >= 1 ? "Verified" : progress > 0 ? "Treating" : "As machined";
      if (status!.textContent !== label) status!.textContent = label;
      dot!.dataset.phase = progress >= 1 ? "done" : progress > 0 ? "active" : "idle";
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      apply(1);
      return;
    }

    let frame = 0;
    let origin = 0;

    function tick(now: number) {
      if (!origin) origin = now;
      const t = (now - origin) % CYCLE_MS;

      if (t < PAUSE_MS) {
        apply(0);
      } else if (t < PAUSE_MS + SWEEP_MS) {
        apply(easeInOut((t - PAUSE_MS) / SWEEP_MS));
      } else if (t < PAUSE_MS + SWEEP_MS + HOLD_MS) {
        apply(1);
      } else {
        // Reset by fading the finished trace out and the rough one back in —
        // never by "un-finishing" the surface, which would read as the process reversing.
        const r = (t - PAUSE_MS - SWEEP_MS - HOLD_MS) / RESET_MS;
        const fade = Math.abs(2 * r - 1);
        apply(r < 0.5 ? 1 : 0, fade);
      }
      frame = requestAnimationFrame(tick);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!frame) frame = requestAnimationFrame(tick);
        } else {
          cancelAnimationFrame(frame);
          frame = 0;
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(root);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);

  const gradientId = `${id}-scan`;

  return (
    <div
      ref={rootRef}
      className="relative flex flex-col gap-5 rounded-2xl border border-border bg-background-elevated/70 p-5 shadow-[0_40px_80px_-40px_rgba(var(--color-shadow-rgb),0.9)] backdrop-blur-sm sm:p-6"
      role="img"
      aria-label="Animated surface-roughness trace: a rough machined profile is swept by the MMP process and left smooth, while its underlying form is preserved. Roughness falls from Ra 3.20 micrometres to Ra 0.05 micrometres."
    >
      <div className="flex items-center justify-between gap-4">
        <p className="font-mono text-[10px] tracking-[0.18em] whitespace-nowrap text-muted-foreground sm:text-[11px] sm:tracking-[0.22em]">
          SURFACE PROFILE
        </p>
        <p className="flex items-center gap-2 font-mono text-[10px] tracking-[0.16em] whitespace-nowrap text-foreground uppercase sm:text-[11px] sm:tracking-[0.18em]">
          <span
            ref={dotRef}
            data-phase="idle"
            aria-hidden="true"
            className="size-1.5 rounded-full bg-muted-foreground transition-colors data-[phase=active]:animate-pulse data-[phase=active]:bg-accent data-[phase=done]:bg-accent"
          />
          <span ref={statusRef}>As machined</span>
        </p>
      </div>

      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="h-auto w-full text-foreground" aria-hidden="true">
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="var(--color-accent)" stopOpacity="0" />
            <stop offset="1" stopColor="var(--color-accent)" stopOpacity="0.35" />
          </linearGradient>
        </defs>

        {GRID_ROWS.map((row) => (
          <line
            key={row}
            x1="0"
            x2={WIDTH}
            y1={HEIGHT * row}
            y2={HEIGHT * row}
            stroke="currentColor"
            strokeOpacity="0.08"
            strokeWidth="1"
          />
        ))}
        <line
          x1="0"
          x2={WIDTH}
          y1={BASELINE}
          y2={BASELINE}
          stroke="currentColor"
          strokeOpacity="0.28"
          strokeWidth="1"
          strokeDasharray="4 6"
        />
        {Array.from({ length: 9 }, (_, i) => (i * WIDTH) / 8).map((x) => (
          <line
            key={x}
            x1={x}
            x2={x}
            y1={HEIGHT - 10}
            y2={HEIGHT}
            stroke="currentColor"
            strokeOpacity="0.35"
            strokeWidth="1"
          />
        ))}

        <path
          ref={pathRef}
          d={pathAt(0)}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        <g ref={scanRef} transform="translate(0 0)" style={{ opacity: 0 }}>
          <rect x="-56" y="0" width="56" height={HEIGHT} fill={`url(#${gradientId})`} />
          <line x1="0" x2="0" y1="0" y2={HEIGHT} stroke="var(--color-accent)" strokeWidth="1.5" />
        </g>
      </svg>

      <dl className="grid grid-cols-3 gap-4 border-t border-border pt-5">
        <div className="flex flex-col gap-1.5">
          <dt className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground">Ra (µm)</dt>
          <dd className="font-mono text-2xl leading-none font-medium text-foreground tabular-nums sm:text-3xl">
            <span ref={raRef}>{raAt(0)}</span>
          </dd>
        </div>
        <div className="flex flex-col gap-1.5">
          <dt className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground">FORM</dt>
          <dd className="text-sm leading-tight font-medium text-foreground sm:text-base">Preserved</dd>
        </div>
        <div className="flex flex-col gap-1.5">
          <dt className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground">REMOVAL</dt>
          <dd className="text-sm leading-tight font-medium text-foreground sm:text-base">Roughness only</dd>
        </div>
      </dl>

      <span
        ref={barRef}
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-accent"
      />
    </div>
  );
}
