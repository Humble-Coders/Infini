import Link from "next/link";
import { Container } from "@/components/ui/container";
import { navItems, footerLegalLinks } from "@/data/nav";
import { contactDetails } from "@/data/contact";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-background">
      <Container className="grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
        <div className="flex flex-col gap-3 lg:col-span-1">
          <Link href="/" className="flex items-center gap-2 text-foreground" aria-label="INFINI home">
            <svg width="24" height="24" viewBox="0 0 28 28" fill="none" aria-hidden="true">
              <circle cx="14" cy="14" r="13" stroke="currentColor" strokeWidth="1.4" />
              <path d="M14 3.5 L14 24.5 M3.5 14 L24.5 14" stroke="var(--color-primary)" strokeWidth="1.4" />
            </svg>
            <span className="text-base font-semibold tracking-[0.2em]">INFINI</span>
          </Link>
          <p className="text-sm text-muted-foreground">
            A specialist surface-finishing partner to precision manufacturers.
          </p>
        </div>

        <nav aria-label="Footer" className="flex flex-col gap-2">
          <h2 className="text-xs font-medium tracking-[0.2em] text-muted-foreground uppercase">Navigate</h2>
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-sm text-foreground/80 transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-col gap-2">
          <h2 className="text-xs font-medium tracking-[0.2em] text-muted-foreground uppercase">Contact</h2>
          <ul className="flex flex-col gap-2">
            {contactDetails.map((detail) => (
              <li key={detail.label}>
                {detail.href ? (
                  <a
                    href={detail.href}
                    className="text-sm text-foreground/80 transition-colors hover:text-foreground"
                  >
                    {detail.value}
                  </a>
                ) : (
                  <span className="text-sm text-foreground/80">{detail.value}</span>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-2">
          <h2 className="text-xs font-medium tracking-[0.2em] text-muted-foreground uppercase">Legal</h2>
          {footerLegalLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm text-foreground/80 transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </Container>

      <div className="border-t border-border py-6">
        <Container>
          <p className="text-xs text-muted-foreground">
            &copy; {year} INFINI. ISO 9001-certified MMP surface-finishing.
          </p>
        </Container>
      </div>
    </footer>
  );
}
