import { Container } from "@/components/ui/container";
import { SectionBackground } from "@/components/sections/shared/SectionBackground";
import { contactCopy, contactDetails } from "@/data/contact";
import { ContactForm } from "./ContactForm";

export function ContactSection() {
  return (
    <section id="contact" className="relative overflow-hidden border-t border-border/60 bg-background py-20 sm:py-28">
      <SectionBackground />
      <Container className="relative grid gap-14 lg:grid-cols-2 lg:gap-20">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <span className="text-xs font-medium tracking-[0.2em] text-accent uppercase">
              {contactCopy.eyebrow}
            </span>
            <h2 className="max-w-md text-3xl font-light text-foreground sm:text-4xl">
              {contactCopy.heading}
            </h2>
            <p className="max-w-md text-sm text-muted-foreground sm:text-base">{contactCopy.body}</p>
          </div>

          <ul className="flex flex-col gap-5">
            {contactDetails.map((detail) => {
              const Icon = detail.icon;
              const content = (
                <>
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-border text-primary">
                    <Icon className="size-4" strokeWidth={1.5} aria-hidden="true" />
                  </span>
                  <span className="flex flex-col">
                    <span className="text-xs tracking-wide text-muted-foreground uppercase">
                      {detail.label}
                    </span>
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

        <ContactForm />
      </Container>
    </section>
  );
}
