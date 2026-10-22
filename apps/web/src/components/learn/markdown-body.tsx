import { parseMarkdown, type Inline } from "@/lib/markdown";

function Inlines({ parts }: { parts: Inline[] }) {
  return (
    <>
      {parts.map((p, i) =>
        p.bold ? <strong key={i} className="font-semibold">{p.text}</strong> : p.italic ? <em key={i}>{p.text}</em> : <span key={i}>{p.text}</span>,
      )}
    </>
  );
}

/** Guide body: the safe Markdown subset rendered as plain React elements (no HTML injection). */
export function MarkdownBody({ source }: { source: string }) {
  return (
    <div className="flex max-w-[66ch] flex-col gap-4 text-body leading-relaxed text-text">
      {parseMarkdown(source).map((b, i) => {
        if (b.type === "h2" || b.type === "h3") {
          return b.type === "h2" ? (
            <h2 key={i} className="m-0 mt-4 font-serif-display text-subhead font-bold">{b.text}</h2>
          ) : (
            <h3 key={i} className="m-0 mt-2 font-serif-display text-name font-bold">{b.text}</h3>
          );
        }
        if (b.type === "p") return <p key={i} className="m-0"><Inlines parts={b.inlines} /></p>;
        const List = b.type === "ul" ? "ul" : "ol";
        return (
          <List key={i} className={`m-0 flex flex-col gap-1.5 pl-5 ${b.type === "ul" ? "list-disc" : "list-decimal"} marker:text-muted`}>
            {b.items.map((item, j) => (
              <li key={j}><Inlines parts={item} /></li>
            ))}
          </List>
        );
      })}
    </div>
  );
}
