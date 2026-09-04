import { Fragment } from "react";

/**
 * Renders admin-authored heading copy (`\n` = line break) with the final word
 * set in the serif italic accent — the one editorial flourish the type system
 * allows, applied consistently so CMS edits pick it up without markup.
 */
export function EmphasisHeading({ text }: { text: string }) {
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return lines.map((line, lineIndex) => {
    const isLastLine = lineIndex === lines.length - 1;
    const words = line.split(/\s+/);
    const lastWord = isLastLine ? words.pop() : undefined;

    return (
      <Fragment key={lineIndex}>
        {lineIndex > 0 && <br />}
        {words.join(" ")}
        {lastWord !== undefined && (
          <>
            {words.length > 0 && " "}
            <em className="font-serif font-normal italic text-accent">{lastWord}</em>
          </>
        )}
      </Fragment>
    );
  });
}
