import { createClient } from "@/lib/supabase/server";
import type { FeedCatch } from "./feed";

const GROUP_FEED_PAGE_SIZE = 20;

/**
 * Fetch catches for a group feed (server-side).
 * Returns catches from all group members where share_to_groups = true,
 * regardless of is_public (private catches are visible in groups).
 * Never returns latitude or longitude.
 */
export async function fetchGroupFeedCatches(
  groupId: string,
  locale: string,
  cursor?: string,
  limit = GROUP_FEED_PAGE_SIZE
): Promise<FeedCatch[]> {
  const supabase = await createClient();

  // Get member user IDs for this group
  const { data: members, error: memError } = await supabase
    .from("group_members")
    .select("user_id")
    .eq("group_id", groupId);
  if (memError) throw memError;
  if (!members || members.length === 0) return [];

  const memberIds = members.map((m: { user_id: string }) => m.user_id);
  const nameCol = locale === "en" ? "name_en" : "name_es";

  let query = supabase
    .from("catches")
    .select(
      `id, user_id, photo_url, location_name, catch_date, created_at,
       species:species_id (${nameCol}),
       profile:user_id (display_name, avatar_url)`
    )
    .in("user_id", memberIds)
    .eq("share_to_groups", true)
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
    };
  });
}
