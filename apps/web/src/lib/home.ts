import { createClient } from "@/lib/supabase/server";
import { pickLatestNewSpecies, type HomeCatch } from "./home-data";

export async function getHomeData(userId: string, locale: string) {
  const supabase = await createClient();
  const nameCol = locale === "en" ? "name_en" : "name_es";
  const descCol = locale === "en" ? "description_en" : "description_es";

  const [{ data: rows }, { count: total }] = await Promise.all([
    supabase
      .from("catches")
      .select(`id, species_id, photo_url, catch_date, location_name, weight_kg, length_cm, bait_lure,
               species:species_id (${nameCol}, scientific_name, habitat, ${descCol}, reference_photo_url)`)
      .eq("user_id", userId)
      .order("catch_date", { ascending: false }),
    supabase.from("species").select("*", { count: "exact", head: true }),
  ]);

  const catches: HomeCatch[] = ((rows ?? []) as unknown as Record<string, unknown>[]).map((row) => {
    const s = (row.species ?? {}) as Record<string, string | null>;
    return {
      id: row.id as string,
      species_id: row.species_id as number,
      species_name: s[nameCol] ?? "",
      scientific_name: s.scientific_name ?? "",
      habitat: s.habitat ?? null,
      description: s[descCol] ?? null,
      reference_photo_url: s.reference_photo_url ?? null,
      photo_url: row.photo_url as string,
      catch_date: row.catch_date as string,
      location_name: (row.location_name as string | null) ?? null,
      weight_kg: (row.weight_kg as number | null) ?? null,
      length_cm: (row.length_cm as number | null) ?? null,
      bait_lure: (row.bait_lure as string | null) ?? null,
    };
  });

  return {
    catches,
    latestNew: pickLatestNewSpecies(catches),
    caught: new Set(catches.map((c) => c.species_id)).size,
    total: total ?? 0,
  };
}
