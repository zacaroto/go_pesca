import { describe, it, expect } from "vitest";
import { speciesNeighbors } from "@/lib/species-neighbors";

const list = [
  { id: 12, name: "Atún Aleta Amarilla" },
  { id: 4, name: "Sábalo" },
  { id: 24, name: "Barbudo" },
  { id: 7, name: "Dorado" },
];

describe("speciesNeighbors", () => {
  it("follows alphabetical catalog order, folding accents", () => {
    expect(speciesNeighbors(list, 24, "es")).toEqual({
      prev: { id: 12, name: "Atún Aleta Amarilla" },
      next: { id: 7, name: "Dorado" },
    });
  });
  it("wraps around at both ends", () => {
    expect(speciesNeighbors(list, 12, "es")?.prev.id).toBe(4);
    expect(speciesNeighbors(list, 4, "es")?.next.id).toBe(12);
  });
  it("returns null for an unknown id or a single species", () => {
    expect(speciesNeighbors(list, 99, "es")).toBeNull();
    expect(speciesNeighbors([list[0]], 12, "es")).toBeNull();
  });
});
