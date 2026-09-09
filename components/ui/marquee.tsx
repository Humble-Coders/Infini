"use client";

import { cn } from "@/components/ui/utils";

/**
 * Infinite scrolling marquee. Duplicates its children so the scroll wraps
 * seamlessly. Pauses on hover via CSS `animation-play-state`.
 *
 * Usage:
 * <Marquee speed={40}>
 *   <div className="...">item 1</div>
 *   <div className="...">item 2</div>
 * </Marquee>
 */
export function Marquee({
  children,
  className,
  speed = 40,
  pauseOnHover = true,
  reverse = false,
}: {
  children: React.ReactNode;
  className?: string;
  speed?: number;
  pauseOnHover?: boolean;
  reverse?: boolean;
}) {
  return (
    <div
      className={cn("group/marquee relative flex overflow-hidden", className)}
    >
      <div
        className={cn(
          "flex w-max shrink-0 gap-4",
          pauseOnHover && "group-hover/marquee:[animation-play-state:paused]"
        )}
        style={{
          animationDirection: reverse ? "reverse" : "normal",
          animationDuration: `${speed}s`,
          animationTimingFunction: "linear",
          animationIterationCount: "infinite",
          animationName: "marquee-x",
        }}
      >
        {/* First copy */}
        <div className="flex shrink-0 gap-4">{children}</div>
        {/* Duplicate for seamless loop */}
        <div className="flex shrink-0 gap-4" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}
