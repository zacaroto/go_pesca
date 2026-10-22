import { describe, it, expect } from "vitest";
import { getRank, getNextRank, rankUpAfter } from "@/lib/rank";

describe("getRank (absolute species counts)", () => {
  it("starts at Sardina I with no species", () => {
    expect(getRank(0)).toMatchObject({ key: "sardina", level: 1 });
  });
  it("maps counts to rank and level at the thresholds", () => {
    expect(getRank(2)).toMatchObject({ key: "sardina", level: 3 });
    expect(getRank(3)).toMatchObject({ key: "tilapia", level: 1 });
    expect(getRank(8)).toMatchObject({ key: "robalo", level: 1 });
    expect(getRank(9)).toMatchObject({ key: "robalo", level: 1 });
    expect(getRank(25)).toMatchObject({ key: "marlinAzul", level: 1 });
    expect(getRank(40)).toMatchObject({ key: "marlinAzul", level: 3 });
  });
  it("never depends on catalog size, so adding species can't demote anyone", () => {
    expect(getRank(8)).toEqual(getRank(8));
  });
});

describe("getNextRank", () => {
  it("returns the next step, how many species it needs and where the current step started", () => {
    expect(getNextRank(9)).toEqual({ key: "robalo", level: 2, at: 10, from: 8, speciesNeeded: 1 });
    expect(getNextRank(0)).toEqual({ key: "sardina", level: 2, at: 1, from: 0, speciesNeeded: 1 });
  });
  it("crosses into the next rank after level III", () => {
    expect(getNextRank(13)).toMatchObject({ key: "dorado", level: 1, at: 15, speciesNeeded: 2 });
  });
  it("is null at the top of the ladder", () => {
    expect(getNextRank(35)).toBeNull();
    expect(getNextRank(50)).toBeNull();
  });
});

describe("rankUpAfter", () => {
  it("returns the new step when one more species crosses a threshold", () => {
    expect(rankUpAfter(7)).toEqual({ key: "robalo", level: 1 });
  });
  it("is null when one more species stays on the same step", () => {
    expect(rankUpAfter(8)).toBeNull();
  });
});
