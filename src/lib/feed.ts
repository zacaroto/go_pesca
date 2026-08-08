import { createClient } from "@/lib/supabase/server";
import type { Database } from "./database.types";

type ReactionRow = Database["public"]["Tables"]["catch_reactions"]["Row"];

export type FeedCatch = {
  id: string;
  photo_url: string;
  species_name: string;
  display_name: string;
  location_name: string | null;
  catch_date: string;
  created_at: string;
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
      `id, photo_url, location_name, catch_date, created_at,
       species:species_id (${nameCol}),
       profile:user_id (display_name)`
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
      photo_url: row.photo_url as string,
      species_name: species?.[nameCol] ?? "",
      display_name: profile?.display_name ?? "",
      location_name: row.location_name as string | null,
      catch_date: row.catch_date as string,
      created_at: row.created_at as string,
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
