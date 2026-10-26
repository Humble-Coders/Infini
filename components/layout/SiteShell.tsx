import type { ReactNode } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CookieConsent } from "@/components/layout/CookieConsent";
import { ExhibitionBanner } from "@/components/sections/home/ExhibitionBanner";
import { getSettings } from "@/lib/data/settings";
import { getEventBanner } from "@/lib/data/events";
import { DEFAULT_LEGAL_LINKS, DEFAULT_NAV } from "@/lib/constants/navigation";

/** Public site chrome: announcement banner, navbar, footer, all on the single brand theme. */
export async function SiteShell({ children }: { children: ReactNode }) {
  const [settings, eventBanner] = await Promise.all([getSettings(), getEventBanner()]);

  const navItems = settings.nav.length > 0 ? settings.nav : DEFAULT_NAV;

  return (
    /* data-site marks the public tree, so the monochrome photography rule in
       globals.css applies here and never inside the admin panel, where
       media thumbnails and certificate previews have to show true colour. */
    <div data-site="public" className="contents">
      <ExhibitionBanner banner={eventBanner} />
      <Navbar navItems={navItems} phone={settings.contact.dispatchPhone || settings.contact.phone} />
      {children}
      <Footer
        navItems={navItems}
        legalLinks={settings.footerLegalLinks.length > 0 ? settings.footerLegalLinks : DEFAULT_LEGAL_LINKS}
        contact={settings.contact}
        social={settings.social}
        brochureUrl={settings.branding?.brochureUrl || undefined}
      />
      {settings.cookieBanner.enabled && <CookieConsent message={settings.cookieBanner.message || undefined} />}
    </div>
  );
}
