import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: "Styleguide — Infini",
  robots: { index: false, follow: false },
};

const COLOR_TOKENS: { name: string; css: string }[] = [
  { name: "background", css: "--color-background" },
  { name: "background-elevated", css: "--color-background-elevated" },
  { name: "foreground", css: "--color-foreground" },
  { name: "card", css: "--color-card" },
  { name: "card-foreground", css: "--color-card-foreground" },
  { name: "popover", css: "--color-popover" },
  { name: "popover-foreground", css: "--color-popover-foreground" },
  { name: "primary", css: "--color-primary" },
  { name: "primary-foreground", css: "--color-primary-foreground" },
  { name: "primary-muted", css: "--color-primary-muted" },
  { name: "secondary", css: "--color-secondary" },
  { name: "secondary-foreground", css: "--color-secondary-foreground" },
  { name: "muted", css: "--color-muted" },
  { name: "muted-foreground", css: "--color-muted-foreground" },
  { name: "accent", css: "--color-accent" },
  { name: "accent-foreground", css: "--color-accent-foreground" },
  { name: "destructive", css: "--color-destructive" },
  { name: "destructive-foreground", css: "--color-destructive-foreground" },
  { name: "border", css: "--color-border" },
  { name: "input", css: "--color-input" },
  { name: "switch-background", css: "--color-switch-background" },
  { name: "ring", css: "--color-ring" },
];

const BUTTON_VARIANTS = ["default", "inverse", "destructive", "outline", "secondary", "ghost", "link"] as const;
const BUTTON_SIZES = ["sm", "default", "lg"] as const;

function SwatchGrid() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {COLOR_TOKENS.map((token) => (
        <div key={token.css} className="flex flex-col gap-2">
          <div
            className="h-20 rounded-lg border border-border"
            style={{ backgroundColor: `var(${token.css})` }}
          />
          <div className="text-xs">
            <p className="font-medium text-foreground">{token.name}</p>
            <p className="text-muted-foreground">{token.css}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="flex flex-col gap-6 border-t border-border py-12 first:border-t-0 first:pt-0">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-medium text-foreground">{title}</h2>
        {description && <p className="max-w-2xl text-sm text-muted-foreground">{description}</p>}
      </div>
      {children}
    </section>
  );
}

export default function StyleguidePage() {
  return (
    <main className="min-h-screen bg-background pb-24">
      <Container className="flex flex-col gap-2 pt-16 pb-8">
        <p className="text-xs font-medium tracking-[0.2em] text-accent uppercase">Internal only — noindex</p>
        <h1 className="text-4xl font-medium text-foreground">Infini design system</h1>
        <p className="max-w-2xl text-muted-foreground">
          Every color token, type scale, and component state in one place. This route is excluded
          from search indexing and is the design-direction review artifact for T2.
        </p>
      </Container>

      <Container className="flex flex-col">
        <Section title="Color tokens" description="All colours resolve to a CSS variable defined in app/globals.css — no hardcoded hex in components.">
          <SwatchGrid />
        </Section>

        <Section title="Typography">
          <div className="flex flex-col gap-4">
            <h1>Heading one — the quick brown fox</h1>
            <h2>Heading two — the quick brown fox</h2>
            <h3>Heading three — the quick brown fox</h3>
            <h4>Heading four — the quick brown fox</h4>
            <p className="text-lg text-foreground">Body large — precision surface-finishing for components you manufacture.</p>
            <p className="text-base text-foreground">Body base — precision surface-finishing for components you manufacture.</p>
            <p className="text-sm text-muted-foreground">Body small / muted — precision surface-finishing for components you manufacture.</p>
            <p className="text-xs font-medium tracking-[0.2em] text-accent uppercase">Eyebrow label</p>
          </div>
        </Section>

        <Section title="Buttons" description="Every variant at every size, plus disabled state.">
          <div className="flex flex-col gap-6">
            {BUTTON_VARIANTS.map((variant) => (
              <div key={variant} className="flex flex-wrap items-center gap-3">
                <span className="w-20 shrink-0 text-xs text-muted-foreground">{variant}</span>
                {BUTTON_SIZES.map((size) => (
                  <Button key={size} variant={variant} size={size}>
                    Request a quote
                  </Button>
                ))}
                <Button variant={variant} disabled>
                  Disabled
                </Button>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Form fields" description="Normal, disabled, and error states.">
          <div className="grid max-w-xl gap-6">
            <div className="flex flex-col gap-2">
              <Label htmlFor="sg-input">Company name</Label>
              <Input id="sg-input" placeholder="Acme Precision Ltd." />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="sg-input-disabled">Disabled field</Label>
              <Input id="sg-input-disabled" placeholder="Not editable" disabled />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="sg-input-error">Email (error state)</Label>
              <Input id="sg-input-error" defaultValue="not-an-email" className="border-destructive focus-visible:border-destructive focus-visible:ring-destructive/30" />
              <p className="text-xs text-destructive">Enter a valid email address.</p>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="sg-textarea">Project details</Label>
              <Textarea id="sg-textarea" placeholder="Tell us about your components…" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="sg-select">Industry</Label>
              <Select>
                <SelectTrigger id="sg-select">
                  <SelectValue placeholder="Choose an industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="aerospace">Aerospace</SelectItem>
                  <SelectItem value="medical">Medical devices</SelectItem>
                  <SelectItem value="automotive">Automotive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-3">
              <Switch id="sg-switch" defaultChecked />
              <Label htmlFor="sg-switch">Subscribe to updates</Label>
            </div>
            <div className="flex items-center gap-3">
              <Switch id="sg-switch-disabled" disabled />
              <Label htmlFor="sg-switch-disabled">Disabled switch</Label>
            </div>
          </div>
        </Section>

        <Section title="Cards">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>ISO 9001-certified</CardTitle>
                <CardDescription>Validation through mirror-like finish, in-house.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  MMP surface treatment applied to components our customers manufacture.
                </p>
              </CardContent>
              <CardFooter>
                <Button size="sm" variant="outline">
                  Learn more
                </Button>
              </CardFooter>
            </Card>
            <Card className="border-primary">
              <CardHeader>
                <CardTitle>Highlighted card</CardTitle>
                <CardDescription>border-primary example</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Cards compose from the same tokens as every other surface.</p>
              </CardContent>
            </Card>
          </div>
        </Section>

        <Section title="Accordion">
          <Accordion type="single" collapsible className="max-w-xl">
            <AccordionItem value="item-1">
              <AccordionTrigger>What is the MMP process?</AccordionTrigger>
              <AccordionContent>
                Micro Machining Process — a precision surface-finishing treatment applied to
                components manufactured by our customers.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Does Infini manufacture parts?</AccordionTrigger>
              <AccordionContent>
                No. Infini is a specialist surface-finishing partner to precision manufacturers.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Section>

        <Section title="Section containers" description="Container caps content width at 1440px and centres on large screens.">
          <Container className="rounded-lg border border-dashed border-border bg-secondary/40 py-6 text-center text-sm text-muted-foreground">
            This is a Container inside a Container, for illustration only.
          </Container>
        </Section>
      </Container>
    </main>
  );
}
