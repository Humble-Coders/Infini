import type { NextConfig } from "next";
import path from "path";

// Staging must never be indexable. Resolved once at build time (not per
// request like the middleware this replaces) since NEXT_PUBLIC_SITE_ENV is
// fixed per deployment. Only ever "production" on the T26 production deploy.
const isProduction = process.env.NEXT_PUBLIC_SITE_ENV === "production";

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.resolve(__dirname),
  images: {
    // WebP only: AVIF is a little smaller but several times slower to encode,
    // and on a serverless host with a cold optimizer cache that encode sits in
    // front of the first visitor's images (worst on phones, which ask for more
    // distinct widths). Week-long cache so repeat visits never re-pay it.
    formats: ["image/webp"],
    minimumCacheTTL: 604800,
    // getDownloadURL() from Firebase Storage always resolves to this host,
    // regardless of the project's bucket-naming style, needed so
    // next/image (T8 media library, MediaPicker) can serve uploaded assets.
    remotePatterns: [
      { protocol: "https", hostname: "firebasestorage.googleapis.com" },
      // Newer SDKs hand back download URLs on the bucket's own domain.
      { protocol: "https", hostname: "*.firebasestorage.app" },
      // TEMP DEMO, topical industry photos (see DEMO_HERO_IMAGES in
      // lib/data/industries.ts). Delete with that map once real
      // photography is supplied.
      { protocol: "https", hostname: "images.unsplash.com" },
      // Cover images pulled in by the admin's LinkedIn case-study import.
      { protocol: "https", hostname: "media.licdn.com" },
    ],
  },
  // Legacy WordPress URL map, docs/PRD.md §7 (launch-blocking). Permanent
  // (301/308) so ranking signal transfers. /technology, /validation,
  // /deburring-polishing, /mirror-like-finish and /contact keep their exact
  // slugs and need no entry; their old trailing-slash forms ("/technology/")
  // are normalised by Next's built-in trailing-slash redirect, which also runs
  // before these, so "/aero/" lands via "/aero".
  async redirects() {
    const legacyIndustries: Array<[string, string]> = [
      ["/aero", "/industries/aerospace"],
      ["/forge-stamping-die", "/industries/forge-stamping-die"],
      ["/additive-fabrication", "/industries/additive-manufacturing"],
      ["/medical", "/industries/medical-implants"],
      ["/plastic-injection-molds", "/industries/plastic-injection-molds"],
      ["/cutting-tools", "/industries/cutting-tools"],
      ["/transmissions", "/industries/gears-transmission"],
      // WordPress's own alias for the front page; old links and bookmarks still use it.
      ["/home", "/"],
      // The cookie policy's old link target.
      ["/privacy-policy", "/privacy"],
    ];
    return legacyIndustries.map(([source, destination]) => ({ source, destination, permanent: true }));
  },
  async headers() {
    // Content-Security-Policy. Inline scripts stay allowed because Next.js and
    // the theme bootstrap emit them (a nonce-based policy needs middleware and
    // dynamic rendering, which would cost the static/ISR pages); everything
    // else is pinned down: no plugins, no foreign scripts, no framing by other
    // sites, forms only to this origin, images/frames only from known hosts.
    const isDev = process.env.NODE_ENV !== "production";
    const csp = [
      "default-src 'self'",
      // google.com / gstatic.com: reCAPTCHA on the contact form, loaded on submit.
      `script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google.com https://www.gstatic.com${isDev ? " 'unsafe-eval'" : ""}`,
      "style-src 'self' 'unsafe-inline'",
      `img-src 'self' data: blob: https://firebasestorage.googleapis.com https://*.firebasestorage.app https://images.unsplash.com https://media.licdn.com https://*.google-analytics.com https://www.googletagmanager.com${isDev ? " http://127.0.0.1:9199 http://localhost:9199" : ""}`,
      "font-src 'self' data:",
      "media-src 'self'",
      `connect-src 'self' https://*.googleapis.com https://*.firebaseio.com https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com${isDev ? " ws: http://127.0.0.1:8080 http://localhost:8080" : ""}`,
      "frame-src https://maps.google.com https://www.google.com",
      "worker-src 'self' blob:",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'self'",
      ...(isDev ? [] : ["upgrade-insecure-requests"]),
    ].join("; ");

    const securityHeaders = [
      { key: "Content-Security-Policy", value: csp },
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "X-Frame-Options", value: "SAMEORIGIN" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
      { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
      {
        key: "Permissions-Policy",
        value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
      },
      { key: "X-DNS-Prefetch-Control", value: "on" },
      // Production-only: App Hosting already terminates TLS, so HSTS just
      // pins the browser to it. Never on staging, where preview URLs vary.
      ...(isProduction
        ? [{ key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" }]
        : []),
    ];

    const globalSecurity = { source: "/:path*", headers: securityHeaders };

    if (isProduction) return [globalSecurity];
    return [
      globalSecurity,
      {
        source: "/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex" }],
      },
    ];
  },
  productionBrowserSourceMaps: false,
  poweredByHeader: false,
  compiler: {
    removeConsole: isProduction ? { exclude: ["error", "warn"] } : false,
  },
  // Trim the client bundle: barrel imports from icons and motion engines resolve to
  // just the modules actually used.
  experimental: {
    optimizePackageImports: [
      "framer-motion",
      "lucide-react",
      "sonner",
    ],
  },
};

export default nextConfig;
