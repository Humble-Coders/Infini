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
 * High-precision card with continuous running red glow light beam on the border.
 * Features an intense neon laser sweep rotating around the card perimeter.
 */
export function GlowingBorderCard({
  children,
  className,
  innerClassName,
  glowClassName,
  duration = "3.5s",
}: GlowingBorderCardProps) {
  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-3xl p-[1.5px] shadow-[0_0_50px_-10px_rgba(242,53,64,0.35)] transition-all",
        className
      )}
    >
      {/* Outer ambient blur glow that tracks the beam */}
      <div
        aria-hidden="true"
        style={{ animationDuration: duration }}
        className="absolute -inset-[150%] animate-[spin_3.5s_linear_infinite] opacity-60 blur-xl will-change-transform motion-reduce:hidden bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0deg,transparent_90deg,rgba(242,53,64,0.3)_140deg,#f23540_180deg,rgba(242,53,64,0.3)_220deg,transparent_270deg,transparent_360deg)] pointer-events-none"
      />

      {/* Running red laser beam on the border */}
      <div
        aria-hidden="true"
        style={{ animationDuration: duration }}
        className={cn(
          "absolute -inset-[150%] animate-[spin_3.5s_linear_infinite] will-change-transform motion-reduce:animate-none",
          "bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0deg,transparent_80deg,rgba(242,53,64,0.3)_120deg,#f23540_165deg,#ffffff_180deg,#f23540_195deg,rgba(242,53,64,0.3)_240deg,transparent_280deg,transparent_360deg)]",
          glowClassName
        )}
      />

      {/* Inner card surface */}
      <div
        className={cn(
          "relative z-10 h-full w-full rounded-[22.5px] border border-border/60 bg-[#0c0d0e]/95 backdrop-blur-2xl shadow-inner",
          innerClassName
        )}
      >
        {children}
      </div>
    </div>
  );
}
