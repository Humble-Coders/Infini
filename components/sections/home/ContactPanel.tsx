import { Mail, MapPin, Phone } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Meteors } from "@/components/ui/meteors";
import { ContactForm } from "@/components/sections/contact/ContactForm";
import type { IndustryDoc, SettingsContact, TeaserCopy, WithId } from "@/lib/types";
import { cn } from "@/components/ui/utils";
import { MonoLabel } from "./MonoLabel";

const FALLBACK: TeaserCopy = {
  eyebrow: "Get in touch",
  heading: "Tell us what you need finished.",
  body: "Share your component, tolerance and volume, our engineers will get back to you with a treatment recommendation, not a sales script.",
};

function detailsFrom(contact: SettingsContact | null) {
  if (!contact) return [];
  return [
    { icon: Phone, label: "Call", value: contact.phone, href: `tel:${contact.phone.replace(/[^\d+]/g, "")}` },
    { icon: Mail, label: "Email", value: contact.email, href: `mailto:${contact.email}` },
    { icon: MapPin, label: "Facility", value: contact.address, href: undefined },
  ];
}

/**
 * Closing conversion block: the brand-red panel carries the ask and the
 * tap-to-call / mailto details; the enquiry form sits beside it. Both halves
 * are token-driven. Red is a text colour on this site and never a ground, so
 * the left panel is an elevated dark surface rather than a brand-red fill.
 */
export function ContactPanel({
  copy,
  contact,
  industries,
  headingLevel = "h2",
  compact = false,
}: {
  copy: TeaserCopy | null;
  contact: SettingsContact | null;
  industries: WithId<IndustryDoc>[];
  /**
   * On /contact and /request-a-quote the panel is the whole page, sitting
   * directly under the header rather than closing a long scroll. It loses the
   * closing-band top padding and the meteor spacer, so the two columns start on
   * the same line and the form is visible without scrolling.
   */
  compact?: boolean;
  /**
   * "h2" as a section of a larger page; "h1" when the panel *is* the page, as on
   * /contact and /request-a-quote, which otherwise render with no h1 at all.
   */
  headingLevel?: "h1" | "h2";
}) {
  const { eyebrow, heading, body } = { ...FALLBACK, ...(copy ?? {}) };
  const details = detailsFrom(contact);
  const Heading = headingLevel;

  return (
    <section
      id="contact"
      className={cn(
        "relative scroll-mt-20 overflow-hidden bg-background",
        compact ? "pt-10 pb-20 sm:pt-14 sm:pb-24" : "py-24 sm:py-32"
      )}
    >
      <Container className="relative grid gap-6 lg:grid-cols-12 lg:gap-8">
        <div
          className={cn(
            "relative flex flex-col overflow-hidden rounded-3xl border border-border bg-background-elevated p-8 text-foreground sm:p-10 lg:col-span-5 lg:p-12",
            compact ? "h-fit gap-10" : "justify-between gap-14"
          )}
        >
          <Meteors numberOfMeteors={8} className="opacity-40" />
          <div className="flex flex-col gap-6">
            <MonoLabel>{eyebrow}</MonoLabel>
            <Heading className="text-[clamp(2.25rem,4.5vw,4rem)] leading-[0.98] font-semibold tracking-[-0.04em] text-balance">
              {heading}
            </Heading>
            {body && <p className="max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg">{body}</p>}
          </div>

          {details.length > 0 && (
            <ul className="flex flex-col divide-y divide-border border-t border-border">
              {details.map((detail) => {
                const Icon = detail.icon;
                const content = (
                  <>
                    <Icon className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} aria-hidden="true" />
                    <span className="flex min-w-0 flex-col gap-1">
                      <span className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground uppercase">{detail.label}</span>
                      <span className="text-base leading-snug font-medium break-words sm:text-lg">{detail.value}</span>
                    </span>
                  </>
                );
                return (
                  <li key={detail.label}>
                    {detail.href ? (
                      <a
                        href={detail.href}
                        className="flex items-start gap-4 py-4 transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                      >
                        {content}
                      </a>
                    ) : (
                      <div className="flex items-start gap-4 py-4">{content}</div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="lg:col-span-7">
          {/* Meteor rain sits in its own band immediately above the form. Run
              across the whole section it landed level with the section's
              midpoint, which on a tall page reads as a stray streak low down
              rather than as texture belonging to the form. */}
          {!compact && (
            <div aria-hidden="true" className="relative hidden h-28 lg:block">
              <Meteors numberOfMeteors={14} />
            </div>
          )}
          <ContactForm industries={industries} />
        </div>
      </Container>
    </section>
  );
}
