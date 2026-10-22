import { describe, it, expect } from "vitest";
import { parseInline, parseMarkdown } from "@/lib/markdown";

describe("parseInline", () => {
  it("splits bold and italic runs", () => {
    expect(parseInline("Usa **líder** de *fluoro* siempre")).toEqual([
      { text: "Usa " },
      { text: "líder", bold: true },
      { text: " de " },
      { text: "fluoro", italic: true },
      { text: " siempre" },
    ]);
  });
  it("leaves unmatched markers as text", () => {
    expect(parseInline("3 * 4")).toEqual([{ text: "3 * 4" }]);
  });
});

describe("parseMarkdown", () => {
  it("builds headings, paragraphs and lists", () => {
    const md = "## Equipo\nUna caña\nmediana.\n\n- Carrete 3000\n- Línea 20 lb\n\n1. Lanza\n2. Recoge";
    expect(parseMarkdown(md)).toEqual([
      { type: "h2", text: "Equipo" },
      { type: "p", inlines: [{ text: "Una caña mediana." }] },
      { type: "ul", items: [[{ text: "Carrete 3000" }], [{ text: "Línea 20 lb" }]] },
      { type: "ol", items: [[{ text: "Lanza" }], [{ text: "Recoge" }]] },
    ]);
  });
  it("never emits raw HTML: tags stay as plain text", () => {
    expect(parseMarkdown("<script>x</script>")).toEqual([{ type: "p", inlines: [{ text: "<script>x</script>" }] }]);
  });
});
