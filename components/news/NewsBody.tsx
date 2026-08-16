import ReactMarkdown from "react-markdown";
import Link from "next/link";

/**
 * Renders a news post's markdown body against the design system's own
 * tokens, not a generic prose plugin's defaults — every element maps to a
 * styled component here rather than a stylesheet, so there's exactly one
 * typography system on the site, not two competing ones.
 *
 * Safe by construction: react-markdown never renders raw HTML embedded in
 * the source unless the rehype-raw plugin is added, which it isn't here —
 * admin-authored markdown is parsed into React elements, not
 * dangerouslySetInnerHTML'd.
 */
export function NewsBody({ markdown }: { markdown: string }) {
  return (
    <div className="flex flex-col gap-4">
      <ReactMarkdown
        components={{
          h1: ({ children }) => <h2 className="text-2xl font-light text-foreground sm:text-3xl">{children}</h2>,
          h2: ({ children }) => <h2 className="text-xl font-light text-foreground sm:text-2xl">{children}</h2>,
          h3: ({ children }) => <h3 className="text-lg font-normal text-foreground">{children}</h3>,
          p: ({ children }) => <p className="text-sm text-foreground/90 sm:text-base">{children}</p>,
          ul: ({ children }) => <ul className="ml-5 flex list-disc flex-col gap-2 text-sm text-foreground/90 sm:text-base">{children}</ul>,
          ol: ({ children }) => <ol className="ml-5 flex list-decimal flex-col gap-2 text-sm text-foreground/90 sm:text-base">{children}</ol>,
          li: ({ children }) => <li>{children}</li>,
          blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-accent pl-4 text-sm text-muted-foreground italic sm:text-base">{children}</blockquote>
          ),
          a: ({ href, children }) => (
            <Link href={href ?? "#"} className="text-accent underline-offset-4 hover:underline">
              {children}
            </Link>
          ),
          strong: ({ children }) => <strong className="font-medium text-foreground">{children}</strong>,
          img: ({ src, alt }) =>
            typeof src === "string" ? (
              // eslint-disable-next-line @next/next/no-img-element -- markdown image URLs are arbitrary and not known at build time; next/image requires a configured/static source.
              <img src={src} alt={alt ?? ""} className="w-full rounded-xl border border-border" />
            ) : null,
        }}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
}
