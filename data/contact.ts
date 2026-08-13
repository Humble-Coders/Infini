import { Mail, MapPin, Phone, type LucideIcon } from "lucide-react";

export interface ContactDetail {
  icon: LucideIcon;
  label: string;
  value: string;
  href?: string;
}

export const contactDetails: ContactDetail[] = [
  {
    icon: Mail,
    label: "Email",
    value: "enquiries@infini.co.in",
    href: "mailto:enquiries@infini.co.in",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+91 XX XXXX XXXX",
    href: "tel:+91XXXXXXXXXX",
  },
  {
    icon: MapPin,
    label: "Facility",
    value: "Treatment & validation labs, India",
  },
];

export const contactCopy = {
  eyebrow: "Get In Touch",
  heading: "Tell us what you need finished.",
  body: "Share your component, tolerance and volume — our engineers will get back to you with a treatment recommendation, not a sales script.",
};
