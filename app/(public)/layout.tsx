import type { ReactNode } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { getSettings } from "@/lib/data/settings";

const FALLBACK_NAV = [{ label: "Home", href: "/" }];

export default async function PublicLayout({ children }: { children: ReactNode }) {
  const settings = await getSettings();

  return (
    <SmoothScroll>
      <Navbar navItems={settings?.nav ?? FALLBACK_NAV} />
      {children}
      <Footer
        navItems={settings?.nav ?? FALLBACK_NAV}
        legalLinks={settings?.footerLegalLinks ?? []}
        contact={settings?.contact ?? null}
      />
    </SmoothScroll>
  );
}
