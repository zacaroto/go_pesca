import { createClient } from "@/lib/supabase/client";
import type { SpeciesBest } from "./catch-insight";
import { nextBestWeight } from "./fishydex-index";

/**
 * Best weight per species for the signed-in user.
 * Returns null when there is no user or the query failed, so callers never mistake
 * "unknown" for "no catches yet". An empty array means a signed-in user with no catches.
 */
export async function fetchSpeciesBests(): Promise<SpeciesBest[] | null> {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    const { data, error } = await supabase.from("catches").select("species_id, weight_kg").eq("user_id", user.id);
    if (error) throw error;
    const best = new Map<number, number | null>();
    for (const row of (data ?? []) as { species_id: number; weight_kg: number | null }[]) {
      best.set(row.species_id, nextBestWeight(best.get(row.species_id) ?? null, row.weight_kg));
    }
    return [...best].map(([speciesId, bestWeightKg]) => ({ speciesId, bestWeightKg }));
  } catch (err) {
    console.error("fetchSpeciesBests failed", err);
    return null;
  }
}
