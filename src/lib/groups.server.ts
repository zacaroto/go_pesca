import { createClient } from "@/lib/supabase/server";
import type { GroupWithMemberCount } from "@/lib/groups";

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
