import { createClient } from "@/lib/supabase/client";
import { resizeImage } from "./image-utils";
import type { Database } from "./database.types";

type CatchInsert = Database["public"]["Tables"]["catches"]["Insert"];

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
  };
  const { data: catchRecord, error: insertError } = await supabase
    .from("catches")
    .insert(row as never)
    .select()
    .single();
  if (insertError) throw insertError;

  return catchRecord;
}
