import { createClient } from "@/lib/supabase/server";
import type { Database } from "./database.types";
import { communityWindows, tallyTopSpecies, type CommunityRecords } from "./community-mosaic";

type ReactionRow = Database["public"]["Tables"]["catch_reactions"]["Row"];

export type FeedCatch = {
  id: string;
  user_id: string;
  photo_url: string;
  species_name: string;
  display_name: string;
  avatar_url: string | null;
  location_name: string | null;
  catch_date: string;
  created_at: string;
  weight_kg: number | null;
  habitat: "freshwater" | "saltwater" | "brackish" | null;
  group_name?: string;
};

export type ReactionCounts = {
  fish: number;
  fire: number;
  trophy: number;
  wow: number;
  respect: number;
};

export type FeedReactions = {
  counts: ReactionCounts;
  userReaction: string | null;
};

const FEED_PAGE_SIZE = 20;

/**
 * Fetch public catches for the community feed (server-side).
 * Never returns latitude or longitude.
 */
export async function fetchFeedCatches(
  locale: string,
  cursor?: string,
  limit = FEED_PAGE_SIZE
): Promise<FeedCatch[]> {
  const supabase = await createClient();

  const nameCol = locale === "en" ? "name_en" : "name_es";

  let query = supabase
    .from("catches")
    .select(
      `id, user_id, photo_url, location_name, catch_date, created_at, weight_kg,
       species:species_id (${nameCol}, habitat),
       profile:user_id (display_name, avatar_url)`
    )
    .eq("is_public", true)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (cursor) {
    query = query.lt("created_at", cursor);
  }

  const { data, error } = await query;
  if (error) throw error;

  return (data ?? []).map((row: Record<string, unknown>) => {
    const species = row.species as Record<string, string> | null;
    const profile = row.profile as Record<string, string> | null;
    return {
      id: row.id as string,
      user_id: row.user_id as string,
      photo_url: row.photo_url as string,
      species_name: species?.[nameCol] ?? "",
      display_name: profile?.display_name ?? "",
      avatar_url: (profile?.avatar_url as string) ?? null,
      location_name: row.location_name as string | null,
      catch_date: row.catch_date as string,
      created_at: row.created_at as string,
      weight_kg: row.weight_kg as number | null,
      habitat: (species?.habitat as "freshwater" | "saltwater" | "brackish") ?? null,
    };
  });
}

/**
 * Fetch reaction counts and user's reaction for a batch of catches (server-side).
 */
export async function fetchReactionsForCatches(
  catchIds: string[]
): Promise<Record<string, FeedReactions>> {
  if (catchIds.length === 0) return {};

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: reactionsData, error } = await supabase
    .from("catch_reactions")
    .select("catch_id, user_id, reaction_type")
    .in("catch_id", catchIds);

  if (error) throw error;

  const reactions = (reactionsData ?? []) as Pick<ReactionRow, "catch_id" | "user_id" | "reaction_type">[];
  const result: Record<string, FeedReactions> = {};

  for (const id of catchIds) {
    result[id] = {
      counts: { fish: 0, fire: 0, trophy: 0, wow: 0, respect: 0 },
      userReaction: null,
    };
  }

  for (const r of reactions) {
    const entry = result[r.catch_id];
    if (!entry) continue;

    const type = r.reaction_type as keyof ReactionCounts;
    if (type in entry.counts) {
      entry.counts[type]++;
    }

    if (user && r.user_id === user.id) {
      entry.userReaction = r.reaction_type;
    }
  }

  return result;
}

/**
 * Community records over ALL public catches (server-side): heaviest and top species of the
 * current Costa Rica month, plus the number of catches in the last 7 calendar days.
 * Never selects latitude or longitude.
 * Scale-up path: move the top-species tally into a Postgres RPC (group by species) instead of
 * fetching up to 5000 rows.
 */
export async function fetchCommunityRecords(locale: string, now = new Date()): Promise<CommunityRecords> {
  const supabase = await createClient();
  const nameCol = locale === "en" ? "name_en" : "name_es";
  const { today, weekStart, monthStart, nextMonthStart } = communityWindows(now);

  const [week, heavy, month] = await Promise.all([
    supabase
      .from("catches")
      .select("id", { count: "exact", head: true })
      .eq("is_public", true)
      .gte("catch_date", weekStart)
      .lte("catch_date", today),
    supabase
      .from("catches")
      .select(`weight_kg, location_name, species:species_id (${nameCol})`)
      .eq("is_public", true)
      .gte("catch_date", monthStart)
      .lt("catch_date", nextMonthStart)
      .not("weight_kg", "is", null)
      .order("weight_kg", { ascending: false })
      .limit(1),
    supabase
      .from("catches")
      .select(`species:species_id (${nameCol})`)
      .eq("is_public", true)
      .gte("catch_date", monthStart)
      .lt("catch_date", nextMonthStart)
      .limit(5000),
  ]);

  if (week.error) throw week.error;
  if (heavy.error) throw heavy.error;
  if (month.error) throw month.error;

  const nameOf = (row: unknown) =>
    ((row as { species: Record<string, string> | null }).species?.[nameCol] ?? "") as string;

  const top = heavy.data?.[0] as { weight_kg: number; location_name: string | null } | undefined;
  return {
    weekCount: week.count ?? 0,
    heaviest: top
      ? { weight_kg: top.weight_kg, location_name: top.location_name, species_name: nameOf(top) }
      : null,
    topSpecies: tallyTopSpecies((month.data ?? []).map((r) => ({ species_name: nameOf(r) })).filter((r) => r.species_name)),
  };
}
