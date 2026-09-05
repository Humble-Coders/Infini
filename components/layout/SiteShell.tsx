import type { ReactNode } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { getSettings } from "@/lib/data/settings";

const FALLBACK_NAV = [{ label: "Home", href: "/" }];

/** Public site chrome: smooth scroll, navbar, footer, all on the single brand theme. */
export async function SiteShell({ children }: { children: ReactNode }) {
  const settings = await getSettings();
  const navItems = settings?.nav ?? FALLBACK_NAV;

  return (
    <SmoothScroll>
      <Navbar navItems={navItems} />
      {children}
      <Footer navItems={navItems} legalLinks={settings?.footerLegalLinks ?? []} contact={settings?.contact ?? null} />
    </SmoothScroll>
  );
}
