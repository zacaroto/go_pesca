import { createClient } from "@/lib/supabase/client";
import { resizeImage } from "./image-utils";
import type { Database } from "./database.types";

type SuggestionInsert = Database["public"]["Tables"]["species_suggestions"]["Insert"];

type SuggestionData = {
  commonName: string;
  latitude?: number;
  longitude?: number;
  notes?: string;
};

export async function submitSuggestion(photo: File | null, data: SuggestionData) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  let photoUrl: string | null = null;

  if (photo) {
    const resized = await resizeImage(photo);
    const fileName = `suggestions/${user.id}/${Date.now()}.jpg`;
    const { error: uploadError } = await supabase.storage
      .from("catches")
      .upload(fileName, resized, { contentType: "image/jpeg" });
    if (uploadError) throw uploadError;

    const {
      data: { publicUrl },
    } = supabase.storage.from("catches").getPublicUrl(fileName);
    photoUrl = publicUrl;
  }

  const row: SuggestionInsert = {
    user_id: user.id,
    common_name: data.commonName,
    photo_url: photoUrl,
    latitude: data.latitude ?? null,
    longitude: data.longitude ?? null,
    notes: data.notes || null,
  };

  const { error } = await supabase
    .from("species_suggestions")
    .insert(row as never);
  if (error) throw error;
}
