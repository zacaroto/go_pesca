import { describe, it, expect } from "vitest";
import { filterGallery, speciesCounts, type GalleryCatch } from "@/lib/catch-gallery";

const c = (id: string, species_id: number, species_name: string, catch_date: string, weight_kg: number | null, location_name: string | null = null): GalleryCatch => ({
  id,
  species_id,
  species_name,
  catch_date,
  weight_kg,
  location_name,
});

const list = [
  c("1", 3, "Róbalo", "2026-08-03", 12.4, "Tárcoles"),
  c("2", 17, "Sierra", "2026-08-17", 1.9, "Puntarenas"),
  c("3", 13, "Corvina Aguada", "2026-06-28", null, "Golfo de Nicoya"),
  c("4", 3, "Róbalo", "2026-03-14", 5.6, "Golfo de Nicoya"),
];

describe("filterGallery", () => {
  it("shows the newest first by default", () => {
    expect(filterGallery(list, { query: "", speciesId: null, sort: "recent" }).map((x) => x.id)).toEqual(["2", "1", "3", "4"]);
  });
  it("sorts heaviest first, unweighed last", () => {
    expect(filterGallery(list, { query: "", speciesId: null, sort: "heaviest" }).map((x) => x.id)).toEqual(["1", "4", "2", "3"]);
  });
  it("filters by species", () => {
    expect(filterGallery(list, { query: "", speciesId: 3, sort: "recent" }).map((x) => x.id)).toEqual(["1", "4"]);
  });
  it("searches species and place, ignoring accents and case", () => {
    expect(filterGallery(list, { query: "robalo", speciesId: null, sort: "recent" }).map((x) => x.id)).toEqual(["1", "4"]);
    expect(filterGallery(list, { query: "nicoya", speciesId: null, sort: "recent" }).map((x) => x.id)).toEqual(["3", "4"]);
  });
});

describe("speciesCounts", () => {
  it("counts catches per species, most caught first, then by name", () => {
    expect(speciesCounts(list)).toEqual([
      { id: 3, name: "Róbalo", count: 2 },
      { id: 13, name: "Corvina Aguada", count: 1 },
      { id: 17, name: "Sierra", count: 1 },
    ]);
  });
});
