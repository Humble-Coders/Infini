"use client";

import { useState, type FormEvent } from "react";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { IndustryDoc, WithId } from "@/lib/types";

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

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-border bg-secondary/30 p-10 text-center">
        <CheckCircle2 className="size-10 text-primary" aria-hidden="true" />
        <h3 className="text-lg font-medium text-foreground">Enquiry received.</h3>
        <p className="max-w-sm text-sm text-muted-foreground">
          Thank you, {values.name.split(" ")[0] || "there"}. An INFINI engineer will get back to you shortly.
        </p>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => {
            setValues(INITIAL_VALUES);
            setSubmitted(false);
          }}
        >
          Send another enquiry
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-5 rounded-xl border border-border bg-secondary/30 p-6 sm:p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="contact-name">Name</Label>
          <Input
            id="contact-name"
            required
            autoComplete="name"
            value={values.name}
            onChange={(event) => updateField("name", event.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="contact-company">Company</Label>
          <Input
            id="contact-company"
            autoComplete="organization"
            value={values.company}
            onChange={(event) => updateField("company", event.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="contact-email">Email</Label>
          <Input
            id="contact-email"
            type="email"
            required
            autoComplete="email"
            value={values.email}
            onChange={(event) => updateField("email", event.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="contact-phone">Phone</Label>
          <Input
            id="contact-phone"
            type="tel"
            autoComplete="tel"
            value={values.phone}
            onChange={(event) => updateField("phone", event.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="contact-industry">Industry</Label>
        <Select value={values.industry} onValueChange={(value) => updateField("industry", value)}>
          <SelectTrigger id="contact-industry">
            <SelectValue placeholder="Select your industry" />
          </SelectTrigger>
          <SelectContent>
            {industries.map((industry) => (
              <SelectItem key={industry.slug} value={industry.slug}>
                {industry.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="contact-message">Message</Label>
        <Textarea
          id="contact-message"
          required
          rows={4}
          placeholder="Component, material, tolerance, volume, whatever you have."
          value={values.message}
          onChange={(event) => updateField("message", event.target.value)}
        />
      </div>

      <Button type="submit" variant="inverse" size="lg" className="w-full">
        Send Enquiry
      </Button>
    </form>
  );
}
