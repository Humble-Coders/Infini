"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import dynamic from "next/dynamic";
import { ArrowRight, CheckCircle2, Lock, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const MagneticButton = dynamic(
  () => import("@/components/ui/magnetic-button").then((m) => m.MagneticButton),
  { ssr: false }
);
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/components/ui/utils";
import type { IndustryDoc, WithId } from "@/lib/types";

const MESSAGE_MAX_LENGTH = 500;
const MESSAGE_MIN_LENGTH = 10;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[+()\-.\s\d]{7,20}$/;

type FieldErrors = Partial<Record<"name" | "email" | "phone" | "message", string>>;

/** Mirrors app/api/contact/route.ts. Client checks are UX only; the server re-validates everything. */
function validateClient(values: ContactFormValues): FieldErrors {
  const errors: FieldErrors = {};
  const name = values.name.trim();
  const email = values.email.trim();
  const phone = values.phone.trim();
  const message = values.message.trim();
  if (name.length < 2 || name.length > 100) errors.name = "Please enter your name.";
  if (!EMAIL_RE.test(email) || email.length > 254) errors.email = "Enter a valid email address.";
  if (phone !== "" && !PHONE_RE.test(phone)) errors.phone = "Enter a valid phone number.";
  if (message.length < MESSAGE_MIN_LENGTH || message.length > MESSAGE_MAX_LENGTH) {
    errors.message = `Your message should be ${MESSAGE_MIN_LENGTH}–${MESSAGE_MAX_LENGTH} characters.`;
  }
  return errors;
}

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
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  // Anti-spam: honeypot no human ever fills + render timestamp for the
  // server's fill-time trap. Both ride along in the POST body.
  const [honeypot, setHoneypot] = useState("");
  const startedAtRef = useRef<number>(0);
  useEffect(() => {
    startedAtRef.current = Date.now();
  }, []);

  function updateField<K extends keyof ContactFormValues>(field: K, value: ContactFormValues[K]) {
    setValues((current) => ({ ...current, [field]: value }));
    setFieldErrors((current) => (current[field as keyof FieldErrors] ? { ...current, [field]: undefined } : current));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;

    const errors = validateClient(values);
    setFieldErrors(errors);
    setFormError(null);
    if (Object.keys(errors).length > 0) return;

    setSubmitting(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name.trim(),
          company: values.company.trim(),
          email: values.email.trim(),
          phone: values.phone.trim(),
          industry: values.industry,
          message: values.message.trim(),
          website: honeypot,
          startedAt: startedAtRef.current,
        }),
      });
      const data = (await response.json().catch(() => null)) as {
        ok?: boolean;
        error?: string;
        fields?: FieldErrors;
      } | null;

      if (response.ok && data?.ok) {
        setSubmitted(true);
        return;
      }
      if (data?.fields && Object.keys(data.fields).length > 0) {
        setFieldErrors(data.fields);
        setFormError("Please check the highlighted fields.");
      } else {
        setFormError(data?.error ?? "Something went wrong. Please try again.");
      }
    } catch {
      setFormError("Could not reach our servers. Check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
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
            setFieldErrors({});
            setFormError(null);
            setHoneypot("");
            startedAtRef.current = Date.now();
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
            maxLength={100}
            value={values.name}
            onChange={(event) => updateField("name", event.target.value)}
            className={FIELD_CLASS}
            aria-invalid={Boolean(fieldErrors.name)}
            aria-describedby={fieldErrors.name ? "contact-name-error" : undefined}
          />
          {fieldErrors.name && (
            <p id="contact-name-error" role="alert" className="text-xs text-destructive">
              {fieldErrors.name}
            </p>
          )}
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
            maxLength={254}
            value={values.email}
            onChange={(event) => updateField("email", event.target.value)}
            className={FIELD_CLASS}
            aria-invalid={Boolean(fieldErrors.email)}
            aria-describedby={fieldErrors.email ? "contact-email-error" : undefined}
          />
          {fieldErrors.email && (
            <p id="contact-email-error" role="alert" className="text-xs text-destructive">
              {fieldErrors.email}
            </p>
          )}
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
            aria-invalid={Boolean(fieldErrors.phone)}
            aria-describedby={fieldErrors.phone ? "contact-phone-error" : undefined}
          />
          {fieldErrors.phone && (
            <p id="contact-phone-error" role="alert" className="text-xs text-destructive">
              {fieldErrors.phone}
            </p>
          )}
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
          aria-invalid={Boolean(fieldErrors.message)}
          aria-describedby={fieldErrors.message ? "contact-message-error" : undefined}
        />
        {fieldErrors.message && (
          <p id="contact-message-error" role="alert" className="text-xs text-destructive">
            {fieldErrors.message}
          </p>
        )}
      </div>

      {/* Honeypot: invisible to humans (and assistive tech), irresistible to
          bots. Anyone filling it gets a silent fake success from the API. */}
      <div aria-hidden="true" className="absolute h-px w-px overflow-hidden opacity-0">
        <label htmlFor="contact-website">Website</label>
        <Input
          id="contact-website"
          type="text"
          autoComplete="off"
          tabIndex={-1}
          value={honeypot}
          onChange={(event) => setHoneypot(event.target.value)}
        />
      </div>

      <div className="flex flex-col items-center gap-3">
        {formError && (
          <p role="alert" className="w-full rounded-[10px] border border-destructive/40 bg-destructive/10 px-4 py-2.5 text-center text-sm text-destructive">
            {formError}
          </p>
        )}
        <MagneticButton strength={0.25} className="w-full">
          <Button
            type="submit"
            disabled={submitting}
            className={cn(
              "group flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-[10px] bg-primary text-sm font-medium text-primary-foreground",
              "shadow-[0_12px_28px_-12px_rgba(var(--color-primary-rgb),0.55)] transition-all duration-250",
              "hover:-translate-y-0.5 hover:opacity-90 hover:shadow-[0_16px_32px_-12px_rgba(var(--color-primary-rgb),0.6)]",
              "disabled:cursor-wait disabled:opacity-70 disabled:hover:translate-y-0"
            )}
          >
            <Send className="size-4" strokeWidth={1.75} aria-hidden="true" />
            {submitting ? "Sending…" : "Send Enquiry"}
            {!submitting && (
              <ArrowRight
                className="size-4 transition-transform duration-250 group-hover:translate-x-1"
                strokeWidth={1.75}
                aria-hidden="true"
              />
            )}
          </Button>
        </MagneticButton>
        <p className="flex items-center gap-1.5 text-[13px] text-muted-foreground">
          <Lock className="size-3.5" strokeWidth={1.75} aria-hidden="true" />
          Your information is kept confidential.
        </p>
      </div>
    </form>
  );
}
