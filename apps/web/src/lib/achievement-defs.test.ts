import { describe, it, expect } from "vitest";
import { ACHIEVEMENT_DEFS, achievementProgress, nextAchievement, stampTilt } from "@/lib/achievement-defs";

const def = (id: string) => ACHIEVEMENT_DEFS.find((d) => d.id === id)!;

describe("achievementProgress", () => {
  it("counts catches or species and caps at the threshold", () => {
    expect(achievementProgress(def("catch_10"), { catches: 4, species: 2 })).toEqual({ current: 4, total: 10 });
    expect(achievementProgress(def("species_5"), { catches: 4, species: 7 })).toEqual({ current: 5, total: 5 });
  });
  it("has no progress for one-off feats", () => {
    expect(achievementProgress(def("night_owl"), { catches: 4, species: 2 })).toBeNull();
  });
});

describe("nextAchievement", () => {
  it("picks the unearned countable achievement closest to done", () => {
    const earned = new Set(["first_blood"]);
    expect(nextAchievement(ACHIEVEMENT_DEFS, earned, { catches: 4, species: 3 })?.id).toBe("species_5");
  });
  it("is null when everything countable is earned", () => {
    const earned = new Set(ACHIEVEMENT_DEFS.filter((d) => d.type !== "special").map((d) => d.id));
    expect(nextAchievement(ACHIEVEMENT_DEFS, earned, { catches: 60, species: 25 })).toBeNull();
  });
});

describe("stampTilt", () => {
  it("is deterministic and within ±8°", () => {
    for (const d of ACHIEVEMENT_DEFS) {
      expect(stampTilt(d.id)).toBe(stampTilt(d.id));
      expect(Math.abs(stampTilt(d.id))).toBeLessThanOrEqual(8);
    }
  });
});
