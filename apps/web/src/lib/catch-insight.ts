export type SpeciesBest = { speciesId: number; bestWeightKg: number | null };

export type CatchInsight =
  | { kind: "none" }
  | { kind: "new"; caughtAfter: number }
  | { kind: "record"; previousBestKg: number }
  | { kind: "known"; bestKg: number | null };

export function getCatchInsight(speciesId: number | null, weightKg: number | null, bests: SpeciesBest[]): CatchInsight {
  if (speciesId === null) return { kind: "none" };
  const match = bests.find((b) => b.speciesId === speciesId);
  if (!match) return { kind: "new", caughtAfter: bests.length + 1 };
  if (weightKg !== null && match.bestWeightKg !== null && weightKg > match.bestWeightKg) {
    return { kind: "record", previousBestKg: match.bestWeightKg };
  }
  return { kind: "known", bestKg: match.bestWeightKg };
}
