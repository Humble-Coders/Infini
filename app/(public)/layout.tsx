import type { ReactNode } from "react";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { getSettings } from "@/lib/data/settings";

const FALLBACK_NAV = [{ label: "Home", href: "/" }];

export default async function PublicLayout({ children }: { children: ReactNode }) {
  const settings = await getSettings();

  return (
    <>
      <AnnouncementBar />
      <Navbar navItems={settings?.nav ?? FALLBACK_NAV} />
      {children}
      <Footer
        navItems={settings?.nav ?? FALLBACK_NAV}
        legalLinks={settings?.footerLegalLinks ?? []}
        contact={settings?.contact ?? null}
      />
    </>
  );
}
