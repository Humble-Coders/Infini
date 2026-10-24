import type { ReactNode } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ExhibitionBanner } from "@/components/sections/home/ExhibitionBanner";
import { getSettings } from "@/lib/data/settings";
import { getEventBanner } from "@/lib/data/events";
import { INFINI_CONTACT } from "@/lib/constants/contact";

const FALLBACK_NAV = [{ label: "Home", href: "/" }];

/** Public site chrome: announcement banner, navbar, footer, all on the single brand theme. */
export async function SiteShell({ children }: { children: ReactNode }) {
  const [settings, eventBanner] = await Promise.all([
    getSettings(),
    getEventBanner(),
  ]);

  const navItems = settings?.nav ?? FALLBACK_NAV;

  return (
    /* data-site marks the public tree, so the monochrome photography rule in
       globals.css applies here and never inside the admin panel, where
       media thumbnails and certificate previews have to show true colour. */
    <div data-site="public" className="contents">
      <ExhibitionBanner banner={eventBanner} />
      <Navbar navItems={navItems} />
      {children}
      <Footer
        navItems={navItems}
        legalLinks={settings?.footerLegalLinks ?? []}
        contact={settings?.contact ?? INFINI_CONTACT}
        social={settings?.social ?? null}
      />
    </div>
  );
}
