import { createClient } from "@/lib/supabase/server";
import type { GroupWithMemberCount } from "@/lib/groups";
import type { OverviewCatch } from "@/lib/group-overview";

export async function getUserGroupsServer(userId: string): Promise<GroupWithMemberCount[]> {
  const supabase = await createClient();

  const { data: memberships, error: memError } = await supabase
    .from("group_members")
    .select("group_id")
    .eq("user_id", userId);
  if (memError) throw memError;
  if (!memberships || memberships.length === 0) return [];

  const groupIds = memberships.map(
    (m: { group_id: string }) => m.group_id
  );

  const { data: groups, error: groupsError } = await supabase
    .from("groups")
    .select("*")
    .in("id", groupIds)
    .order("created_at", { ascending: false });
  if (groupsError) throw groupsError;

  const result: GroupWithMemberCount[] = [];
  for (const group of groups ?? []) {
    const { count } = await supabase
      .from("group_members")
      .select("*", { count: "exact", head: true })
      .eq("group_id", (group as { id: string }).id);

    result.push({
      ...(group as Omit<GroupWithMemberCount, "member_count">),
      member_count: count ?? 0,
    });
  }

  return result;
}

export async function getGroupMembers(groupId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("group_members")
    .select("user_id, role, joined_at, profile:user_id (display_name, avatar_url)")
    .eq("group_id", groupId)
    .order("joined_at", { ascending: true });
  if (error) throw error;

  return (data ?? []).map((row: Record<string, unknown>) => {
    const profile = row.profile as Record<string, string> | null;
    return {
      user_id: row.user_id as string,
      role: row.role as string,
      joined_at: row.joined_at as string,
      display_name: profile?.display_name ?? "",
      avatar_url: profile?.avatar_url ?? null,
    };
  });
}

export async function getGroupByInviteCode(code: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("groups")
    .select("*")
    .eq("invite_code", code)
    .single();
  if (error) return null;

  // Get member count
  const { count } = await supabase
    .from("group_members")
    .select("*", { count: "exact", head: true })
    .eq("group_id", (data as { id: string }).id);

  return {
    ...(data as Omit<GroupWithMemberCount, "member_count">),
    member_count: count ?? 0,
  };
}

export async function getGroupById(groupId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("groups")
    .select("*")
    .eq("id", groupId)
    .single();
  if (error) return null;

  const { count } = await supabase
    .from("group_members")
    .select("*", { count: "exact", head: true })
    .eq("group_id", groupId);

  return {
    ...(data as Omit<GroupWithMemberCount, "member_count">),
    member_count: count ?? 0,
  };
}

export async function isGroupMember(groupId: string, userId: string): Promise<boolean> {
  const supabase = await createClient();

  const { count, error } = await supabase
    .from("group_members")
    .select("*", { count: "exact", head: true })
    .eq("group_id", groupId)
    .eq("user_id", userId);
  if (error) return false;

  return (count ?? 0) > 0;
}

export type GroupOverviewMember = { user_id: string; display_name: string; avatar_url: string | null };

/**
 * Members (with profiles) of several groups and the newest catches they shared to groups, in two
 * queries, for the groups index cards. Never selects latitude or longitude.
 */
export async function getGroupsOverviewData(groupIds: string[], locale: string, limit = 80) {
  if (groupIds.length === 0) return { members: new Map<string, GroupOverviewMember[]>(), catches: [] as OverviewCatch[] };
  const supabase = await createClient();
  const { data: rows, error } = await supabase
    .from("group_members")
    .select("group_id, user_id, joined_at, profile:user_id (display_name, avatar_url)")
    .in("group_id", groupIds)
    .order("joined_at", { ascending: true });
  if (error) throw error;

  const members = new Map<string, GroupOverviewMember[]>();
  for (const row of (rows ?? []) as Record<string, unknown>[]) {
    const profile = row.profile as { display_name?: string; avatar_url?: string | null } | null;
    const list = members.get(row.group_id as string) ?? [];
    list.push({ user_id: row.user_id as string, display_name: profile?.display_name ?? "", avatar_url: profile?.avatar_url ?? null });
    members.set(row.group_id as string, list);
  }

  const memberIds = [...new Set([...members.values()].flat().map((m) => m.user_id))];
  const nameCol = locale === "en" ? "name_en" : "name_es";
  const { data: catchRows, error: catchError } = await supabase
    .from("catches")
    .select(`id, user_id, photo_url, catch_date, created_at, weight_kg, species:species_id (${nameCol}), profile:user_id (display_name)`)
    .in("user_id", memberIds)
    .eq("share_to_groups", true)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (catchError) throw catchError;

  const catches: OverviewCatch[] = ((catchRows ?? []) as Record<string, unknown>[]).map((r) => ({
    id: r.id as string,
    user_id: r.user_id as string,
    photo_url: (r.photo_url as string | null) ?? null,
    species_name: (r.species as Record<string, string> | null)?.[nameCol] ?? "",
    weight_kg: (r.weight_kg as number | null) ?? null,
    catch_date: r.catch_date as string,
    created_at: r.created_at as string,
    display_name: (r.profile as { display_name?: string } | null)?.display_name ?? "",
  }));
  return { members, catches };
}
