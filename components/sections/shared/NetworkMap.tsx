"use client";

import { useState } from "react";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { cn } from "@/components/ui/utils";

/*
 * The MMP network: an interactive dotted world map on the left, the site list on
 * the right. Hovering, focusing or tapping a map marker OR a list row lights the
 * matching office in both places (the marker turns red and pulses with a popup,
 * the row highlights), so the two stay in sync.
 *
 * The dots are generated, not hand-drawn: a lon/lat grid is tested against
 * coarse continent polygons, so the landmass is data rather than a large SVG
 * path nobody can edit. Office markers are placed from their real coordinates
 * through the same equirectangular projection the grid uses, so a pin can never
 * drift out of step with the map under it.
 *
 * Sites and coordinates are the network mmptechnology.com (the parent company)
 * publishes. INFINI's own plant is the highlighted row.
 */

const MAP_W = 720;
const MAP_H = 360;
const STEP = 2.5; // degrees between dots
const DOT_R = 1.15;

/** Coarse continent outlines in [lon, lat]. Stylised on purpose: this is a ground, not an atlas. */
const LAND: [number, number][][] = [
  // North America
  [[-168, 65], [-140, 70], [-100, 73], [-80, 70], [-60, 58], [-52, 47], [-70, 44], [-80, 25], [-97, 18], [-105, 20], [-115, 30], [-125, 40], [-125, 48], [-135, 58]],
  // Greenland
  [[-58, 83], [-20, 82], [-20, 70], [-45, 60], [-58, 70]],
  // South America
  [[-81, 10], [-60, 12], [-35, -5], [-35, -22], [-48, -25], [-58, -35], [-65, -45], [-70, -55], [-75, -50], [-72, -35], [-71, -18], [-81, -5]],
  // Europe
  [[-10, 43], [-10, 52], [0, 60], [12, 64], [26, 66], [32, 60], [40, 57], [40, 45], [28, 40], [15, 37], [0, 40]],
  // British Isles
  [[-8, 50], [-8, 58], [-1, 59], [1, 52]],
  // Africa
  [[-17, 15], [-17, 28], [10, 35], [32, 32], [35, 25], [43, 12], [51, 11], [42, -2], [40, -15], [35, -25], [25, -34], [18, -34], [12, -18], [8, 4], [-8, 5]],
  // Asia
  [[40, 60], [60, 72], [100, 76], [140, 72], [160, 68], [179, 66], [179, 59], [145, 45], [135, 35], [122, 30], [110, 20], [100, 10], [95, 16], [90, 22], [80, 8], [72, 20], [60, 25], [45, 12], [35, 30], [40, 45]],
  // Japan
  [[130, 31], [141, 41], [146, 44], [141, 35], [133, 33]],
  // Australia
  [[113, -22], [130, -11], [142, -11], [153, -25], [150, -38], [135, -38], [115, -35]],
  // New Zealand
  [[166, -46], [174, -34], [178, -38], [170, -47]],
];

function inPolygon(lon: number, lat: number, poly: [number, number][]): boolean {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i];
    const [xj, yj] = poly[j];
    if (yi > lat !== yj > lat && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

const project = (lon: number, lat: number) => ({
  x: ((lon + 180) / 360) * MAP_W,
  y: ((90 - lat) / 180) * MAP_H,
});

/** Percent position inside the map box, for the HTML marker overlay. */
const percent = (lon: number, lat: number) => ({
  left: ((lon + 180) / 360) * 100,
  top: ((90 - lat) / 180) * 100,
});

/** Computed once at module scope so it is identical on server and client. */
const DOTS = (() => {
  const out: { x: number; y: number }[] = [];
  for (let lat = 80; lat >= -58; lat -= STEP) {
    for (let lon = -180; lon <= 180; lon += STEP) {
      if (LAND.some((poly) => inPolygon(lon, lat, poly))) out.push(project(lon, lat));
    }
  }
  return out;
})();

export interface NetworkSite {
  name: string;
  company: string;
  lat: number;
  lon: number;
  /** The row and marker that render on brand red by default. INFINI's own plant. */
  primary?: boolean;
}

const formatCoord = (lat: number, lon: number) =>
  `${Math.abs(lat).toFixed(4)}° ${lat >= 0 ? "N" : "S"}, ${Math.abs(lon).toFixed(4)}° ${lon >= 0 ? "E" : "W"}`;

export interface NetworkStat {
  value: string;
  label: string;
  detail?: string;
}

export function NetworkMap({
  eyebrow = "Geography",
  index = 3,
  heading = "One process. Six plants. Three continents.",
  body,
  stats = [],
  sites,
}: {
  eyebrow?: string;
  index?: number;
  heading?: string;
  body?: string;
  stats?: NetworkStat[];
  sites: NetworkSite[];
}) {
  const [active, setActive] = useState<string | null>(null);
  const clear = (name: string) => setActive((a) => (a === name ? null : a));

  return (
    <section className="bg-background relative py-20 sm:py-24">
      <Container className="relative z-10 flex flex-col gap-12 lg:gap-16">
        <div className="flex flex-col gap-6">
          <Eyebrow index={index}>{eyebrow}</Eyebrow>
          <h2 className="max-w-4xl text-[clamp(2rem,5vw,3.75rem)] leading-[0.98] font-semibold tracking-[-0.045em] text-balance text-foreground uppercase">
            {heading}
          </h2>
          {body && <p className="max-w-2xl text-base leading-relaxed text-pretty text-muted-foreground">{body}</p>}
        </div>

        {stats.length > 0 && (
          <div className="flex flex-wrap gap-10 sm:gap-16">
            {stats.map((stat) => (
              <div key={stat.label} className="flex max-w-[16rem] flex-col gap-2">
                <span className="text-[clamp(2.25rem,4vw,3rem)] leading-[0.9] font-mono font-semibold tracking-[-0.05em] tabular-nums text-foreground">
                  {stat.value}
                </span>
                <span className="font-mono text-[10px] tracking-[0.16em] text-muted-foreground uppercase">{stat.label}</span>
                {stat.detail && <span className="mt-1 text-sm leading-relaxed text-muted-foreground">{stat.detail}</span>}
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:gap-14">
          {/* LEFT: interactive dotted map. */}
          <div className="relative w-full lg:flex-1">
            <div className="relative aspect-[2/1] w-full">
              <svg
                viewBox={`0 0 ${MAP_W} ${MAP_H}`}
                className="absolute inset-0 h-full w-full"
                role="img"
                aria-label="Map of the MMP network across France, Switzerland, Germany, the United States, India and Japan"
              >
                <g className="text-foreground/20" fill="currentColor">
                  {DOTS.map((d, i) => (
                    <circle key={i} cx={d.x.toFixed(1)} cy={d.y.toFixed(1)} r={DOT_R} />
                  ))}
                </g>
              </svg>

              {sites.map((site) => {
                const { left, top } = percent(site.lon, site.lat);
                const isActive = active === site.name;
                const anchor = left > 68 ? "right" : left < 32 ? "left" : "center";
                return (
                  <div
                    key={site.name}
                    className="absolute z-10"
                    style={{ left: `${left}%`, top: `${top}%`, transform: "translate(-50%, -50%)" }}
                  >
                    <button
                      type="button"
                      onMouseEnter={() => setActive(site.name)}
                      onMouseLeave={() => clear(site.name)}
                      onFocus={() => setActive(site.name)}
                      onBlur={() => clear(site.name)}
                      onClick={() => setActive((a) => (a === site.name ? null : site.name))}
                      aria-label={`${site.name}, ${site.company}`}
                      className="group relative flex size-5 items-center justify-center outline-none"
                    >
                      <span
                        aria-hidden="true"
                        className={cn("absolute size-4 rounded-full", isActive ? "animate-ping bg-accent/50" : "bg-transparent")}
                      />
                      <span
                        aria-hidden="true"
                        className={cn(
                          "relative inline-flex rounded-full ring-2 ring-background transition-all duration-200",
                          isActive
                            ? "size-3 animate-pulse bg-accent"
                            : site.primary
                              ? "size-2.5 bg-accent/80 group-hover:bg-accent"
                              : "size-2 bg-foreground/45 group-hover:bg-accent group-focus-visible:bg-accent"
                        )}
                      />
                    </button>

                    {isActive && (
                      <div
                        role="tooltip"
                        className={cn(
                          "pointer-events-none absolute bottom-full z-20 mb-2 w-max max-w-[220px] rounded-lg border border-border bg-popover p-3 text-left shadow-xl",
                          anchor === "center" && "left-1/2 -translate-x-1/2",
                          anchor === "left" && "left-0",
                          anchor === "right" && "right-0"
                        )}
                      >
                        <p className="font-mono text-[9px] tracking-[0.12em] tabular-nums text-muted-foreground">
                          {formatCoord(site.lat, site.lon)}
                        </p>
                        <p className={cn("mt-1 text-sm leading-snug font-semibold text-foreground", site.primary && "text-accent")}>
                          {site.name}
                        </p>
                        <p className="text-xs leading-snug text-muted-foreground">{site.company}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT: the site list, in sync with the map. */}
          <ul className="flex w-full flex-col lg:w-[340px]">
            {sites.map((site) => {
              const isActive = active === site.name;
              return (
                <li key={site.name} className="border-b border-border first:border-t">
                  <button
                    type="button"
                    onMouseEnter={() => setActive(site.name)}
                    onMouseLeave={() => clear(site.name)}
                    onFocus={() => setActive(site.name)}
                    onBlur={() => clear(site.name)}
                    onClick={() => setActive((a) => (a === site.name ? null : site.name))}
                    aria-label={`${site.name}, ${site.company}`}
                    className={cn(
                      "flex w-full flex-col gap-0.5 px-3 py-4 text-left outline-none transition-colors",
                      "border-l-2",
                      isActive ? "border-accent bg-accent/10" : "border-transparent hover:bg-foreground/5 focus-visible:bg-foreground/5"
                    )}
                  >
                    <span className="font-mono text-[10px] tracking-[0.12em] tabular-nums text-muted-foreground">
                      {formatCoord(site.lat, site.lon)}
                    </span>
                    <span
                      className={cn(
                        "text-base leading-snug tracking-[-0.01em]",
                        isActive || site.primary ? "font-semibold text-accent" : "font-medium text-foreground"
                      )}
                    >
                      {site.name}
                    </span>
                    <span className="text-sm text-muted-foreground">{site.company}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </Container>
    </section>
  );
}
