import type { ReactNode } from "react";
import { SiteShell } from "@/components/layout/SiteShell";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { SmokeCursorLazy } from "@/components/ui/smoke-cursor-lazy";

/**
 * Public site on the single brand theme (red / black / white, the @theme block
 * in app/globals.css). Individual sections opt into a light or brand surface
 * with `data-surface`.
 *
 * The scroll bar and smoke cursor live here, not in the root layout, so their
 * motion code never ships to /admin. The cursor additionally self-gates to
 * fine-pointer, motion-OK devices.
 */
export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <ScrollProgress />
      <SmokeCursorLazy />
      <SiteShell>{children}</SiteShell>
    </>
  );
}
