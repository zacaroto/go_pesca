export type RankKey = "sardina" | "tilapia" | "robalo" | "dorado" | "marlinAzul";

export type RankInfo = {
  key: RankKey;
  level: 1 | 2 | 3;
  percentage: number;
};

const THRESHOLDS: { min: number; key: RankKey; level: 1 | 2 | 3 }[] = [
  { min: 93, key: "marlinAzul", level: 3 },
  { min: 87, key: "marlinAzul", level: 2 },
  { min: 80, key: "marlinAzul", level: 1 },
  { min: 73, key: "dorado", level: 3 },
  { min: 67, key: "dorado", level: 2 },
  { min: 60, key: "dorado", level: 1 },
  { min: 53, key: "robalo", level: 3 },
  { min: 47, key: "robalo", level: 2 },
  { min: 40, key: "robalo", level: 1 },
  { min: 33, key: "tilapia", level: 3 },
  { min: 27, key: "tilapia", level: 2 },
  { min: 20, key: "tilapia", level: 1 },
  { min: 13, key: "sardina", level: 3 },
  { min: 7, key: "sardina", level: 2 },
  { min: 0, key: "sardina", level: 1 },
];

export function getRank(caught: number, total: number): RankInfo {
  const percentage = total > 0 ? Math.round((caught / total) * 100) : 0;
  const match = THRESHOLDS.find((t) => percentage >= t.min) ?? THRESHOLDS[THRESHOLDS.length - 1];
  return { key: match.key, level: match.level, percentage };
}
