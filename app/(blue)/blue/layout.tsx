import type { ReactNode } from "react";
import { SiteShell } from "@/components/layout/SiteShell";

/**
 * TEMP — client colour review. The same public shell as app/(public), scoped
 * to the MMP-blue token set. Delete this route group once a colour is chosen.
 */
export default function BlueLayout({ children }: { children: ReactNode }) {
  return <SiteShell theme="mmp-blue">{children}</SiteShell>;
}
