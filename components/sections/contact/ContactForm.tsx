"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight, CheckCircle2, Lock, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/components/ui/utils";
import type { IndustryDoc, WithId } from "@/lib/types";

const MESSAGE_MAX_LENGTH = 500;

interface ContactFormValues {
  name: string;
  company: string;
  email: string;
  phone: string;
  industry: string;
  message: string;
}

const INITIAL_VALUES: ContactFormValues = {
  name: "",
  company: "",
  email: "",
  phone: "",
  industry: "",
  message: "",
};

const FIELD_CLASS =
  "h-10 rounded-[10px] border-border bg-input-background px-3.5 text-sm text-foreground placeholder:text-muted-foreground " +
  "focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/20";

const LABEL_CLASS = "text-xs font-medium text-foreground";

export function ContactForm({ industries }: { industries: WithId<IndustryDoc>[] }) {
  const [values, setValues] = useState<ContactFormValues>(INITIAL_VALUES);
  const [submitted, setSubmitted] = useState(false);

  function updateField<K extends keyof ContactFormValues>(field: K, value: ContactFormValues[K]) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  const cardClass = cn(
    "rounded-[20px] border border-border bg-card p-6 shadow-[0_24px_60px_-32px_rgba(var(--color-shadow-rgb),0.25)]",
    "sm:rounded-[24px] sm:p-10 lg:p-12"
  );

  if (submitted) {
    return (
      <div className={cn(cardClass, "flex flex-col items-center justify-center gap-4 text-center")}>
        <CheckCircle2 className="size-10 text-accent" aria-hidden="true" />
        <h3 className="text-lg font-medium text-foreground">Enquiry received.</h3>
        <p className="max-w-sm text-sm text-muted-foreground">
          Thank you, {values.name.split(" ")[0] || "there"}. An INFINI engineer will get back to you shortly.
        </p>
        <Button
          type="button"
          onClick={() => {
            setValues(INITIAL_VALUES);
            setSubmitted(false);
          }}
          className="rounded-[10px] border border-border bg-card text-foreground hover:bg-background hover:opacity-100"
        >
          Send another enquiry
        </Button>
      </div>
    );
  }

  const messageLength = values.message.length;

  return (
    <form onSubmit={handleSubmit} className={cn(cardClass, "flex flex-col gap-5")}>
      <div className="flex items-center gap-4 text-left">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
          <Send className="size-4.5" strokeWidth={1.75} aria-hidden="true" />
        </span>
        <div className="flex flex-col gap-1">
          <h3 className="text-[22px] font-medium text-foreground sm:text-[25px]">Send us your requirements</h3>
          <p className="text-sm text-muted-foreground sm:text-[15px]">We&apos;ll respond with a tailored recommendation.</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="contact-name" className={LABEL_CLASS}>
            Name
          </Label>
          <Input
            id="contact-name"
            required
            autoComplete="name"
            value={values.name}
            onChange={(event) => updateField("name", event.target.value)}
            className={FIELD_CLASS}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="contact-company" className={LABEL_CLASS}>
            Company
          </Label>
          <Input
            id="contact-company"
            autoComplete="organization"
            value={values.company}
            onChange={(event) => updateField("company", event.target.value)}
            className={FIELD_CLASS}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="contact-email" className={LABEL_CLASS}>
            Email
          </Label>
          <Input
            id="contact-email"
            type="email"
            required
            autoComplete="email"
            value={values.email}
            onChange={(event) => updateField("email", event.target.value)}
            className={FIELD_CLASS}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="contact-phone" className={LABEL_CLASS}>
            Phone
          </Label>
          <Input
            id="contact-phone"
            type="tel"
            autoComplete="tel"
            value={values.phone}
            onChange={(event) => updateField("phone", event.target.value)}
            className={FIELD_CLASS}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="contact-industry" className={LABEL_CLASS}>
          Industry
        </Label>
        <Select value={values.industry} onValueChange={(value) => updateField("industry", value)}>
          <SelectTrigger id="contact-industry" className={cn(FIELD_CLASS, "text-foreground data-[placeholder]:text-muted-foreground")}>
            <SelectValue placeholder="Select your industry" />
          </SelectTrigger>
          <SelectContent className="border-border bg-popover text-foreground">
            {industries.map((industry) => (
              <SelectItem
                key={industry.slug}
                value={industry.slug}
                className="hover:bg-primary-muted focus:bg-primary-muted focus:text-accent"
              >
                {industry.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-baseline justify-between">
          <Label htmlFor="contact-message" className={LABEL_CLASS}>
            Message
          </Label>
          <span className="text-xs text-muted-foreground tabular-nums">
            {messageLength} / {MESSAGE_MAX_LENGTH}
          </span>
        </div>
        <Textarea
          id="contact-message"
          required
          maxLength={MESSAGE_MAX_LENGTH}
          placeholder="Component, material, tolerance, volume, whatever you have."
          value={values.message}
          onChange={(event) => updateField("message", event.target.value)}
          className={cn(
            "min-h-[100px] rounded-[10px] border-border bg-input-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground",
            "focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/20"
          )}
        />
      </div>

      <div className="flex flex-col items-center gap-3">
        <Button
          type="submit"
          className={cn(
            "group flex h-11 w-full items-center justify-center gap-2 rounded-[10px] bg-primary text-sm font-medium text-primary-foreground",
            "shadow-[0_12px_28px_-12px_rgba(var(--color-primary-rgb),0.55)] transition-all duration-250",
            "hover:-translate-y-0.5 hover:opacity-90 hover:shadow-[0_16px_32px_-12px_rgba(var(--color-primary-rgb),0.6)]"
          )}
        >
          <Send className="size-4" strokeWidth={1.75} aria-hidden="true" />
          Send Enquiry
          <ArrowRight
            className="size-4 transition-transform duration-250 group-hover:translate-x-1"
            strokeWidth={1.75}
            aria-hidden="true"
          />
        </Button>
        <p className="flex items-center gap-1.5 text-[13px] text-muted-foreground">
          <Lock className="size-3.5" strokeWidth={1.75} aria-hidden="true" />
          Your information is kept confidential.
        </p>
      </div>
    </form>
  );
}
