import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { cn } from "@/components/ui/utils";

/*
 * The MMP network, as a dotted world map with a site list beside it.
 *
 * The dots are generated, not hand-drawn: a lon/lat grid is tested against
 * coarse continent polygons, so the landmass is data rather than a large SVG
 * path nobody can edit. Sites are placed from their real coordinates through
 * the same equirectangular projection the grid uses, which means a pin can
 * never drift out of step with the map under it.
 *
 * Sites and coordinates are the network mmptechnology.com publishes. INFINI's
 * own plant is the highlighted row.
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
  /** The row that renders on brand red. INFINI's own plant. */
  primary?: boolean;
}

const formatCoord = (lat: number, lon: number) =>
  `${Math.abs(lat).toFixed(4)}° ${lat >= 0 ? "N" : "S"}, ${Math.abs(lon).toFixed(4)}° ${lon >= 0 ? "E" : "W"}`;

export interface NetworkStat {
  value: string;
  label: string;
  detail?: string;
}

/**
 * Composition follows the reference: the whole band on brand red, oversized
 * heading across the top, stat blocks down the left, the map in the middle and
 * the site list on the right.
 *
 * The reference runs this band on red. INFINI's rule is that red is a text
 * colour and never a ground, so the band is black and the red survives only in
 * the eyebrow. The composition is what transfers, not the fill.
 */
export function NetworkMap({
  eyebrow = "Geography",
  index = 3,
  heading = "One process. Seven plants. Four continents.",
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
  return (
    <section className="bg-background relative overflow-hidden py-20 sm:py-24">
      {/* Background Map */}
      <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center opacity-20 mt-40 sm:mt-56">
        <svg
          viewBox={`0 0 ${MAP_W} ${MAP_H}`}
          className="w-[200%] sm:w-[150%] lg:w-full h-auto max-w-[1400px] object-contain"
          role="img"
          aria-label="Map of the MMP network across France, Switzerland, Germany, the United States, India, Japan and China"
        >
          <g className="text-white/40" fill="currentColor">
            {DOTS.map((d, i) => (
              <circle key={i} cx={d.x.toFixed(1)} cy={d.y.toFixed(1)} r={DOT_R} />
            ))}
          </g>
          {sites.map((site) => {
            const { x, y } = project(site.lon, site.lat);
            return (
              <g key={site.name}>
                <circle
                  cx={x.toFixed(1)}
                  cy={y.toFixed(1)}
                  r={site.primary ? 10 : 6}
                  className={site.primary ? "text-accent/30" : "text-white/15"}
                  fill="currentColor"
                />
                <circle
                  cx={x.toFixed(1)}
                  cy={y.toFixed(1)}
                  r={site.primary ? 4.5 : 2.8}
                  className={site.primary ? "text-accent" : "text-white"}
                  fill="currentColor"
                />
              </g>
            );
          })}
        </svg>
      </div>

      <Container className="relative z-10 flex flex-col gap-12 lg:gap-24">
        <div className="flex flex-col gap-6">
          <Eyebrow index={index}>
            {eyebrow}
          </Eyebrow>
          <h2 className="max-w-4xl text-[clamp(2rem,5vw,3.75rem)] leading-[0.98] font-semibold tracking-[-0.045em] text-balance text-foreground uppercase">
            {heading}
          </h2>
          {body && <p className="max-w-2xl text-base leading-relaxed text-pretty text-muted-foreground">{body}</p>}
        </div>

        <div className="flex flex-col lg:flex-row justify-between gap-10 lg:gap-8">
          {stats.length > 0 && (
            <div className="flex flex-col gap-10 lg:w-1/3">
              {stats.map((stat) => (
                <div key={stat.label} className="flex flex-col gap-2">
                  <span className="text-[clamp(2.5rem,5vw,3.5rem)] leading-[0.9] font-mono font-semibold tracking-[-0.05em] tabular-nums text-foreground">
                    {stat.value}
                  </span>
                  <span className="font-mono text-[10px] tracking-[0.16em] text-muted-foreground uppercase">
                    {stat.label}
                  </span>
                  {stat.detail && (
                    <span className="mt-2 max-w-[16rem] text-sm leading-relaxed text-muted-foreground">
                      {stat.detail}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}

          <ul className="flex flex-col lg:w-1/3 mt-10 lg:mt-0">
            {sites.map((site) => (
              <li key={site.name} className="border-b border-border py-4 first:border-t-0 border-t border-border">
                <div className="flex flex-col gap-0.5">
                  <span className="font-mono text-[10px] tracking-[0.12em] tabular-nums text-muted-foreground">
                    {formatCoord(site.lat, site.lon)}
                  </span>
                  <span
                    className={cn(
                      "text-base leading-snug tracking-[-0.01em] text-foreground",
                      site.primary ? "font-semibold text-accent underline decoration-2 underline-offset-4" : "font-medium"
                    )}
                  >
                    {site.name}
                  </span>
                  <span className="text-sm text-muted-foreground">{site.company}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
