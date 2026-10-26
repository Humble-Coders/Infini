import { NextResponse } from "next/server";
import { requireApiRole, CONTENT_ROLES } from "@/lib/auth/requireApiRole";

const MAX_HTML_BYTES = 1024 * 1024;
const MAX_REDIRECTS = 3;

function isLinkedInHttps(url: URL): boolean {
  const host = url.hostname.toLowerCase();
  return url.protocol === "https:" && (host === "linkedin.com" || host.endsWith(".linkedin.com"));
}

/**
 * Fetches a LinkedIn page's HTML. Redirects are followed by hand so every
 * hop is re-checked against the LinkedIn allow-list, the timeout covers the
 * body as well as the headers, and the body is capped.
 */
async function fetchLinkedInHtml(start: URL): Promise<string | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 3500);
  try {
    let url = start;
    for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
      const resp = await fetch(url, {
        signal: controller.signal,
        redirect: "manual",
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; LinkedInBot/1.0; +http://www.linkedin.com)",
          Accept: "text/html,application/xhtml+xml",
        },
      });
      if (resp.status >= 300 && resp.status < 400) {
        const location = resp.headers.get("location");
        if (!location) return null;
        const next = new URL(location, url);
        if (!isLinkedInHttps(next)) return null;
        url = next;
        continue;
      }
      if (!resp.ok || !resp.body) return null;

      const reader = resp.body.getReader();
      const chunks: Uint8Array[] = [];
      let size = 0;
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        size += value.byteLength;
        if (size > MAX_HTML_BYTES) {
          await reader.cancel();
          break;
        }
        chunks.push(value);
      }
      return Buffer.concat(chunks).toString("utf-8");
    }
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

interface LinkedInPreviewResult {
  title: string;
  slug: string;
  industry: string;
  challenge: string;
  solution: string;
  beforeRa: string;
  afterRa: string;
  toolLifeGain: string;
  material: string;
  imageUrl?: string;
  sourceUrl: string;
}

export async function POST(req: Request) {
  const guard = await requireApiRole(req, CONTENT_ROLES);
  if (guard.error) return guard.error;

  try {
    const { url } = await req.json();
    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "Missing or invalid URL" }, { status: 400 });
    }

    const trimmedUrl = url.trim();

    // SSRF Defense: strictly enforce HTTPS protocol and LinkedIn domain
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(trimmedUrl);
    } catch {
      return NextResponse.json({ error: "Invalid URL format" }, { status: 400 });
    }

    if (!isLinkedInHttps(parsedUrl)) {
      return NextResponse.json({ error: "Only https://linkedin.com URLs are permitted" }, { status: 400 });
    }

    let ogTitle = "";
    let ogDescription = "";
    let ogImage = "";

    // Attempt to fetch OpenGraph metadata with social bot crawler user agent
    try {
      const html = await fetchLinkedInHtml(parsedUrl);
      if (html) {
        const titleMatch =
          html.match(/<meta\s+property=["']og:title["']\s+content=["']([^"']+)["']/i) ||
          html.match(/<meta\s+name=["']twitter:title["']\s+content=["']([^"']+)["']/i);
        if (titleMatch?.[1]) ogTitle = titleMatch[1].trim();

        const descMatch =
          html.match(/<meta\s+property=["']og:description["']\s+content=["']([^"']+)["']/i) ||
          html.match(/<meta\s+name=["']twitter:description["']\s+content=["']([^"']+)["']/i);
        if (descMatch?.[1]) ogDescription = descMatch[1].trim();

        const imgMatch =
          html.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i) ||
          html.match(/<meta\s+name=["']twitter:image["']\s+content=["']([^"']+)["']/i);
        // Only ever hand back an https image URL; anything else is dropped.
        if (imgMatch?.[1] && /^https:\/\//i.test(imgMatch[1].trim())) ogImage = imgMatch[1].trim();
      }
    } catch {
      // Social crawler fetch timed out or was blocked, continue with URL slug parsing
    }

    // Parse URL slug if og:title was not obtained or is generic
    let derivedTitle = ogTitle;
    if (!derivedTitle || derivedTitle.toLowerCase().includes("linkedin") || derivedTitle.length < 5) {
      try {
        const parsedUrl = new URL(trimmedUrl);
        const segments = parsedUrl.pathname.split("/").filter(Boolean);
        const lastSegment = segments[segments.length - 1] || "";

        // Remove activity ID pattern, e.g. "infini-precision_aerospace-turbine-blades-activity-7123456789"
        const cleanSlug = lastSegment
          .replace(/activity-\d+.*$/i, "")
          .replace(/urn:li:activity:\d+/i, "")
          .replace(/^infini-precision[_-]?/i, "")
          .replace(/[-_]+/g, " ")
          .trim();

        if (cleanSlug.length > 3) {
          // Title case the slug
          derivedTitle = cleanSlug
            .split(" ")
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
            .join(" ");
        }
      } catch {
        derivedTitle = "";
      }
    }

    if (!derivedTitle) {
      derivedTitle = "Precision MMP Finishing Application";
    }

    // Determine Industry from title or description keywords
    const lowerContent = (derivedTitle + " " + ogDescription + " " + trimmedUrl).toLowerCase();
    let industry = "Precision Engineering";
    let material = "316L Stainless Steel";
    let beforeRa = "0.60 µm";
    let afterRa = "0.03 µm";
    let toolLifeGain = "+250% Cycle Life";
    let defaultChallenge =
      "High-precision component required uniform isotropic roughness reduction without altering micro-tolerances.";
    let defaultSolution =
      "Automated MMP surface treatment removed micro-asperities while strictly preserving functional geometries and edges.";

    if (
      lowerContent.includes("implant") ||
      lowerContent.includes("orthopedic") ||
      lowerContent.includes("medical") ||
      lowerContent.includes("surgical") ||
      lowerContent.includes("13485")
    ) {
      industry = "Medical";
      material = "Ti-6Al-4V ELI (Titanium)";
      beforeRa = "0.38 µm";
      afterRa = "0.02 µm";
      toolLifeGain = "Ra < 0.05 µm Compliant";
      defaultChallenge =
        "Orthopedic titanium implant surfaces required ISO 13485-compliant isotropic finishing with zero toxic contamination and absolute Ra uniformity.";
      defaultSolution =
        "Single-step MMP bio-compatible polishing achieved mirror finish across complex bone contact surfaces with verified batch-to-batch repeatability.";
    } else if (
      lowerContent.includes("aerospace") ||
      lowerContent.includes("turbine") ||
      lowerContent.includes("aviation") ||
      lowerContent.includes("blisk") ||
      lowerContent.includes("vane")
    ) {
      industry = "Aerospace";
      material = "Inconel 718 Superalloy";
      beforeRa = "0.75 µm";
      afterRa = "0.04 µm";
      toolLifeGain = "+350% Fatigue Life";
      defaultChallenge =
        "Turbine blade airfoils suffered boundary layer aerodynamic drag and micro-notch stress concentration under extreme thermal stress.";
      defaultSolution =
        "MMP isotropic finishing eliminated micro-fissures, reducing drag coefficients and significantly boosting fatigue cycle thresholds.";
    } else if (
      lowerContent.includes("automotive") ||
      lowerContent.includes("gear") ||
      lowerContent.includes("transmission") ||
      lowerContent.includes("engine") ||
      lowerContent.includes("ev")
    ) {
      industry = "Automotive";
      material = "Case-Hardened 16MnCr5";
      beforeRa = "0.50 µm";
      afterRa = "0.03 µm";
      toolLifeGain = "-70% Contact Friction";
      defaultChallenge =
        "EV transmission gears generated audible gear whine and parasitic frictional drag under high RPM drive cycles.";
      defaultSolution =
        "Automated MMP superfinishing polished gear tooth flanks to mirror surface, substantially dampening acoustic harmonics and extending gear life.";
    } else if (
      lowerContent.includes("mold") ||
      lowerContent.includes("die") ||
      lowerContent.includes("tool") ||
      lowerContent.includes("carbide") ||
      lowerContent.includes("punch")
    ) {
      industry = "Tooling & Dies";
      material = "Tungsten Carbide / H13 Steel";
      beforeRa = "0.45 µm";
      afterRa = "0.02 µm";
      toolLifeGain = "+400% Die Life";
      defaultChallenge =
        "High-pressure extrusion dies experienced rapid abrasive wear, galling, and frequent tool change downtime.";
      defaultSolution =
        "Controlled MMP micro-polishing created ultra-smooth isotropic cavity surfaces, preventing material adhesion and multiplying production runs.";
    }

    const slug = derivedTitle
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const result: LinkedInPreviewResult = {
      title: derivedTitle,
      slug: slug || `study-${Date.now()}`,
      industry,
      challenge: ogDescription || defaultChallenge,
      solution: defaultSolution,
      beforeRa,
      afterRa,
      toolLifeGain,
      material,
      imageUrl: ogImage || undefined,
      sourceUrl: trimmedUrl,
    };

    return NextResponse.json({ success: true, study: result });
  } catch (err: unknown) {
    console.error("[api/admin/linkedin-preview] error:", err);
    return NextResponse.json({ error: "Failed to read that LinkedIn URL" }, { status: 500 });
  }
}
