import { describe, it, expect } from "vitest";
import { isTrophy, personalRecords, type RecordCatch, type RecordSpecies } from "@/lib/profile-records";

const robalo: RecordSpecies = { id: 3, name: "Róbalo", trophy_weight_kg: 11, trophy_length_cm: 100 };
const jurel: RecordSpecies = { id: 14, name: "Jurel", trophy_weight_kg: 10, trophy_length_cm: 85 };
const mojarra: RecordSpecies = { id: 21, name: "Mojarra", trophy_weight_kg: null, trophy_length_cm: null };

const c = (id: string, species_id: number, weight_kg: number | null, length_cm: number | null, catch_date = "2026-08-01"): RecordCatch => ({
  id,
  species_id,
  weight_kg,
  length_cm,
  catch_date,
});

describe("isTrophy", () => {
  it("counts a catch that reaches the weight or the length threshold", () => {
    expect(isTrophy(c("a", 3, 11, null), robalo)).toBe(true);
    expect(isTrophy(c("b", 3, 5, 104), robalo)).toBe(true);
    expect(isTrophy(c("c", 3, 10.9, 99), robalo)).toBe(false);
  });
  it("is never a trophy without thresholds or measurements", () => {
    expect(isTrophy(c("d", 21, 0.5, 30), mojarra)).toBe(false);
    expect(isTrophy(c("e", 3, null, null), robalo)).toBe(false);
    expect(isTrophy(c("f", 3, 20, 120), undefined)).toBe(false);
  });
});

describe("personalRecords", () => {
  const species = [robalo, jurel, mojarra];

  it("keeps the heaviest catch per species, falling back to length when no weight", () => {
    const out = personalRecords(
      [c("1", 3, 5, 80), c("2", 3, 12.4, 104), c("3", 14, null, 60), c("4", 14, null, 71)],
      species,
    );
    expect(out.map((r) => r.catchId)).toEqual(["2", "4"]);
    expect(out[0]).toMatchObject({ speciesName: "Róbalo", weightKg: 12.4, lengthCm: 104, trophy: true });
    expect(out[1]).toMatchObject({ speciesName: "Jurel", weightKg: null, lengthCm: 71, trophy: false });
  });

  it("puts trophies first, then heavier records", () => {
    const out = personalRecords([c("1", 21, 0.5, 30), c("2", 14, 6.8, 71), c("3", 3, 11.5, 90)], species);
    expect(out.map((r) => r.speciesName)).toEqual(["Róbalo", "Jurel", "Mojarra"]);
  });

  it("skips catches of species that are not in the catalog", () => {
    expect(personalRecords([c("1", 99, 3, 30)], species)).toEqual([]);
  });
});
