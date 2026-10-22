import { describe, it, expect } from "vitest";
import { groupFacts, type FactRow } from "@/lib/species-facts-data";

const sp = (id: number, name: string) => ({
  id,
  name_es: name,
  name_en: `${name} EN`,
  scientific_name: `Sci ${id}`,
  reference_photo_url: `https://x/${id}.jpg`,
});
const row = (s: ReturnType<typeof sp> | null, order: number, es: string): FactRow => ({
  fact_es: es,
  fact_en: `${es} EN`,
  sort_order: order,
  species: s,
});

describe("groupFacts", () => {
  it("groups facts per species in first-seen order, sorted by sort_order", () => {
    const vela = sp(1, "Pez vela");
    const sabalo = sp(2, "Sábalo");
    const out = groupFacts([row(vela, 2, "b"), row(sabalo, 1, "x"), row(vela, 1, "a")], "es");
    expect(out.map((s) => s.name)).toEqual(["Pez vela", "Sábalo"]);
    expect(out[0].facts).toEqual(["a", "b"]);
  });
  it("uses the English name and fact for en", () => {
    const out = groupFacts([row(sp(1, "Dorado"), 1, "dato")], "en");
    expect(out[0]).toMatchObject({ name: "Dorado EN", facts: ["dato EN"], photoCredit: null });
  });
  it("skips rows whose species did not join", () => {
    expect(groupFacts([row(null, 1, "huérfano")], "es")).toEqual([]);
  });
});
