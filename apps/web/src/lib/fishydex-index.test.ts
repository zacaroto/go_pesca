import { describe, it, expect } from "vitest";
import { buildSpeciesIndex, countByHabitat, nextBestWeight } from "@/lib/fishydex-index";
import type { PokedexEntry } from "@/lib/pokedex";

const e = (id: number, name_es: string, habitat: string, catch_count = 0): PokedexEntry => ({
  id, name_es, name_en: name_es, scientific_name: "", habitat, reference_photo_url: null,
  catch_count, first_catch_date: null, last_catch_date: null, first_catch_photo: null,
  description_es: null, description_en: null, best_weight_kg: null,
});

const list = [
  e(1, "Sábalo", "saltwater", 2), e(2, "Atún aleta amarilla", "saltwater", 1),
  e(3, "Barracuda", "saltwater"), e(4, "Guapote", "freshwater", 1),
  e(5, "Róbalo", "brackish", 1), e(6, "Ñato", "freshwater"),
];

describe("buildSpeciesIndex", () => {
  it("groups by first letter in Spanish order, folding accents but keeping Ñ", () => {
    const letters = buildSpeciesIndex(list, "es", "all").map((s) => s.letter);
    expect(letters).toEqual(["A", "B", "G", "Ñ", "R", "S"]);
  });
  it("filters by habitat", () => {
    const names = buildSpeciesIndex(list, "es", "saltwater").flatMap((s) => s.entries.map((x) => x.name_es));
    expect(names).toEqual(["Atún aleta amarilla", "Barracuda", "Sábalo"]);
  });
  it("returns no sections when nothing matches", () => {
    expect(buildSpeciesIndex([], "es", "all")).toEqual([]);
  });
});

describe("countByHabitat", () => {
  it("counts caught and total per habitat", () => {
    expect(countByHabitat(list)).toEqual({
      saltwater: { caught: 2, total: 3 },
      freshwater: { caught: 1, total: 2 },
      brackish: { caught: 1, total: 1 },
    });
  });
});

describe("nextBestWeight", () => {
  it("treats zero, negative and missing weights as no weight", () => {
    expect(nextBestWeight(null, 0)).toBeNull();
    expect(nextBestWeight(null, -2)).toBeNull();
    expect(nextBestWeight(null, null)).toBeNull();
  });
  it("keeps the maximum positive weight", () => {
    expect(nextBestWeight(null, 3.2)).toBe(3.2);
    expect(nextBestWeight(3.2, 0)).toBe(3.2);
    expect(nextBestWeight(3.2, 5)).toBe(5);
  });
});
