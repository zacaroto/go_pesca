import { describe, it, expect } from "vitest";
import { pickLatestNewSpecies, type HomeCatch } from "@/lib/home-data";

const c = (id: string, species_id: number, catch_date: string): HomeCatch => ({
  id, species_id, catch_date, species_name: `s${species_id}`, scientific_name: "", habitat: null,
  description: null, reference_photo_url: null, photo_url: "", location_name: null,
  weight_kg: null, length_cm: null, bait_lure: null,
});

describe("pickLatestNewSpecies", () => {
  it("returns null with no catches", () => {
    expect(pickLatestNewSpecies([])).toBeNull();
  });
  it("ignores repeat catches of an already-caught species", () => {
    const list = [c("a", 1, "2026-09-01"), c("b", 2, "2026-09-10"), c("c", 1, "2026-10-20")];
    expect(pickLatestNewSpecies(list)?.id).toBe("b");
  });
  it("works regardless of input order", () => {
    const list = [c("c", 1, "2026-10-20"), c("b", 2, "2026-09-10"), c("a", 1, "2026-09-01")];
    expect(pickLatestNewSpecies(list)?.id).toBe("b");
  });
});
