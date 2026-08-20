import { createClient } from "@/lib/supabase/client";
import { resizeImage } from "./image-utils";
import type { Database } from "./database.types";

type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];
type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];

export type ProfileData = ProfileRow & {
  stats: {
    totalCatches: number;
    speciesCaught: number;
    achievements: number;
  };
};

export async function getProfile(userId: string): Promise<ProfileData | null> {
  const supabase = createClient();

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error || !profile) return null;

  const [{ count: catchCount }, { data: speciesRows }, { count: achievementCount }] =
    await Promise.all([
      supabase
        .from("catches")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId),
      supabase
        .from("catches")
        .select("species_id")
        .eq("user_id", userId),
      supabase
        .from("user_achievements")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId),
    ]);

  const distinctSpecies = new Set(
    (speciesRows ?? []).map((r: { species_id: number }) => r.species_id)
  );

  return {
    ...(profile as ProfileRow),
    stats: {
      totalCatches: catchCount ?? 0,
      speciesCaught: distinctSpecies.size,
      achievements: achievementCount ?? 0,
    },
  };
}

export async function updateProfile(
  data: Omit<ProfileUpdate, "id" | "is_admin" | "created_at">
) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("profiles")
    .update(data as never)
    .eq("id", user.id);

  if (error) throw error;
}

export async function uploadAvatar(file: File): Promise<string> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const resized = await resizeImage(file, 400);
  const fileName = `${user.id}/${Date.now()}.jpg`;

  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(fileName, resized, { contentType: "image/jpeg" });
  if (uploadError) throw uploadError;

  const {
    data: { publicUrl },
  } = supabase.storage.from("avatars").getPublicUrl(fileName);

  // Update profile with new avatar URL
  await supabase
    .from("profiles")
    .update({ avatar_url: publicUrl } as never)
    .eq("id", user.id);

  return publicUrl;
}
