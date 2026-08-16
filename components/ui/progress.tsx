import { cn } from "./utils";

/** Plain token-driven progress bar — no new dependency, matches the design system's colour tokens. */
export function Progress({ value, className }: { value: number; className?: string }) {
  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(value)}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn("h-1.5 w-full overflow-hidden rounded-full bg-muted", className)}
    >
      <div className="h-full bg-primary transition-[width] duration-200" style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
    </div>
  );
}
