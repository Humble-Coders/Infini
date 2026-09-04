import type { ReactNode } from "react";
import { SiteShell } from "@/components/layout/SiteShell";

/**
 * Public site on the base brand theme (red / black / white, the @theme block
 * in app/globals.css). Individual sections opt into a light or brand surface
 * with `data-surface`. The blue review variant lives at /blue (app/(blue)).
 */
export default function PublicLayout({ children }: { children: ReactNode }) {
  return <SiteShell>{children}</SiteShell>;
}
