import { createClient } from "@/lib/supabase/server";
import { nextBestWeight } from "./fishydex-index";
import { parseRegulation, type Regulation } from "./regulation";
import { isBetterCatch } from "./profile-records";
import type { Database } from "./database.types";

type SpeciesRow = Database["public"]["Tables"]["species"]["Row"];
type CatchRow = Database["public"]["Tables"]["catches"]["Row"];

export type PokedexEntry = {
  id: number;
  name_es: string;
  name_en: string;
  scientific_name: string;
  habitat: string;
  reference_photo_url: string | null;
  catch_count: number;
  first_catch_date: string | null;
  last_catch_date: string | null;
  first_catch_photo: string | null;
  description_es: string | null;
  description_en: string | null;
  best_weight_kg: number | null;
  regulation?: Regulation | null;
  /** Photo of the heaviest (or, unweighed, longest) catch of this species. */
  best_catch_photo?: string | null;
};

export async function getPokedex(userId: string): Promise<PokedexEntry[]> {
  const supabase = await createClient();

  // Get all species
  const { data: speciesData } = await supabase
    .from("species")
    .select("*")
    .order("name_es");

  const species = (speciesData ?? []) as SpeciesRow[];
  if (species.length === 0) return [];

  // Get user's catches grouped by species
  const { data: catchesData } = await supabase
    .from("catches")
    .select("species_id, catch_date, photo_url, weight_kg, length_cm")
    .eq("user_id", userId)
    .order("catch_date", { ascending: true });

  const catches = (catchesData ?? []) as Pick<CatchRow, "species_id" | "catch_date" | "photo_url" | "weight_kg" | "length_cm">[];

  const catchMap = new Map<
    number,
    { count: number; firstDate: string; lastDate: string; firstPhoto: string; best: number | null; bestCatch: (typeof catches)[number] }
  >();

  {
    for (const c of catches) {
      const existing = catchMap.get(c.species_id);
      if (existing) {
        existing.count++;
        existing.best = nextBestWeight(existing.best, c.weight_kg);
        if (isBetterCatch(c, existing.bestCatch)) existing.bestCatch = c;
        if (c.catch_date > existing.lastDate) {
          existing.lastDate = c.catch_date;
        }
      } else {
        catchMap.set(c.species_id, {
          count: 1,
          firstDate: c.catch_date,
          lastDate: c.catch_date,
          firstPhoto: c.photo_url,
          best: nextBestWeight(null, c.weight_kg),
          bestCatch: c,
        });
      }
    }
  }

  return species.map((s) => {
    const catchData = catchMap.get(s.id);
    return {
      id: s.id,
      name_es: s.name_es,
      name_en: s.name_en,
      scientific_name: s.scientific_name,
      habitat: s.habitat,
      reference_photo_url: s.reference_photo_url,
      catch_count: catchData?.count ?? 0,
      first_catch_date: catchData?.firstDate ?? null,
      last_catch_date: catchData?.lastDate ?? null,
      first_catch_photo: catchData?.firstPhoto ?? null,
      description_es: s.description_es,
      description_en: s.description_en,
      best_weight_kg: catchData?.best ?? null,
      best_catch_photo: catchData?.bestCatch.photo_url ?? null,
      // Not in the generated types yet (added by migration 020).
      regulation: parseRegulation((s as { regulation?: unknown }).regulation),
    };
  });
}

export async function getSpeciesCatches(userId: string, speciesId: number) {
  const supabase = await createClient();

  const { data: speciesRow } = await supabase
    .from("species")
    .select("*")
    .eq("id", speciesId)
    .single();

  const { data: catchRows } = await supabase
    .from("catches")
    .select("*")
    .eq("user_id", userId)
    .eq("species_id", speciesId)
    .order("catch_date", { ascending: false });

  return {
    species: speciesRow as SpeciesRow | null,
    catches: (catchRows ?? []) as CatchRow[],
  };
}
