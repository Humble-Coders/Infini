"use client";

import { useEffect, useState } from "react";
import { cn } from "@/components/ui/utils";

interface Meteor {
  id: number;
  left: number;
  top: number;
  animationDelay: number;
  animationDuration: number;
  opacity: number;
}

/**
 * A decorative animated meteor / shooting-star background.
 * Meteors rain diagonally across the container, each a thin streak with a glow.
 * `numberOfMeteors` controls density (default 12).
 */
export function Meteors({
  numberOfMeteors = 12,
  className,
}: {
  numberOfMeteors?: number;
  className?: string;
}) {
  const [meteors, setMeteors] = useState<Meteor[]>([]);

  useEffect(() => {
    // Generate the random streaks asynchronously so the initial render (which
    // is also SSR'd) is stable, with no hydration mismatch, and so we don't call
    // setState synchronously inside the effect body.
    let active = true;
    const id = window.setTimeout(() => {
      if (!active) return;
      setMeteors(
        Array.from({ length: numberOfMeteors }, (_, i) => ({
          id: i,
          left: Math.floor(Math.random() * 100),
          // Scattered down the container as well as across it. Pinning every
          // streak to one horizontal line read as a drawn rule, not as rain.
          top: Math.floor(Math.random() * 100),
          animationDelay: Math.random() * 6,
          animationDuration: Math.floor(Math.random() * 4) + 3,
          opacity: Math.random() * 0.4 + 0.1,
        }))
      );
    }, 0);
    return () => {
      active = false;
      window.clearTimeout(id);
    };
  }, [numberOfMeteors]);

  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,black_20%,transparent_80%)]",
        className
      )}
    >
      {meteors.map((meteor) => (
        <span
          key={meteor.id}
          className="absolute h-0.5 w-[80px] rotate-[215deg] rounded-full bg-gradient-to-r from-transparent via-accent to-transparent"
          style={{
            left: `${meteor.left}%`,
            top: `${meteor.top}%`,
            animation: `meteor-fall ${meteor.animationDuration}s linear ${meteor.animationDelay}s infinite`,
            opacity: meteor.opacity,
          }}
        />
      ))}
    </div>
  );
}
