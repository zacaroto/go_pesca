/**
 * Tiny Markdown subset for the Aprender guides: "## " / "### " headings, paragraphs, "- " and
 * "1. " lists, **bold** and *italic*. No HTML and no links, so content can never inject markup.
 */
export type Inline = { text: string; bold?: boolean; italic?: boolean };
type ListBlock = { type: "ul"; items: Inline[][] } | { type: "ol"; items: Inline[][] };
export type Block = { type: "h2"; text: string } | { type: "h3"; text: string } | { type: "p"; inlines: Inline[] } | ListBlock;

/** Splits **bold** and *italic* runs; unmatched markers stay as literal text. */
export function parseInline(text: string): Inline[] {
  const out: Inline[] = [];
  const re = /\*\*([^*]+)\*\*|\*([^*]+)\*/g;
  let last = 0;
  for (let m = re.exec(text); m; m = re.exec(text)) {
    if (m.index > last) out.push({ text: text.slice(last, m.index) });
    out.push(m[1] !== undefined ? { text: m[1], bold: true } : { text: m[2], italic: true });
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push({ text: text.slice(last) });
  return out;
}

export function parseMarkdown(md: string): Block[] {
  const blocks: Block[] = [];
  let para: string[] = [];
  let list: ListBlock | null = null;

  const flushPara = () => {
    if (para.length) blocks.push({ type: "p", inlines: parseInline(para.join(" ")) });
    para = [];
  };
  const flushList = () => {
    if (list) blocks.push(list);
    list = null;
  };

  for (const raw of md.replace(/\r\n/g, "\n").split("\n")) {
    const line = raw.trim();
    const heading = /^(#{2,3})\s+(.*)$/.exec(line);
    const bullet = /^[-*]\s+(.*)$/.exec(line);
    const numbered = /^\d+[.)]\s+(.*)$/.exec(line);
    if (!line) {
      flushPara();
      flushList();
    } else if (heading) {
      flushPara();
      flushList();
      blocks.push(heading[1].length === 2 ? { type: "h2", text: heading[2] } : { type: "h3", text: heading[2] });
    } else if (bullet || numbered) {
      flushPara();
      const type = bullet ? "ul" : "ol";
      if (!list || list.type !== type) {
        flushList();
        list = bullet ? { type: "ul", items: [] } : { type: "ol", items: [] };
      }
      list.items.push(parseInline((bullet ?? numbered)![1]));
    } else {
      flushList();
      // A stray "# " heading becomes plain text: the page already has its own title.
      para.push(line.replace(/^#\s+/, ""));
    }
  }
  flushPara();
  flushList();
  return blocks;
}
