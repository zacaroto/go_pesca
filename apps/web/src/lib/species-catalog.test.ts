import { describe, it, expect } from "vitest";
import { catalogCounts, filterCatalog, type CatalogSpecies } from "@/lib/species-catalog";

const s = (id: number, name_es: string, habitat: string, max_weight_kg: number | null, regulation: string | null = null): CatalogSpecies => ({
  id,
  name_es,
  name_en: `${name_es} EN`,
  scientific_name: `Sci ${name_es}`,
  habitat,
  max_weight_kg,
  regulation,
});

const list = [
  s(1, "Sábalo", "saltwater", 161),
  s(2, "Barbudo", "freshwater", 3),
  s(3, "Pez Vela", "saltwater", 100, "release"),
  s(4, "Róbalo", "brackish", 24),
  s(5, "Mojarra", "brackish", null),
];

describe("filterCatalog", () => {
  it("sorts alphabetically by localized name, folding accents", () => {
    expect(filterCatalog(list, { query: "", filter: "all", sort: "az" }, "es").map((x) => x.id)).toEqual([2, 5, 3, 4, 1]);
  });
  it("sorts largest first, unknown weights last", () => {
    expect(filterCatalog(list, { query: "", filter: "all", sort: "largest" }, "es").map((x) => x.id)).toEqual([1, 3, 4, 2, 5]);
  });
  it("filters by habitat or by catch-and-release", () => {
    expect(filterCatalog(list, { query: "", filter: "brackish", sort: "az" }, "es").map((x) => x.id)).toEqual([5, 4]);
    expect(filterCatalog(list, { query: "", filter: "release", sort: "az" }, "es").map((x) => x.id)).toEqual([3]);
  });
  it("searches common and scientific names without caring about accents or case", () => {
    expect(filterCatalog(list, { query: "robalo", filter: "all", sort: "az" }, "es").map((x) => x.id)).toEqual([4]);
    expect(filterCatalog(list, { query: "sci sáb", filter: "all", sort: "az" }, "es").map((x) => x.id)).toEqual([1]);
  });
});

describe("catalogCounts", () => {
  it("counts every filter", () => {
    expect(catalogCounts(list)).toEqual({ all: 5, saltwater: 2, freshwater: 1, brackish: 2, release: 1 });
  });
});
