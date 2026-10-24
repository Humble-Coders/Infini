import type { ReactNode } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CookieConsent } from "@/components/layout/CookieConsent";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ExhibitionBanner } from "@/components/sections/home/ExhibitionBanner";
import { getSettings } from "@/lib/data/settings";
import { getEventBanner } from "@/lib/data/events";
import { INFINI_CONTACT } from "@/lib/constants/contact";

const FALLBACK_NAV = [{ label: "Home", href: "/" }];

/** Used until the admin sets footer legal links in Settings. */
const DEFAULT_LEGAL_LINKS = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Use", href: "/terms" },
];

/** Public site chrome: announcement banner, navbar, footer, all on the single brand theme. */
export async function SiteShell({ children }: { children: ReactNode }) {
  const [settings, eventBanner] = await Promise.all([
    getSettings(),
    getEventBanner(),
  ]);

  const navItems = settings?.nav?.length ? settings.nav : FALLBACK_NAV;


  return (
    /* data-site marks the public tree, so the monochrome photography rule in
       globals.css applies here and never inside the admin panel, where
       media thumbnails and certificate previews have to show true colour. */
    <div data-site="public" className="contents">
      <ExhibitionBanner banner={eventBanner} />
      <Navbar navItems={navItems} phone={settings?.contact?.phone ?? INFINI_CONTACT.phone} />
      {children}
      <Footer
        navItems={navItems}
        legalLinks={settings?.footerLegalLinks?.length ? settings.footerLegalLinks : DEFAULT_LEGAL_LINKS}
        contact={settings?.contact ?? INFINI_CONTACT}
        social={settings?.social ?? null}
        brochureUrl={settings?.branding?.brochureUrl || undefined}
      />
      <CookieConsent message={settings?.cookieBanner?.message || undefined} />
      />
      <CookieConsent message={settings.cookieBanner?.message || undefined} />
    </div>
  );
}
