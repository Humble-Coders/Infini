/**
 * Typed JSON-LD injector for structured data (Organization, WebSite,
 * Article…). The payload is built from plain data and serialised with
 * JSON.stringify into a script tag — no HTML parsing, no injection surface.
 * Render inside a server component on the page the entity describes.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function organizationJsonLd(origin: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "INFINI",
    description:
      "INFINI is a precision surface-finishing partner to manufacturers, applying ISO 9001-certified MMP treatment, validation through mirror-like finish.",
    url: `${origin}/`,
  };
}

export function webSiteJsonLd(origin: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "INFINI",
    url: `${origin}/`,
  };
}

export function articleJsonLd({
  origin,
  path,
  headline,
  description,
  image,
  datePublished,
}: {
  origin: string;
  path: string;
  headline: string;
  description: string;
  image?: string;
  datePublished?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline,
    description,
    url: `${origin}${path}`,
    ...(image ? { image: [image] } : {}),
    ...(datePublished ? { datePublished } : {}),
    author: { "@type": "Organization", name: "INFINI" },
    publisher: { "@type": "Organization", name: "INFINI" },
  };
}
