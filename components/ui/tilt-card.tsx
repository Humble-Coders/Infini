"use client";

import { useRef, useState, type ReactNode } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "@/components/ui/utils";

/**
 * A card that tilts in 3D toward the cursor and shows a radial glow that
 * follows the mouse. Content inside renders unchanged.
 */
export function TiltCard({
  children,
  className,
  glowColor = "rgba(var(--color-accent-rgb), 0.16)",
}: {
  children: ReactNode;
  className?: string;
  glowColor?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);

  const spring = { stiffness: 220, damping: 18 };
  const rotateX = useSpring(useTransform(my, [0, 1], [7, -7]), spring);
  const rotateY = useSpring(useTransform(mx, [0, 1], [-7, 7]), spring);
  const glowX = useTransform(mx, (v) => `${v * 100}%`);
  const glowY = useTransform(my, (v) => `${v * 100}%`);

  const glowOpacity = useSpring(hovered ? 1 : 0, { stiffness: 200, damping: 24 });

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set((e.clientX - rect.left) / rect.width);
    my.set((e.clientY - rect.top) / rect.height);
  }

  function onMouseLeave() {
    setHovered(false);
    mx.set(0.5);
    my.set(0.5);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={onMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformPerspective: 900,
        "--glow-x": glowX,
        "--glow-y": glowY,
      } as React.CSSProperties}
      className={cn(
        "group relative h-full overflow-hidden rounded-2xl border border-border bg-card will-change-transform",
        "transition-[border-color,box-shadow] duration-300 hover:border-accent/40 hover:shadow-[0_24px_60px_-24px_rgba(var(--color-shadow-rgb),0.7)]",
        className
      )}
    >
      {/* Mouse-tracked radial glow */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          opacity: glowOpacity,
          background: `radial-gradient(circle 260px at var(--glow-x, 50%) var(--glow-y, 50%), ${glowColor}, transparent 65%)`,
        }}
      />

      {/* Content sits above the glow */}
      <div className="relative z-[1] h-full">{children}</div>
    </motion.div>
  );
}