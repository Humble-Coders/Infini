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
      {/* data-site marks the public tree, so the monochrome photography rule in
          globals.css applies here and never inside the admin panel, where
          media thumbnails and certificate previews have to show true colour. */}
      <div data-site="public" className="contents">
        <Navbar navItems={navItems} />
        {children}
        <Footer navItems={navItems} legalLinks={settings?.footerLegalLinks ?? []} contact={settings?.contact ?? null} />
      </div>
    </SmoothScroll>
  );
}
