"use client";

import { useEffect, useRef, useState } from "react";
import type { StatItemData } from "@/lib/types";
import { cn } from "@/components/ui/utils";

export function StatItem({ stat, index }: { stat: StatItemData; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.6 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        "flex flex-col items-center gap-2 text-center transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
        visible ? "translate-y-0 scale-100 opacity-100" : "translate-y-[30px] scale-[0.97] opacity-0"
      )}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <span className="text-[clamp(2.25rem,5vw,3.75rem)] font-light tracking-tight text-foreground">
        {stat.value}
      </span>
      <span className="text-xs tracking-wide text-muted-foreground uppercase">{stat.label}</span>
    </div>
  );
}
