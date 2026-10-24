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
    let isVisible = true;

    // Trail configuration: covers 82% of loop length so the infinity figure is clearly visible
    const trailFraction = 0.82;
    const trailDist = track.totalDist * trailFraction;
    const N = 180; // Optimal sampling for silky smooth edges with zero micro-stutter

    const render = (time: number) => {
      if (!isVisible && !alwaysActive) {
        animId = 0;
        return;
      }

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
      const spine: { x: number; y: number; u: number; nx: number; ny: number; angle: number }[] = [];
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
      ctx.shadowBlur = 10;
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

      for (let i = 0; i < N; i++) {
        const p0 = spine[i];
        const p1 = spine[i + 1];
        const midU = (p0.u + p1.u) / 2;

        const w0 = 1.75 * Math.pow(p0.u, 1.35);
        const w1 = 1.75 * Math.pow(p1.u, 1.35);
        const alpha = Math.pow(midU, 1.3);

        const l0x = p0.x + p0.nx * w0;
        const l0y = p0.y + p0.ny * w0;
        const r0x = p0.x - p0.nx * w0;
        const r0y = p0.y - p0.ny * w0;

        const l1x = p1.x + p1.nx * w1;
        const l1y = p1.y + p1.ny * w1;
        const r1x = p1.x - p1.nx * w1;
        const r1y = p1.y - p1.ny * w1;

        ctx.beginPath();
        ctx.moveTo(l0x, l0y);
        ctx.lineTo(l1x, l1y);
        ctx.lineTo(r1x, r1y);
        ctx.lineTo(r0x, r0y);
        ctx.closePath();
        ctx.fillStyle = `rgba(242, 53, 64, ${alpha})`;
        ctx.fill();
      }

      // Head rounded cap for main body with subtle glow
      ctx.shadowBlur = 6;
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
      for (let i = coreStartIdx; i < N; i++) {
        const p0 = spine[i];
        const p1 = spine[i + 1];
        const midU = (p0.u + p1.u) / 2;
        const coreU = (midU - 0.45) / 0.55;

        const w0 = 0.75 * Math.pow((p0.u - 0.45) / 0.55, 1.4);
        const w1 = 0.75 * Math.pow((p1.u - 0.45) / 0.55, 1.4);
        const alpha = Math.pow(coreU, 1.5);

        const l0x = p0.x + p0.nx * w0;
        const l0y = p0.y + p0.ny * w0;
        const r0x = p0.x - p0.nx * w0;
        const r0y = p0.y - p0.ny * w0;

        const l1x = p1.x + p1.nx * w1;
        const l1y = p1.y + p1.ny * w1;
        const r1x = p1.x - p1.nx * w1;
        const r1y = p1.y - p1.ny * w1;

        ctx.beginPath();
        ctx.moveTo(l0x, l0y);
        ctx.lineTo(l1x, l1y);
        ctx.lineTo(r1x, r1y);
        ctx.lineTo(r0x, r0y);
        ctx.closePath();
        ctx.fillStyle = `rgba(255, 248, 248, ${alpha * 0.98})`;
        ctx.fill();
      }

      // Leading white-hot nucleus sphere cap
      ctx.shadowBlur = 6;
      ctx.shadowColor = "#FFFFFF";
      ctx.beginPath();
      ctx.arc(head.x, head.y, 0.75, 0, Math.PI * 2);
      ctx.fillStyle = "#FFFFFF";
      ctx.fill();

      ctx.restore();
      animId = requestAnimationFrame(render);
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

    animId = requestAnimationFrame(render);

    return () => {
      if (observer) observer.disconnect();
      if (animId) cancelAnimationFrame(animId);
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
