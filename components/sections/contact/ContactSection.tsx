import { Mail, MapPin, Phone } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionBackground } from "@/components/sections/shared/SectionBackground";
import { SectionEyebrow } from "@/components/sections/shared/SectionEyebrow";
import { ContactForm } from "./ContactForm";
import type { IndustryDoc, SettingsContact, TeaserCopy, WithId } from "@/lib/types";

function detailsFrom(contact: SettingsContact | null) {
  if (!contact) return [];
  return [
    { icon: Mail, label: "Email", value: contact.email, href: `mailto:${contact.email}` },
    { icon: Phone, label: "Phone", value: contact.phone, href: `tel:${contact.phone.replace(/[^\d+]/g, "")}` },
    { icon: MapPin, label: "Facility", value: contact.address, href: undefined },
  ];
}

export function ContactSection({
  copy,
  contact,
  industries,
}: {
  copy: TeaserCopy;
  contact: SettingsContact | null;
  industries: WithId<IndustryDoc>[];
}) {
  const contactDetails = detailsFrom(contact);

  return (
    <section id="contact" className="relative overflow-hidden border-t border-border/60 bg-background py-20 sm:py-28">
      <SectionBackground />
      <Container className="relative grid gap-14 lg:grid-cols-2 lg:gap-20">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <SectionEyebrow>{copy.eyebrow}</SectionEyebrow>
            <h2 className="max-w-md text-3xl font-light text-foreground sm:text-4xl">{copy.heading}</h2>
            {copy.body && <p className="max-w-md text-sm text-muted-foreground sm:text-base">{copy.body}</p>}
          </div>

          <ul className="flex flex-col gap-5">
            {contactDetails.map((detail) => {
              const Icon = detail.icon;
              const content = (
                <>
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary-muted text-primary">
                    <Icon className="size-4" strokeWidth={1.5} aria-hidden="true" />
                  </span>
                  <span className="flex flex-col">
                    <span className="text-xs tracking-wide text-muted-foreground uppercase">{detail.label}</span>
                    <span className="text-sm text-foreground sm:text-base">{detail.value}</span>
                  </span>
                </>
              );

              return (
                <li key={detail.label}>
                  {detail.href ? (
                    <a href={detail.href} className="flex items-center gap-4 transition-opacity hover:opacity-80">
                      {content}
                    </a>
                  ) : (
                    <div className="flex items-center gap-4">{content}</div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        <ContactForm industries={industries} />
      </Container>
    </section>
  );
}
