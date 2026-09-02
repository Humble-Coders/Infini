"use client";

import { Mail, MapPin, Phone, ShieldCheck, Timer, Wrench } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { Container } from "@/components/ui/container";
import { BlueprintBackdrop } from "@/components/sections/shared/BlueprintBackdrop";
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

const TRUST_FEATURES = [
  { icon: Wrench, label: "Engineered precision" },
  { icon: ShieldCheck, label: "Application support" },
  { icon: Timer, label: "Fast response" },
] as const;

export function ContactSection({
  copy,
  contact,
  industries,
}: {
  copy: TeaserCopy;
  contact: SettingsContact | null;
  industries: WithId<IndustryDoc>[];
}) {
  const prefersReducedMotion = useReducedMotion();
  const contactDetails = detailsFrom(contact);

  const reveal = (index: number) => ({
    initial: { opacity: 0, y: prefersReducedMotion ? 0 : 18 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-80px" },
    transition: { duration: prefersReducedMotion ? 0.01 : 0.55, delay: prefersReducedMotion ? 0 : index * 0.1 },
  });

  // "finished." (last word) gets the blue-italic accent treatment; the rest of the
  // CMS-driven heading renders plainly, so admin-edited copy still picks it up.
  const headingWords = copy.heading.trim().split(/\s+/);
  const headingLastWord = headingWords.pop();
  const headingLead = headingWords.join(" ");

  return (
    <section id="contact" className="mmp-contact relative overflow-hidden border-t border-border/60 bg-background py-20 sm:py-28">
      <BlueprintBackdrop />

      <Container className="relative grid gap-16 lg:grid-cols-[45fr_55fr] lg:gap-14 xl:gap-20">
        <motion.div {...reveal(0)} className="flex flex-col gap-9">
          <div className="flex flex-col gap-5">
            <span className="flex items-center gap-2">
              <span aria-hidden="true" className="h-px w-6 bg-accent" />
              <span className="text-[13px] font-medium tracking-[2px] text-accent uppercase">{copy.eyebrow}</span>
            </span>
            <h2 className="max-w-md text-[38px] leading-[1.0] font-light tracking-tight text-foreground sm:text-[52px] lg:text-[60px]">
              {headingLead}{" "}
              <em className="text-accent italic">{headingLastWord}</em>
            </h2>
            {copy.body && (
              <p className="max-w-[520px] text-[17px] leading-[1.55] text-muted-foreground sm:text-lg">{copy.body}</p>
            )}
          </div>

          <ul className="flex flex-col divide-y divide-border/60">
            {contactDetails.map((detail) => {
              const Icon = detail.icon;
              const content = (
                <>
                  <span className="flex size-14 shrink-0 items-center justify-center rounded-full border border-accent/25 bg-primary-muted text-accent">
                    <Icon className="size-5" strokeWidth={1.5} aria-hidden="true" />
                  </span>
                  <span className="flex flex-col gap-0.5">
                    <span className="text-xs font-medium tracking-[0.15em] text-muted-foreground uppercase">
                      {detail.label}
                    </span>
                    <span className="text-sm text-foreground sm:text-base">{detail.value}</span>
                  </span>
                </>
              );

              return (
                <li key={detail.label} className="py-4 first:pt-0 last:pb-0">
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

          <ul className="flex flex-wrap gap-x-8 gap-y-3 border-t border-border/60 pt-6">
            {TRUST_FEATURES.map((feature) => {
              const Icon = feature.icon;
              return (
                <li key={feature.label} className="flex items-center gap-2 text-muted-foreground">
                  <Icon className="size-4 text-accent" strokeWidth={1.75} aria-hidden="true" />
                  <span className="text-xs font-medium tracking-[0.1em] uppercase">{feature.label}</span>
                </li>
              );
            })}
          </ul>
        </motion.div>

        <motion.div {...reveal(1)}>
          <ContactForm industries={industries} />
        </motion.div>
      </Container>
    </section>
  );
}
