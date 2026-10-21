import type { FeedCatch, FeedReactions } from "./feed";

const DAY = 86_400_000;

export function totalReactions(r: FeedReactions | undefined): number {
  if (!r) return 0;
  return Object.values(r.counts).reduce((sum, n) => sum + n, 0);
}

const dayMs = (iso: string) => {
  const [y, m, d] = iso.slice(0, 10).split("-").map(Number);
  return Date.UTC(y, m - 1, d);
};

/** Whole calendar days between a catch date and "today" in Costa Rica (same on server and client). */
function daysAgo(dateStr: string, now: Date): number {
  return Math.round((dayMs(communityWindows(now).today) - dayMs(dateStr)) / DAY);
}

type Translate = (key: string, values?: Record<string, string | number>) => string;

/** Relative catch date. `t` is scoped to the `feed` namespace (today, yesterday, daysAgo). */
export function relativeDate(dateStr: string, now: Date, locale: string, t: Translate): string {
  const diff = daysAgo(dateStr, now);
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
  const today = dayMs(communityWindows(now).today);
  const recent = catches.filter((c) => (today - dayMs(c.catch_date)) / DAY <= 7);
  const featured = recent.length
    ? recent.reduce((best, c) => {
        const diff = totalReactions(reactions[c.id]) - totalReactions(reactions[best.id]);
        return diff > 0 || (diff === 0 && c.created_at > best.created_at) ? c : best;
      })
    : catches[0];
  return { featured, rest: catches.filter((c) => c.id !== featured.id) };
}

export type CommunityRecords = {
  heaviest: { species_name: string; location_name: string | null; weight_kg: number } | null;
  topSpecies: { name: string; count: number } | null;
  weekCount: number;
};

export const EMPTY_RECORDS: CommunityRecords = { heaviest: null, topSpecies: null, weekCount: 0 };

const pad = (n: number) => String(n).padStart(2, "0");

/** Calendar windows (YYYY-MM-DD) in a fixed time zone, independent of the server's zone. */
export function communityWindows(now: Date, timeZone = "America/Costa_Rica") {
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone, year: "numeric", month: "2-digit", day: "2-digit" })
    .formatToParts(now);
  const get = (type: string) => Number(parts.find((p) => p.type === type)!.value);
  const [y, m, d] = [get("year"), get("month"), get("day")];
  const iso = (ms: number) => new Date(ms).toISOString().slice(0, 10);
  const todayMs = Date.UTC(y, m - 1, d);
  return {
    today: iso(todayMs),
    weekStart: iso(todayMs - 6 * DAY),
    monthStart: `${y}-${pad(m)}-01`,
    nextMonthStart: m === 12 ? `${y + 1}-01-01` : `${y}-${pad(m + 1)}-01`,
  };
}

export function tallyTopSpecies(rows: { species_name: string }[]): { name: string; count: number } | null {
  const counts = new Map<string, number>();
  for (const r of rows) counts.set(r.species_name, (counts.get(r.species_name) ?? 0) + 1);
  let top: { name: string; count: number } | null = null;
  for (const [name, count] of counts) {
    if (!top || count > top.count || (count === top.count && name < top.name)) top = { name, count };
  }
  return top;
}
