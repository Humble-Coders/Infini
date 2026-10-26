/**
 * Typed JSON-LD injector for structured data (Organization, WebSite,
 * Article, BreadcrumbList). The payload is built from plain data and serialised with
 * JSON.stringify into a script tag with opening bracket escaping to
 * eliminate HTML script tag breakout attacks.
 * Render inside a server component on the page the entity describes.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  const safeJson = JSON.stringify(data).replace(/</g, "\\u003c");
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJson }}
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

/**
 * BreadcrumbList for a detail page: the trail from home to this document, in
 * order. Paths are site-relative ("/news"); origin is prepended here so every
 * `item` is the absolute URL schema.org expects.
 */
export function breadcrumbJsonLd(origin: string, trail: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: `${origin}${crumb.path}`,
    })),
  };
}
