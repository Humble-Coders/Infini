import type { ReactNode } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { ColourSwitcher } from "@/components/preview/ColourSwitcher";
import { getSettings } from "@/lib/data/settings";

const FALLBACK_NAV = [{ label: "Home", href: "/" }];

export type SiteTheme = "red" | "mmp-blue";

/**
 * Public site chrome: smooth scroll, navbar, footer. `theme` sets the
 * `data-theme` scope that app/globals.css keys its colour overrides on —
 * "red" is the brand default (no attribute, the @theme block applies);
 * "mmp-blue" is the client-review variant served at /blue.
 */
export async function SiteShell({ theme = "red", children }: { theme?: SiteTheme; children: ReactNode }) {
  const settings = await getSettings();
  const navItems = settings?.nav ?? FALLBACK_NAV;

  return (
    <div data-theme={theme === "red" ? undefined : theme}>
      <SmoothScroll>
        <Navbar navItems={navItems} />
        {children}
        <Footer navItems={navItems} legalLinks={settings?.footerLegalLinks ?? []} contact={settings?.contact ?? null} />
      </SmoothScroll>
      <ColourSwitcher current={theme} />
    </div>
  );
}
