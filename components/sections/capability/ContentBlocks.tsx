import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { MonoLabel } from "@/components/sections/home/MonoLabel";
import type { ContentBlock } from "@/lib/types";

/**
 * The CMS's generic text and list blocks, as one editorial band.
 *
 * Two earlier versions of this were wrong in the same way. The original gave
 * every block identical chrome on one ground, so six blocks read as one block
 * repeated six times. Replacing that with a light/dark flip per block only
 * turned the repetition into a stripe pattern, which reads as a template.
 *
 * A run of blocks is one idea with several parts, so it gets one band and one
 * heading, and the variety comes from the layout inside it: the first block
 * takes a wide lead column, the rest fall into a two-up grid, and lists render
 * as hairline rows rather than as more paragraphs.
 */
export function ContentBlocks({ blocks, surface = "dark" }: { blocks: ContentBlock[]; surface?: "light" | "dark" }) {
  if (blocks.length === 0) return null;

  const [lead, ...rest] = blocks;

  return (
    <section
      {...(surface === "light" ? { "data-surface": "light" } : {})}
      className="bg-background py-24 sm:py-32"
    >
      <Container className="flex flex-col gap-14">
        <Reveal>
          <MonoLabel as="h2">In detail</MonoLabel>
        </Reveal>

        <Reveal className="grid gap-8 lg:grid-cols-12 lg:gap-10">
          <h3 className="text-[clamp(1.5rem,3vw,2.25rem)] leading-[1.1] font-semibold tracking-[-0.03em] text-balance text-foreground lg:col-span-5">
            {lead.heading}
          </h3>
          <div className="lg:col-span-6 lg:col-start-7">
            <BlockBody block={lead} large />
          </div>
        </Reveal>

        {rest.length > 0 && (
          <div className="grid gap-x-10 gap-y-12 border-t border-border pt-12 md:grid-cols-2">
            {rest.map((block, index) => (
              <Reveal key={block.heading} delay={index * 0.07} className="flex flex-col gap-4">
                <h3 className="flex items-baseline gap-3 text-lg leading-[1.2] font-semibold tracking-[-0.02em] text-foreground">
                  <span className="font-mono text-[11px] tracking-[0.2em] text-accent tabular-nums">
                    {String(index + 2).padStart(2, "0")}
                  </span>
                  {block.heading}
                </h3>
                <BlockBody block={block} />
              </Reveal>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}

function BlockBody({ block, large = false }: { block: ContentBlock; large?: boolean }) {
  if (block.type === "text") {
    return (
      <p
        className={
          large
            ? "text-base leading-relaxed text-pretty text-muted-foreground sm:text-lg"
            : "text-sm leading-relaxed text-pretty text-muted-foreground"
        }
      >
        {block.body}
      </p>
    );
  }
  return (
    <ul className="flex flex-col border-t border-border">
      {block.items.map((item) => (
        <li
          key={item}
          className="flex items-start gap-3 border-b border-border py-3 text-sm leading-relaxed text-foreground"
        >
          <span aria-hidden="true" className="mt-2.5 h-px w-4 shrink-0 bg-accent" />
          {item}
        </li>
      ))}
    </ul>
  );
}
