import { createClient } from "@/lib/supabase/client";

const MAX_MEMBERS = 20;

function generateInviteCode(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export type GroupWithMemberCount = {
  id: string;
  name: string;
  description: string | null;
  avatar_url: string | null;
  is_public: boolean;
  invite_code: string;
  created_by: string;
  created_at: string;
  member_count: number;
};

export async function createGroup(
  name: string,
  description: string,
  isPublic: boolean,
  avatarFile?: File
) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  let avatarUrl: string | null = null;
  if (avatarFile) {
    const fileName = `groups/${user.id}/${Date.now()}.jpg`;
    const { error: uploadError } = await supabase.storage
      .from("catches")
      .upload(fileName, avatarFile, { contentType: avatarFile.type });
    if (uploadError) throw uploadError;

    const {
      data: { publicUrl },
    } = supabase.storage.from("catches").getPublicUrl(fileName);
    avatarUrl = publicUrl;
  }

  const inviteCode = generateInviteCode();

  const { data: group, error: insertError } = await supabase
    .from("groups")
    .insert({
      name,
      description: description || null,
      avatar_url: avatarUrl,
      is_public: isPublic,
      invite_code: inviteCode,
      created_by: user.id,
    } as never)
    .select()
    .single();
  if (insertError) throw insertError;

  // Add creator as member with 'creator' role
  const { error: memberError } = await supabase
    .from("group_members")
    .insert({
      group_id: (group as { id: string }).id,
      user_id: user.id,
      role: "creator",
    } as never);
  if (memberError) throw memberError;

  return group;
}

export async function updateGroup(
  groupId: string,
  updates: { name?: string; description?: string; is_public?: boolean },
  avatarFile?: File
) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const updateData: Record<string, unknown> = {};
  if (updates.name !== undefined) updateData.name = updates.name;
  if (updates.description !== undefined)
    updateData.description = updates.description || null;
  if (updates.is_public !== undefined) updateData.is_public = updates.is_public;

  if (avatarFile) {
    const fileName = `groups/${user.id}/${Date.now()}.jpg`;
    const { error: uploadError } = await supabase.storage
      .from("catches")
      .upload(fileName, avatarFile, { contentType: avatarFile.type });
    if (uploadError) throw uploadError;

    const {
      data: { publicUrl },
    } = supabase.storage.from("catches").getPublicUrl(fileName);
    updateData.avatar_url = publicUrl;
  }

  const { data, error } = await supabase
    .from("groups")
    .update(updateData as never)
    .eq("id", groupId)
    .eq("created_by", user.id)
    .select()
    .single();
  if (error) throw error;

  return data;
}

export async function deleteGroup(groupId: string) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("groups")
    .delete()
    .eq("id", groupId)
    .eq("created_by", user.id);
  if (error) throw error;
}

export async function joinGroup(inviteCode: string) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  // Look up group by invite code
  const { data: group, error: lookupError } = await supabase
    .from("groups")
    .select("id")
    .eq("invite_code", inviteCode)
    .single();
  if (lookupError || !group) throw new Error("Group not found");

  // Check member count
  const { count, error: countError } = await supabase
    .from("group_members")
    .select("*", { count: "exact", head: true })
    .eq("group_id", (group as { id: string }).id);
  if (countError) throw countError;
  if ((count ?? 0) >= MAX_MEMBERS) throw new Error("Group is full");

  // Insert membership
  const { error: joinError } = await supabase
    .from("group_members")
    .insert({
      group_id: (group as { id: string }).id,
      user_id: user.id,
      role: "member",
    } as never);
  if (joinError) {
    if (joinError.code === "23505") throw new Error("Already a member");
    throw joinError;
  }

  return group;
}

export async function leaveGroup(groupId: string) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  // Check if user is creator
  const { data: membership } = await supabase
    .from("group_members")
    .select("role")
    .eq("group_id", groupId)
    .eq("user_id", user.id)
    .single();

  if ((membership as { role: string } | null)?.role === "creator") {
    // Creator leaving deletes the group
    await deleteGroup(groupId);
    return;
  }

  const { error } = await supabase
    .from("group_members")
    .delete()
    .eq("group_id", groupId)
    .eq("user_id", user.id);
  if (error) throw error;
}

export async function getUserGroups(): Promise<GroupWithMemberCount[]> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  // Get groups user belongs to
  const { data: memberships, error: memError } = await supabase
    .from("group_members")
    .select("group_id")
    .eq("user_id", user.id);
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

  // Get member counts
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

