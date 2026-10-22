import { describe, it, expect } from "vitest";
import { chapterProgress, crMonth, crWeek, inSeason, knotOfTheWeek, type SeasonRow } from "@/lib/learn";

describe("crMonth", () => {
  it("uses the Costa Rica calendar (UTC-6)", () => {
    // 2026-11-01 03:00 UTC is still October 31 in Costa Rica.
    expect(crMonth(new Date("2026-11-01T03:00:00Z"))).toBe(9);
    expect(crMonth(new Date("2026-11-01T12:00:00Z"))).toBe(10);
  });
});

describe("knotOfTheWeek", () => {
  it("rotates weekly and is stable within a week", () => {
    const knots = ["palomar", "clinch", "uni"];
    const mon = new Date("2026-10-19T15:00:00Z");
    const sun = new Date("2026-10-25T15:00:00Z");
    const nextMon = new Date("2026-10-26T15:00:00Z");
    expect(crWeek(sun) - crWeek(mon)).toBe(0);
    expect(knotOfTheWeek(knots, mon)).toBe(knotOfTheWeek(knots, sun));
    expect(knotOfTheWeek(knots, nextMon)).not.toBe(knotOfTheWeek(knots, mon));
  });
  it("is null without knots", () => {
    expect(knotOfTheWeek([], new Date())).toBeNull();
  });
});

describe("inSeason", () => {
  const m = (oct: number) => [0, 0, 0, 0, 0, 0, 0, 0, 0, oct, 0, 0];
  const rows: SeasonRow[] = [
    { species_id: 10, region: "pacific", months: m(3) },
    { species_id: 4, region: "caribbean", months: m(2) },
    { species_id: 4, region: "pacific", months: m(1) },
    { species_id: 7, region: "pacific", months: m(1) },
  ];
  it("keeps species at or above the level, peak first, one row each with its best region", () => {
    expect(inSeason(rows, 9)).toEqual([
      { species_id: 10, region: "pacific", level: 3 },
      { species_id: 4, region: "caribbean", level: 2 },
    ]);
  });
});

describe("chapterProgress", () => {
  it("counts finished items of a chapter", () => {
    expect(chapterProgress(["a", "b", "c"], new Set(["b", "x"]))).toEqual({ done: 1, total: 3 });
  });
});
