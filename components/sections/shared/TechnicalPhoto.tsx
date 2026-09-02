import Image from "next/image";

/**
 * Component/industry photo + a light technical-annotation overlay (ruler
 * ticks, measurement callout, corner index) — shared between the Industries
 * and Applications explorers. TEMP — `src` is a seeded picsum.photos
 * placeholder; swap for real photography once supplied, same overlay stays.
 */
export function TechnicalPhoto({ src, alt, index }: { src: string; alt: string; index: number }) {
  return (
    <div className="relative h-full w-full">
      <Image src={src} alt={alt} fill sizes="(min-width: 640px) 420px, 85vw" className="object-cover" priority={index === 0} />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/5 to-transparent" />

      <svg viewBox="0 0 400 400" className="pointer-events-none absolute inset-0 h-full w-full text-white" aria-hidden="true">
        <defs>
          <filter id="technical-photo-legibility" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="1.5" floodColor="black" floodOpacity="0.6" />
          </filter>
        </defs>
        <g filter="url(#technical-photo-legibility)">
          {Array.from({ length: 8 }, (_, i) => 30 + i * 48).map((pos) => (
            <line key={pos} x1={pos} y1="16" x2={pos} y2="24" stroke="currentColor" strokeWidth="1" opacity="0.6" />
          ))}

          <line x1="150" y1="300" x2="150" y2="330" stroke="currentColor" strokeWidth="1" opacity="0.9" />
          <path d="M150,300 l-5,10 l10,0 Z" fill="currentColor" opacity="0.9" />
          <line x1="100" y1="330" x2="240" y2="330" stroke="currentColor" strokeWidth="1" opacity="0.6" />
          <text
            x="150"
            y="350"
            textAnchor="middle"
            className="fill-current"
            style={{ font: "600 9px var(--font-sans, ui-sans-serif)", letterSpacing: "0.15em" }}
            opacity="0.85"
          >
            SURFACE FINISH
          </text>

          <text
            x="374"
            y="374"
            textAnchor="end"
            className="fill-current"
            style={{ font: "500 22px ui-monospace, monospace" }}
            opacity="0.7"
          >
            {String(index + 1).padStart(2, "0")}
          </text>

          <path d="M20 20v28M20 20h28" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.7" />
        </g>
      </svg>
    </div>
  );
}
