import { createClient } from "@/lib/supabase/client";
import type { SpeciesBest } from "./catch-insight";

export async function fetchSpeciesBests(): Promise<SpeciesBest[]> {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];
    const { data, error } = await supabase.from("catches").select("species_id, weight_kg").eq("user_id", user.id);
    if (error) throw error;
    const best = new Map<number, number | null>();
    for (const row of (data ?? []) as { species_id: number; weight_kg: number | null }[]) {
      const prev = best.get(row.species_id) ?? null;
      const w = row.weight_kg;
      best.set(row.species_id, w === null ? prev : prev === null ? w : Math.max(prev, w));
    }
    return [...best].map(([speciesId, bestWeightKg]) => ({ speciesId, bestWeightKg }));
  } catch (err) {
    console.error("fetchSpeciesBests failed", err);
    return [];
  }
}
