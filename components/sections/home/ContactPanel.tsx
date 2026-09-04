import { Mail, MapPin, Phone } from "lucide-react";
import { Container } from "@/components/ui/container";
import { ContactForm } from "@/components/sections/contact/ContactForm";
import type { IndustryDoc, SettingsContact, TeaserCopy, WithId } from "@/lib/types";
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
 * are token-driven — the red panel is just `data-surface="brand"`.
 */
export function ContactPanel({
  copy,
  contact,
  industries,
}: {
  copy: TeaserCopy | null;
  contact: SettingsContact | null;
  industries: WithId<IndustryDoc>[];
}) {
  const { eyebrow, heading, body } = { ...FALLBACK, ...(copy ?? {}) };
  const details = detailsFrom(contact);

  return (
    <section id="contact" className="scroll-mt-20 bg-background py-24 sm:py-32">
      <Container className="grid gap-6 lg:grid-cols-12 lg:gap-8">
        <div
          data-surface="brand"
          className="flex flex-col justify-between gap-14 rounded-3xl bg-background p-8 text-foreground sm:p-10 lg:col-span-5 lg:p-12"
        >
          <div className="flex flex-col gap-6">
            <MonoLabel>{eyebrow}</MonoLabel>
            <h2 className="text-[clamp(2.25rem,4.5vw,4rem)] leading-[0.98] font-semibold tracking-[-0.04em] text-balance">
              {heading}
            </h2>
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
          <ContactForm industries={industries} />
        </div>
      </Container>
    </section>
  );
}
