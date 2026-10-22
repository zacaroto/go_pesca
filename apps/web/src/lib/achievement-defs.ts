export type AchievementDef = {
  id: string;
  type: "catch_count" | "species_count" | "special";
  threshold: number;
};

/** Catalog order of the stamp book. The award rules live in lib/achievements.ts. */
export const ACHIEVEMENT_DEFS: AchievementDef[] = [
  { id: "first_blood", type: "catch_count", threshold: 1 },
  { id: "catch_10", type: "catch_count", threshold: 10 },
  { id: "catch_50", type: "catch_count", threshold: 50 },
  { id: "species_5", type: "species_count", threshold: 5 },
  { id: "species_10", type: "species_count", threshold: 10 },
  { id: "species_20", type: "species_count", threshold: 20 },
  { id: "big_catch", type: "special", threshold: 0 },
  { id: "early_bird", type: "special", threshold: 0 },
  { id: "night_owl", type: "special", threshold: 0 },
];

export type AnglerStats = { catches: number; species: number };

/** Progress toward a countable achievement, capped at its threshold; null for one-off feats. */
export function achievementProgress(def: AchievementDef, stats: AnglerStats): { current: number; total: number } | null {
  if (def.type === "special") return null;
  const value = def.type === "catch_count" ? stats.catches : stats.species;
  return { current: Math.min(value, def.threshold), total: def.threshold };
}

/** The unearned countable achievement closest to done (by share), first in catalog order on ties. */
export function nextAchievement(defs: AchievementDef[], earned: Set<string>, stats: AnglerStats): AchievementDef | null {
  let best: { def: AchievementDef; share: number } | null = null;
  for (const def of defs) {
    if (earned.has(def.id)) continue;
    const p = achievementProgress(def, stats);
    if (!p) continue;
    const share = p.current / p.total;
    if (!best || share > best.share) best = { def, share };
  }
  return best?.def ?? null;
}

/** Stable "hand-stamped" tilt per achievement (-8°..8°), same on server and client. */
export function stampTilt(id: string): number {
  let h = 0;
  for (const ch of id) h = (h * 31 + ch.charCodeAt(0)) | 0;
  return (Math.abs(h) % 17) - 8;
}
