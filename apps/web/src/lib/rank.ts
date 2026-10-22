export type RankKey = "sardina" | "tilapia" | "robalo" | "dorado" | "marlinAzul";
export type RankLevel = 1 | 2 | 3;

export type RankInfo = {
  key: RankKey;
  level: RankLevel;
};

export type NextRank = RankInfo & {
  /** Species count at which the next step is reached. */
  at: number;
  /** Species count at which the current step started (for progress bars). */
  from: number;
  speciesNeeded: number;
};

/**
 * Rank ladder by number of distinct species caught (levels I, II, III per rank).
 * Absolute counts, not a percentage of the catalog, so approving new species
 * never demotes anyone.
 */
export const RANK_LADDER: { key: RankKey; levels: [number, number, number] }[] = [
  { key: "sardina", levels: [0, 1, 2] },
  { key: "tilapia", levels: [3, 4, 6] },
  { key: "robalo", levels: [8, 10, 12] },
  { key: "dorado", levels: [15, 18, 21] },
  { key: "marlinAzul", levels: [25, 30, 35] },
];

const STEPS: (RankInfo & { min: number })[] = RANK_LADDER.flatMap(({ key, levels }) =>
  levels.map((min, i) => ({ key, level: (i + 1) as RankLevel, min })),
);

function stepIndex(caught: number): number {
  let index = 0;
  STEPS.forEach((step, i) => {
    if (caught >= step.min) index = i;
  });
  return index;
}

export function getRank(caught: number): RankInfo {
  const { key, level } = STEPS[stepIndex(caught)];
  return { key, level };
}

export function getNextRank(caught: number): NextRank | null {
  const current = stepIndex(caught);
  const next = STEPS[current + 1];
  if (!next) return null;
  return {
    key: next.key,
    level: next.level,
    at: next.min,
    from: STEPS[current].min,
    speciesNeeded: next.min - caught,
  };
}

/** The step reached if one more species is caught, or null if it stays on the same step. */
export function rankUpAfter(caught: number): RankInfo | null {
  return stepIndex(caught + 1) > stepIndex(caught) ? getRank(caught + 1) : null;
}
