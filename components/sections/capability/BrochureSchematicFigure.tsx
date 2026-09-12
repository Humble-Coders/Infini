import Image from "next/image";
import { MonoLabel } from "@/components/sections/home/MonoLabel";
import { cn } from "@/components/ui/utils";

interface BrochureSchematicFigureProps {
  src: string;
  alt: string;
  title: string;
  caption?: string;
  tag?: string;
  className?: string;
  surface?: "dark" | "light";
  aspectRatio?: string;
  priority?: boolean;
}

/**
 * High-precision engineering schematic card displaying official MMP brochure
 * technical diagrams and microscopic traces.
 */
export function BrochureSchematicFigure({
  src,
  alt,
  title,
  caption,
  tag = "MMP SPECIFICATION",
  className,
  surface = "dark",
  aspectRatio = "aspect-[16/10]",
  priority = false,
}: BrochureSchematicFigureProps) {
  const isDark = surface === "dark";

  return (
    <figure
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-xl border transition-all duration-300",
        isDark
          ? "border-white/10 bg-[#0d0f12] text-foreground shadow-2xl shadow-black/40 hover:border-white/20"
          : "border-border/80 bg-white text-foreground shadow-lg shadow-black/5 hover:border-border",
        className
      )}
    >
      {/* Technical Header Bar */}
      <div
        className={cn(
          "flex items-center justify-between border-b px-4 py-2.5 text-xs",
          isDark ? "border-white/10 bg-white/[0.03]" : "border-border/60 bg-muted/30"
        )}
      >
        <MonoLabel className={isDark ? "text-accent text-[11px]" : "text-accent text-[11px]"}>
          {tag}
        </MonoLabel>
        <span
          className={cn(
            "font-mono text-[10px] tracking-wider uppercase",
            isDark ? "text-muted-foreground" : "text-muted-foreground"
          )}
        >
          SWISS MMP TECH
        </span>
      </div>

      {/* Image Viewport */}
      <div
        className={cn(
          "relative w-full overflow-hidden flex items-center justify-center p-3 sm:p-5 min-h-[220px] sm:min-h-[260px]",
          aspectRatio,
          isDark ? "bg-[#111317]" : "bg-white"
        )}
      >
        <div className="relative h-full w-full">
          <Image
            src={src}
            alt={alt}
            fill
            priority={priority}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
            className="object-contain rounded-md transition-transform duration-500 group-hover:scale-[1.02]"
          />
        </div>
      </div>

      {/* Caption / Readout Footer */}
      {(title || caption) && (
        <figcaption
          className={cn(
            "border-t p-4 sm:p-5",
            isDark ? "border-white/10 bg-white/[0.02]" : "border-border/60 bg-muted/10"
          )}
        >
          {title && (
            <h4 className="text-sm sm:text-base font-semibold tracking-[-0.02em] text-foreground">
              {title}
            </h4>
          )}
          {caption && (
            <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-muted-foreground">
              {caption}
            </p>
          )}
        </figcaption>
      )}
    </figure>
  );
}
