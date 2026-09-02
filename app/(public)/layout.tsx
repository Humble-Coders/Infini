import type { ReactNode } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { getSettings } from "@/lib/data/settings";

const FALLBACK_NAV = [{ label: "Home", href: "/" }];

export default async function PublicLayout({ children }: { children: ReactNode }) {
  const settings = await getSettings();

  return (
    // mmp-industrial is now the site default — set here, not on <html> in the root
    // layout, so /preview/** (a sibling route tree, not nested under this layout)
    // keeps switching freely between all four schemes without this leaking in.
    <div data-theme="mmp-industrial">
      <SmoothScroll>
        <Navbar navItems={settings?.nav ?? FALLBACK_NAV} />
        {children}
        <Footer
          navItems={settings?.nav ?? FALLBACK_NAV}
          legalLinks={settings?.footerLegalLinks ?? []}
          contact={settings?.contact ?? null}
        />
      </SmoothScroll>
    </div>
  );
}
