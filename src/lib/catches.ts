import { createClient } from "@/lib/supabase/client";
import { resizeImage } from "./image-utils";
import type { Database } from "./database.types";

type CatchInsert = Database["public"]["Tables"]["catches"]["Insert"];
type CatchUpdate = Database["public"]["Tables"]["catches"]["Update"];

type CatchData = {
  speciesId: number;
  latitude: number;
  longitude: number;
  locationName?: string;
  catchDate: string;
  weightKg?: number;
  lengthCm?: number;
  baitLure?: string;
  weather?: string;
  tide?: string;
  timeOfDay?: string;
  notes?: string;
  isPublic?: boolean;
  shareToGroups?: boolean;
};

export async function submitCatch(photo: File, data: CatchData) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  // Resize and upload photo
  const resized = await resizeImage(photo);
  const fileName = `${user.id}/${Date.now()}.jpg`;
  const { error: uploadError } = await supabase.storage
    .from("catches")
    .upload(fileName, resized, { contentType: "image/jpeg" });
  if (uploadError) throw uploadError;

  const {
    data: { publicUrl },
  } = supabase.storage.from("catches").getPublicUrl(fileName);

  // Insert catch record
  const row: CatchInsert = {
    user_id: user.id,
    species_id: data.speciesId,
    photo_url: publicUrl,
    latitude: data.latitude,
    longitude: data.longitude,
    location_name: data.locationName || null,
    catch_date: data.catchDate,
    weight_kg: data.weightKg || null,
    length_cm: data.lengthCm || null,
    bait_lure: data.baitLure || null,
    weather: data.weather || null,
    tide: data.tide || null,
    time_of_day: data.timeOfDay || null,
    notes: data.notes || null,
    is_public: data.isPublic !== undefined ? data.isPublic : true,
    share_to_groups: data.shareToGroups !== undefined ? data.shareToGroups : true,
  };
  const { data: catchRecord, error: insertError } = await supabase
    .from("catches")
    .insert(row as never)
    .select()
    .single();
  if (insertError) throw insertError;

  return catchRecord;
}

function extractStoragePath(photoUrl: string): string | null {
  const marker = "/object/public/catches/";
  const idx = photoUrl.indexOf(marker);
  if (idx === -1) return null;
  return photoUrl.substring(idx + marker.length);
}

export async function deleteCatch(catchId: string, photoUrl: string) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error: deleteError } = await supabase
    .from("catches")
    .delete()
    .eq("id", catchId)
    .eq("user_id", user.id);
  if (deleteError) throw deleteError;

  const storagePath = extractStoragePath(photoUrl);
  if (storagePath) {
    await supabase.storage.from("catches").remove([storagePath]);
  }
}

export async function updateCatch(
  catchId: string,
  data: Partial<CatchData>,
  oldPhotoUrl: string,
  newPhoto?: File
) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  let photoUrl: string | undefined;

  if (newPhoto) {
    const resized = await resizeImage(newPhoto);
    const fileName = `${user.id}/${Date.now()}.jpg`;
    const { error: uploadError } = await supabase.storage
      .from("catches")
      .upload(fileName, resized, { contentType: "image/jpeg" });
    if (uploadError) throw uploadError;

    const {
      data: { publicUrl },
    } = supabase.storage.from("catches").getPublicUrl(fileName);
    photoUrl = publicUrl;

    // Delete old photo
    const oldPath = extractStoragePath(oldPhotoUrl);
    if (oldPath) {
      await supabase.storage.from("catches").remove([oldPath]);
    }
  }

  const row: CatchUpdate = {};
  if (data.speciesId !== undefined) row.species_id = data.speciesId;
  if (data.latitude !== undefined) row.latitude = data.latitude;
  if (data.longitude !== undefined) row.longitude = data.longitude;
  if (data.locationName !== undefined) row.location_name = data.locationName || null;
  if (data.catchDate !== undefined) row.catch_date = data.catchDate;
  if (data.weightKg !== undefined) row.weight_kg = data.weightKg || null;
  if (data.lengthCm !== undefined) row.length_cm = data.lengthCm || null;
  if (data.baitLure !== undefined) row.bait_lure = data.baitLure || null;
  if (data.weather !== undefined) row.weather = data.weather || null;
  if (data.tide !== undefined) row.tide = data.tide || null;
  if (data.timeOfDay !== undefined) row.time_of_day = data.timeOfDay || null;
  if (data.notes !== undefined) row.notes = data.notes || null;
  if (data.isPublic !== undefined) row.is_public = data.isPublic;
  if (data.shareToGroups !== undefined) row.share_to_groups = data.shareToGroups;
  if (photoUrl) row.photo_url = photoUrl;

  const { data: updated, error: updateError } = await supabase
    .from("catches")
    .update(row as never)
    .eq("id", catchId)
    .eq("user_id", user.id)
    .select()
    .single();
  if (updateError) throw updateError;

  return updated;
}
