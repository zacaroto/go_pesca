import { describe, it, expect } from "vitest";
import { getCatchInsight } from "@/lib/catch-insight";

const bests = [{ speciesId: 7, bestWeightKg: 8.4 }, { speciesId: 10, bestWeightKg: null }];

describe("getCatchInsight", () => {
  it("is none without a species", () => {
    expect(getCatchInsight(null, 5, bests)).toEqual({ kind: "none" });
  });
  it("flags a species not yet in the FishyDex", () => {
    expect(getCatchInsight(3, null, bests)).toEqual({ kind: "new", caughtAfter: 3 });
  });
  it("flags a personal record when heavier than the best", () => {
    expect(getCatchInsight(7, 9.1, bests)).toEqual({ kind: "record", previousBestKg: 8.4 });
  });
  it("is known when equal or lighter, or when there is no weight", () => {
    expect(getCatchInsight(7, 8.4, bests)).toEqual({ kind: "known", bestKg: 8.4 });
    expect(getCatchInsight(7, null, bests)).toEqual({ kind: "known", bestKg: 8.4 });
  });
  it("does not call a record when no previous weight exists", () => {
    expect(getCatchInsight(10, 2, bests)).toEqual({ kind: "known", bestKg: null });
  });
});
