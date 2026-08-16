import type { ReactNode } from "react";
import { cn } from "@/components/ui/utils";
import type { FirestoreTimestamp } from "@/lib/types";

const WARNING_WINDOW_DAYS = 60;

/** Pure — takes the day count rather than calling Date.now() itself, since computing "now" during render trips the React Compiler's purity rule. Compute this once when the data loads (see CertificationsManager), not per render. */
export function daysUntilExpiry(validUntil: FirestoreTimestamp, now: number): number {
  return Math.ceil((validUntil.toDate().getTime() - now) / (1000 * 60 * 60 * 24));
}

/** Flags a certificate approaching or past its validUntil date — the T12 acceptance criterion for admin expiry visibility. */
export function ExpiryBadge({ daysRemaining }: { daysRemaining: number }) {
  if (daysRemaining < 0) {
    return <Badge tone="destructive">Expired {Math.abs(daysRemaining)}d ago</Badge>;
  }
  if (daysRemaining <= WARNING_WINDOW_DAYS) {
    return <Badge tone="warning">Expires in {daysRemaining}d</Badge>;
  }
  return null;
}

function Badge({ tone, children }: { tone: "destructive" | "warning"; children: ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        tone === "destructive" ? "bg-destructive text-destructive-foreground" : "bg-accent/20 text-accent"
      )}
    >
      {children}
    </span>
  );
}
