import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import type { NavLink, SettingsContact } from "@/lib/types";

function contactDetailsFrom(contact: SettingsContact | null) {
  if (!contact) return [];
  return [
    { label: "Email", value: contact.email, href: `mailto:${contact.email}` },
    { label: "Phone", value: contact.phone, href: `tel:${contact.phone.replace(/[^\d+]/g, "")}` },
    { label: "Facility", value: contact.address, href: undefined },
  ];
}

const COLUMN_HEADING = "font-mono text-[11px] font-medium tracking-[0.22em] text-muted-foreground uppercase";
const COLUMN_LINK = "w-fit text-sm text-foreground/80 transition-colors hover:text-accent";

export function Footer({
  navItems,
  legalLinks,
  contact,
}: {
  navItems: NavLink[];
  legalLinks: NavLink[];
  contact: SettingsContact | null;
}) {
  const year = new Date().getFullYear();
  const contactDetails = contactDetailsFrom(contact);

  return (
    <footer data-dark-scope className="relative overflow-hidden border-t border-border bg-background">
      <Container className="flex flex-col gap-16 py-16 sm:py-20">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          <div className="flex flex-col gap-6 sm:col-span-2 lg:col-span-4">
            <Link href="/" className="w-fit" aria-label="INFINI home">
              <Image src="/Infini-MMP-01.png" alt="INFINI, Finish Unlimited, MMP Technology" width={263} height={78} className="h-12 w-auto" />
            </Link>
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
              A specialist surface-finishing partner to precision manufacturers. MMP treatment applied in-house, verified before it ships.
            </p>
          </div>

          <nav aria-label="Footer" className="flex flex-col gap-3 lg:col-span-2 lg:col-start-6">
            <h2 className={COLUMN_HEADING}>Navigate</h2>
            {navItems.map((item) => (
              <Link key={item.label} href={item.href} className={COLUMN_LINK}>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex flex-col gap-3 lg:col-span-3">
            <h2 className={COLUMN_HEADING}>Contact</h2>
            <ul className="flex flex-col gap-3">
              {contactDetails.map((detail) => (
                <li key={detail.label}>
                  {detail.href ? (
                    <a href={detail.href} className={COLUMN_LINK}>
                      {detail.value}
                    </a>
                  ) : (
                    <span className="text-sm text-foreground/80">{detail.value}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-3 lg:col-span-2">
            <h2 className={COLUMN_HEADING}>Legal</h2>
            {legalLinks.map((link) => (
              <Link key={link.label} href={link.href} className={COLUMN_LINK}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-border pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            &copy; {year} INFINI Precision Pvt. Ltd. ISO 9001-certified MMP surface-finishing.
          </p>
          <p className="font-mono text-[11px] tracking-[0.24em] text-muted-foreground uppercase">Finish unlimited</p>
        </div>
      </Container>

      {/* Oversized wordmark, cropped by the footer's bottom edge — a brand sign-off, not content. */}
      <div aria-hidden="true" className="pointer-events-none -mb-[3vw] select-none">
        <p className="text-center text-[clamp(5rem,23vw,24rem)] leading-[0.8] font-bold tracking-[-0.07em] text-foreground/[0.06]">
          INFINI
        </p>
      </div>
    </footer>
  );
}
