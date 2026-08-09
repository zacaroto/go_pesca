import { createClient } from "@/lib/supabase/client";
import type { Database } from "./database.types";
import type { FeedCatch, FeedReactions, ReactionCounts } from "./feed";

type ReactionRow = Database["public"]["Tables"]["catch_reactions"]["Row"];

const FEED_PAGE_SIZE = 20;

/**
 * Fetch more feed catches from the client (for "Load more" pagination).
 */
export async function fetchMoreFeedCatches(
  locale: string,
  cursor: string,
  limit = FEED_PAGE_SIZE
): Promise<FeedCatch[]> {
  const supabase = createClient();

  const nameCol = locale === "en" ? "name_en" : "name_es";

  const { data, error } = await supabase
    .from("catches")
    .select(
      `id, user_id, photo_url, location_name, catch_date, created_at,
       species:species_id (${nameCol}),
       profile:user_id (display_name, avatar_url)`
    )
    .eq("is_public", true)
    .lt("created_at", cursor)
    .order("created_at", { ascending: false })
    .limit(limit);

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
    };
  });
}

/**
 * Fetch reactions for catches from the client (for paginated loads).
 */
export async function fetchMoreReactions(
  catchIds: string[]
): Promise<Record<string, FeedReactions>> {
  if (catchIds.length === 0) return {};

  const supabase = createClient();

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
 * Toggle a reaction on a catch (client-side).
 */
export async function toggleReaction(
  catchId: string,
  reactionType: string
): Promise<{ action: "added" | "removed" | "changed"; reactionType: string | null }> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data: existingData } = await supabase
    .from("catch_reactions")
    .select("id, reaction_type")
    .eq("user_id", user.id)
    .eq("catch_id", catchId)
    .maybeSingle();

  const existing = existingData as Pick<ReactionRow, "id" | "reaction_type"> | null;

  if (!existing) {
    const { error } = await supabase
      .from("catch_reactions")
      .insert({ user_id: user.id, catch_id: catchId, reaction_type: reactionType } as never);
    if (error) throw error;
    return { action: "added", reactionType };
  }

  if (existing.reaction_type === reactionType) {
    const { error } = await supabase
      .from("catch_reactions")
      .delete()
      .eq("id", existing.id);
    if (error) throw error;
    return { action: "removed", reactionType: null };
  }

  const { error } = await supabase
    .from("catch_reactions")
    .update({ reaction_type: reactionType } as never)
    .eq("id", existing.id);
  if (error) throw error;
  return { action: "changed", reactionType };
}
