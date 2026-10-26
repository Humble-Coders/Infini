"use client";

import { useEffect, useRef } from "react";

/**
 * Creates an arc-length normalized lemniscate track for perfectly constant motion.
 * Flow direction: top-left -> center crossover -> top-right -> right apex -> bottom-right -> center -> bottom-left -> left apex.
 */
function createLemniscateTrack(a = 100, cx = 120, cy = 60, numSamples = 2000) {
  const rawPoints: { x: number; y: number; dist: number }[] = [];
  let totalDist = 0;

  for (let i = 0; i <= numSamples; i++) {
    const t = (i / numSamples) * Math.PI * 2;
    const denom = 1 + Math.sin(t) ** 2;
    const x = cx - (a * Math.cos(t)) / denom;
    const y = cy - (a * Math.sin(t) * Math.cos(t)) / denom;

    if (i > 0) {
      const prev = rawPoints[i - 1];
      totalDist += Math.hypot(x - prev.x, y - prev.y);
    }
    rawPoints.push({ x, y, dist: totalDist });
  }

  function getPointAtDistance(d: number): { x: number; y: number } {
    d = ((d % totalDist) + totalDist) % totalDist;
    let low = 0;
    let high = rawPoints.length - 1;
    while (low <= high) {
      const mid = (low + high) >> 1;
      if (rawPoints[mid].dist < d) {
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }
    const idx = Math.max(1, Math.min(low, rawPoints.length - 1));
    const p0 = rawPoints[idx - 1];
    const p1 = rawPoints[idx];
    const segmentLen = p1.dist - p0.dist;
    const ratio = segmentLen > 0 ? (d - p0.dist) / segmentLen : 0;
    return {
      x: p0.x + (p1.x - p0.x) * ratio,
      y: p0.y + (p1.y - p0.y) * ratio,
    };
  }

  return { totalDist, getPointAtDistance };
}

const track = createLemniscateTrack();

/**
 * Segments of one alpha band are filled as a single path. Drawing each of the
 * ~180 segments as its own path+fill cost ~280 fill calls per frame, which on
 * a throttled phone kept the main thread busy for the whole visit; 16 bands
 * read identically at this size.
 */
const ALPHA_BANDS = 16;

type SpinePoint = { x: number; y: number; u: number; nx: number; ny: number; angle: number };

function fillTaperedBands(
  ctx: CanvasRenderingContext2D,
  spine: SpinePoint[],
  from: number,
  width: (u: number) => number,
  alpha: (midU: number) => number,
  color: (a: number) => string
) {
  const count = spine.length - 1 - from;
  if (count <= 0) return;
  const perBand = Math.max(1, Math.ceil(count / ALPHA_BANDS));
  for (let start = from; start < spine.length - 1; start += perBand) {
    const end = Math.min(start + perBand, spine.length - 1);
    ctx.beginPath();
    for (let i = start; i < end; i++) {
      const p0 = spine[i];
      const p1 = spine[i + 1];
      const w0 = width(p0.u);
      const w1 = width(p1.u);
      ctx.moveTo(p0.x + p0.nx * w0, p0.y + p0.ny * w0);
      ctx.lineTo(p1.x + p1.nx * w1, p1.y + p1.ny * w1);
      ctx.lineTo(p1.x - p1.nx * w1, p1.y - p1.ny * w1);
      ctx.lineTo(p0.x - p0.nx * w0, p0.y - p0.ny * w0);
      ctx.closePath();
    }
    const midU = (spine[start].u + spine[end].u) / 2;
    ctx.fillStyle = color(alpha(midU));
    ctx.fill();
  }
}

export interface InfinityMarkProps {
  className?: string;
  duration?: number;
  alwaysActive?: boolean;
}

export function InfinityMark({
  className,
  duration = 4400,
  alwaysActive = false,
}: InfinityMarkProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animId: number = 0;
    let startTime: number | null = null;
    let lastDraw = 0;
    let isVisible = true;

    // Phones and tablets get a lighter version: fewer samples, ~30fps, no
    // canvas blur (the costliest operation here). Reduced motion gets one
    // still frame.
    const lite = window.matchMedia("(pointer: coarse), (max-width: 767px)").matches;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const minFrameMs = lite ? 33 : 0;

    // Trail configuration: covers 82% of loop length so the infinity figure is clearly visible
    const trailFraction = 0.82;
    const trailDist = track.totalDist * trailFraction;
    const N = lite ? 96 : 180;

    const render = (time: number) => {
      if (!isVisible && !alwaysActive) {
        animId = 0;
        return;
      }
      if (minFrameMs && lastDraw && time - lastDraw < minFrameMs) {
        animId = requestAnimationFrame(render);
        return;
      }
      lastDraw = time;

      if (startTime === null) startTime = time;
      const elapsed = time - startTime;
      const progress = (elapsed % duration) / duration;
      const currentDist = progress * track.totalDist;

      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      if (width === 0 || height === 0) {
        animId = requestAnimationFrame(render);
        return;
      }

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const targetW = Math.round(width * dpr);
      const targetH = Math.round(height * dpr);

      if (canvas.width !== targetW || canvas.height !== targetH) {
        canvas.width = targetW;
        canvas.height = targetH;
      }

      ctx.save();
      ctx.scale(targetW / 240, targetH / 120);
      ctx.clearRect(0, 0, 240, 120);

      // 1. Sample centerline points and compute continuous normal vectors
      const spine: SpinePoint[] = [];
      const delta = 0.5;

      for (let i = 0; i <= N; i++) {
        const u = i / N; // 0 = tail tip (razor thin), 1 = head (thick & white hot)
        const d = currentDist - trailDist * (1 - u);
        const p = track.getPointAtDistance(d);
        const pPrev = track.getPointAtDistance(d - delta);
        const pNext = track.getPointAtDistance(d + delta);

        const tx = pNext.x - pPrev.x;
        const ty = pNext.y - pPrev.y;
        const len = Math.hypot(tx, ty) || 1;
        const nx = -ty / len;
        const ny = tx / len;
        const angle = Math.atan2(ty, tx);

        spine.push({ x: p.x, y: p.y, u, nx, ny, angle });
      }

      const head = spine[spine.length - 1];

      // -----------------------------------------------------------------
      // PASS 1: Wide Ambient Red Neon Aura (Single Continuous Polygon Ribbon)
      // -----------------------------------------------------------------
      ctx.shadowBlur = lite ? 0 : 10;
      ctx.shadowColor = "#E31B23";

      ctx.beginPath();
      for (let i = 0; i <= N; i++) {
        const pt = spine[i];
        const halfW = 3.6 * Math.pow(pt.u, 1.25);
        const lx = pt.x + pt.nx * halfW;
        const ly = pt.y + pt.ny * halfW;
        if (i === 0) ctx.moveTo(lx, ly);
        else ctx.lineTo(lx, ly);
      }
      ctx.arc(head.x, head.y, 3.6, head.angle - Math.PI / 2, head.angle + Math.PI / 2);
      for (let i = N; i >= 0; i--) {
        const pt = spine[i];
        const halfW = 3.6 * Math.pow(pt.u, 1.25);
        const rx = pt.x - pt.nx * halfW;
        const ry = pt.y - pt.ny * halfW;
        ctx.lineTo(rx, ry);
      }
      ctx.closePath();
      ctx.fillStyle = "rgba(227, 27, 35, 0.38)";
      ctx.fill();

      // -----------------------------------------------------------------
      // PASS 2: Main Tapered Neon Body (Hardware-accelerated batched quads)
      // -----------------------------------------------------------------
      // Reset shadowBlur to 0 for instant GPU quad rendering without blur stall
      ctx.shadowBlur = 0;

      fillTaperedBands(
        ctx,
        spine,
        0,
        (u) => 1.75 * Math.pow(u, 1.35),
        (midU) => Math.pow(midU, 1.3),
        (alpha) => `rgba(242, 53, 64, ${alpha})`
      );

      // Head rounded cap for main body with subtle glow
      ctx.shadowBlur = lite ? 0 : 6;
      ctx.shadowColor = "#F23540";
      ctx.beginPath();
      ctx.arc(head.x, head.y, 1.75, head.angle - Math.PI / 2, head.angle + Math.PI / 2);
      ctx.fillStyle = "#F23540";
      ctx.fill();

      // -----------------------------------------------------------------
      // PASS 3: Seamless White-Hot Luminous Core (Tapered front 55%)
      // -----------------------------------------------------------------
      ctx.shadowBlur = 0;
      const coreStartIdx = Math.floor(N * 0.45);
      fillTaperedBands(
        ctx,
        spine,
        coreStartIdx,
        (u) => 0.75 * Math.pow(Math.max(0, (u - 0.45) / 0.55), 1.4),
        (midU) => Math.pow(Math.max(0, (midU - 0.45) / 0.55), 1.5) * 0.98,
        (alpha) => `rgba(255, 248, 248, ${alpha})`
      );

      // Leading white-hot nucleus sphere cap
      ctx.shadowBlur = lite ? 0 : 6;
      ctx.shadowColor = "#FFFFFF";
      ctx.beginPath();
      ctx.arc(head.x, head.y, 0.75, 0, Math.PI * 2);
      ctx.fillStyle = "#FFFFFF";
      ctx.fill();

      ctx.restore();
      animId = still ? 0 : requestAnimationFrame(render);
    };

    // Pause canvas loop when scrolled off-screen
    let observer: IntersectionObserver | null = null;
    if (!alwaysActive && typeof IntersectionObserver !== "undefined") {
      observer = new IntersectionObserver(
        ([entry]) => {
          isVisible = entry.isIntersecting;
          if (isVisible && !animId) {
            animId = requestAnimationFrame(render);
          }
        },
        { threshold: 0.05 }
      );
      observer.observe(container);
    }

    // One frame now so the mark is visible at once; the loop itself waits
    // until the browser is idle, keeping it out of the page's critical load.
    animId = requestAnimationFrame(render);
    let idleHandle: number | undefined;
    if (lite && !still && !alwaysActive) {
      cancelAnimationFrame(animId);
      animId = 0;
      render(performance.now());
      const begin = () => {
        if (!animId && isVisible) animId = requestAnimationFrame(render);
      };
      idleHandle =
        "requestIdleCallback" in window
          ? window.requestIdleCallback(begin, { timeout: 2500 })
          : globalThis.setTimeout(begin, 1500) as unknown as number;
    }

    return () => {
      if (observer) observer.disconnect();
      if (animId) cancelAnimationFrame(animId);
      if (idleHandle !== undefined) {
        if ("cancelIdleCallback" in window) window.cancelIdleCallback(idleHandle);
        else globalThis.clearTimeout(idleHandle);
      }
    };
  }, [duration, alwaysActive]);

  return (
    <div ref={containerRef} className={className}>
      <canvas
        ref={canvasRef}
        className="w-full h-auto aspect-[240/120] pointer-events-none"
        aria-hidden="true"
      />
    </div>
  );
}
