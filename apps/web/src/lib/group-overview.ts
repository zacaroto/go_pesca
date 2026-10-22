export type OverviewCatch = {
  id: string;
  user_id: string;
  photo_url: string | null;
  species_name: string;
  weight_kg: number | null;
  catch_date: string;
  created_at: string;
  display_name: string;
};

export type GroupSummary = {
  photos: string[];
  latest: OverviewCatch | null;
  newThisWeek: number;
};

const WEEK_MS = 7 * 86_400_000;
const MOSAIC = 3;

/**
 * What a group card shows: the newest shared catches of its members (photos for the mosaic),
 * the most recent one, and how many were logged in the last 7 days.
 * `catches` must be newest first and already limited to catches shared to groups.
 */
export function summarizeGroup(memberIds: Set<string>, catches: OverviewCatch[], now: Date): GroupSummary {
  const mine = catches.filter((c) => memberIds.has(c.user_id));
  return {
    photos: mine.map((c) => c.photo_url).filter((p): p is string => Boolean(p)).slice(0, MOSAIC),
    latest: mine[0] ?? null,
    newThisWeek: mine.filter((c) => now.getTime() - Date.parse(c.created_at) <= WEEK_MS).length,
  };
}

/** Accepts a bare invite code or a full invite link (…/groups/join/<code>) and returns the code. */
export function parseInviteCode(input: string): string | null {
  const text = input.trim();
  if (!text) return null;
  const fromLink = /\/groups\/join\/([A-Za-z0-9_-]+)/.exec(text);
  if (fromLink) return fromLink[1];
  return /^[A-Za-z0-9_-]{4,64}$/.test(text) ? text : null;
}
