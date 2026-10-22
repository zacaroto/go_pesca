import { createClient } from "@/lib/supabase/server";
import { groupFacts, type FactRow, type FeaturedSpecies } from "./species-facts-data";

/**
 * Species with their published fun facts, for the landing page and login.
 * Returns [] on error so signed-out pages still render (they show a static hero instead).
 */
export async function getFeaturedSpecies(locale: string): Promise<FeaturedSpecies[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("species_facts")
      .select(
        "fact_es, fact_en, sort_order, species:species_id (id, name_es, name_en, scientific_name, reference_photo_url, photo_credit)",
      )
      .eq("is_published", true)
      .order("species_id")
      .order("sort_order");
    if (error) throw error;
    return groupFacts((data ?? []) as unknown as FactRow[], locale).filter((s) => s.photoUrl);
  } catch (err) {
    console.error("Failed to load species facts", err);
    return [];
  }
}
