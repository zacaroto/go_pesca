import type { FeedCatch, FeedReactions } from "./feed";

const DAY = 86_400_000;

export function totalReactions(r: FeedReactions | undefined): number {
  if (!r) return 0;
  return Object.values(r.counts).reduce((sum, n) => sum + n, 0);
}

function daysAgo(dateStr: string, now: Date): number {
  return (now.getTime() - new Date(`${dateStr}T00:00:00Z`).getTime()) / DAY;
}

type Translate = (key: string, values?: Record<string, string | number>) => string;

/** Relative catch date. `t` is scoped to the `feed` namespace (today, yesterday, daysAgo). */
export function relativeDate(dateStr: string, now: Date, locale: string, t: Translate): string {
  const diff = Math.floor(daysAgo(dateStr, now));
  if (diff <= 0) return t("today");
  if (diff === 1) return t("yesterday");
  if (diff < 7) return t("daysAgo", { count: diff });
  return new Date(`${dateStr}T00:00:00Z`).toLocaleDateString(locale, {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  });
}

export function pickFeatured(catches: FeedCatch[], reactions: Record<string, FeedReactions>, now: Date) {
  if (catches.length === 0) return { featured: null, rest: [] as FeedCatch[] };
  const recent = catches.filter((c) => daysAgo(c.catch_date, now) <= 7);
  const featured = recent.length
    ? recent.reduce((best, c) => {
        const diff = totalReactions(reactions[c.id]) - totalReactions(reactions[best.id]);
        return diff > 0 || (diff === 0 && c.created_at > best.created_at) ? c : best;
      })
    : catches[0];
  return { featured, rest: catches.filter((c) => c.id !== featured.id) };
}

export type CommunityRecords = {
  heaviest: FeedCatch | null;
  topSpecies: { name: string; count: number } | null;
  weekCount: number;
};

export function computeRecords(catches: FeedCatch[], now: Date): CommunityRecords {
  const month = now.toISOString().slice(0, 7);
  const thisMonth = catches.filter((c) => c.catch_date.startsWith(month));

  let heaviest: FeedCatch | null = null;
  const counts = new Map<string, number>();
  for (const c of thisMonth) {
    if (c.weight_kg !== null && (heaviest === null || c.weight_kg > (heaviest.weight_kg ?? 0))) heaviest = c;
    counts.set(c.species_name, (counts.get(c.species_name) ?? 0) + 1);
  }

  let topSpecies: CommunityRecords["topSpecies"] = null;
  for (const [name, count] of counts) {
    if (!topSpecies || count > topSpecies.count) topSpecies = { name, count };
  }

  return { heaviest, topSpecies, weekCount: catches.filter((c) => daysAgo(c.catch_date, now) <= 7).length };
}
