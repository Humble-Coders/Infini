"use client";

import { type ReactNode } from "react";
import { cn } from "@/components/ui/utils";

interface GlowingBorderCardProps {
  children: ReactNode;
  className?: string;
  innerClassName?: string;
  glowClassName?: string;
  duration?: string;
}

/**
 * High-precision card with continuous running red glow light effect on the border.
 * Uses a revolving conic gradient behind a 1px inset to produce a smooth neon laser sweep.
 */
export function GlowingBorderCard({
  children,
  className,
  innerClassName,
  glowClassName,
  duration = "4s",
}: GlowingBorderCardProps) {
  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-3xl p-px shadow-[0_0_50px_-10px_rgba(242,53,64,0.3)] transition-all",
        className
      )}
    >
      {/* Running red glow light beam */}
      <div
        aria-hidden="true"
        style={{ animationDuration: duration }}
        className={cn(
          "absolute -inset-[120%] animate-[spin_4s_linear_infinite] will-change-transform motion-reduce:animate-none",
          "bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0%,rgba(242,53,64,0.15)_25%,var(--color-accent)_50%,rgba(242,53,64,0.15)_75%,transparent_100%)]",
          glowClassName
        )}
      />

      {/* Inner card surface */}
      <div
        className={cn(
          "relative z-10 h-full w-full rounded-[23px] border border-border/50 bg-card/90 backdrop-blur-2xl",
          innerClassName
        )}
      >
        {children}
      </div>
    </div>
  );
}
