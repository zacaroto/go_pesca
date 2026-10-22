export type SeasonRegion = "pacific" | "caribbean" | "freshwater";

export type SeasonRow = {
  species_id: number;
  region: SeasonRegion;
  /** Jan..Dec: 0 not fished/closed, 1 can be caught, 2 good, 3 peak. */
  months: number[];
};

const CR_TZ = "America/Costa_Rica";

/** Month index (0 = January) on the Costa Rica calendar, so SSR and the browser agree. */
export function crMonth(now: Date): number {
  return Number(new Intl.DateTimeFormat("en-US", { timeZone: CR_TZ, month: "numeric" }).format(now)) - 1;
}

/** Whole weeks since 2024-01-01 in Costa Rica; drives the "knot of the week" rotation. */
export function crWeek(now: Date): number {
  const ymd = new Intl.DateTimeFormat("en-CA", { timeZone: CR_TZ }).format(now); // YYYY-MM-DD
  const days = (Date.parse(`${ymd}T00:00:00Z`) - Date.UTC(2024, 0, 1)) / 86_400_000;
  return Math.floor(days / 7);
}

export function knotOfTheWeek<T>(knots: T[], now: Date): T | null {
  if (knots.length === 0) return null;
  return knots[((crWeek(now) % knots.length) + knots.length) % knots.length];
}

/**
 * Species worth going for this month: best level across regions, at least `minLevel`,
 * peak first. One entry per species, carrying the region where it peaks.
 */
export function inSeason(rows: SeasonRow[], month: number, minLevel = 2): { species_id: number; region: SeasonRegion; level: number }[] {
  const best = new Map<number, { species_id: number; region: SeasonRegion; level: number }>();
  for (const r of rows) {
    const level = r.months[month] ?? 0;
    const current = best.get(r.species_id);
    if (level >= minLevel && (!current || level > current.level)) best.set(r.species_id, { species_id: r.species_id, region: r.region, level });
  }
  return [...best.values()].sort((a, b) => b.level - a.level || a.species_id - b.species_id);
}

/** "3 de 9": how many of a chapter's items the angler finished. */
export function chapterProgress(slugs: string[], done: Set<string>): { done: number; total: number } {
  return { done: slugs.filter((s) => done.has(s)).length, total: slugs.length };
}
