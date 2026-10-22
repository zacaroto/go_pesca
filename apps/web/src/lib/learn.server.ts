import { createClient } from "@/lib/supabase/server";
import type { SeasonRegion } from "./learn";

export type Chapter = "technique" | "where_when";

export type Guide = {
  slug: string;
  chapter: Chapter;
  sort_order: number;
  read_minutes: number;
  title_es: string;
  title_en: string;
  summary_es: string;
  summary_en: string;
  body_es: string;
  body_en: string;
  sources: string[];
};

export type KnotStep = { text_es: string; text_en: string };

export type Knot = {
  slug: string;
  sort_order: number;
  name_es: string;
  name_en: string;
  summary_es: string;
  summary_en: string;
  best_for_es: string;
  best_for_en: string;
  difficulty: 1 | 2 | 3;
  steps: KnotStep[];
  image_url: string | null;
  image_credit: string | null;
  image_source_url: string | null;
  sources: string[];
};

export type SeasonEntry = {
  species_id: number;
  region: SeasonRegion;
  months: number[];
  where_es: string | null;
  where_en: string | null;
  note_es: string | null;
  note_en: string | null;
  species: { id: number; name_es: string; name_en: string; habitat: string; reference_photo_url: string | null } | null;
};

/* The Aprender pages render even before migration 023 runs: every loader logs and returns empty. */

export async function getGuides(): Promise<Guide[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from("learn_guides").select("*").order("chapter").order("sort_order");
    if (error) throw error;
    return (data ?? []) as Guide[];
  } catch (err) {
    console.error("learn: failed to load guides", err);
    return [];
  }
}

export async function getGuide(slug: string): Promise<Guide | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from("learn_guides").select("*").eq("slug", slug).maybeSingle();
    if (error) throw error;
    return data as Guide | null;
  } catch (err) {
    console.error("learn: failed to load guide", slug, err);
    return null;
  }
}

export async function getKnots(): Promise<Knot[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from("knots").select("*").order("sort_order");
    if (error) throw error;
    return (data ?? []) as Knot[];
  } catch (err) {
    console.error("learn: failed to load knots", err);
    return [];
  }
}

export async function getSeasons(): Promise<SeasonEntry[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("species_seasons")
      .select("species_id, region, months, where_es, where_en, note_es, note_en, species:species_id (id, name_es, name_en, habitat, reference_photo_url)");
    if (error) throw error;
    return (data ?? []) as unknown as SeasonEntry[];
  } catch (err) {
    console.error("learn: failed to load seasons", err);
    return [];
  }
}

/** The signed-in angler's finished items as "guide:slug" / "knot:slug"; empty when signed out. */
export async function getLearnProgress(): Promise<{ signedIn: boolean; done: Set<string> }> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { signedIn: false, done: new Set() };
    const { data, error } = await supabase.from("learn_progress").select("item_type, slug").eq("user_id", user.id);
    if (error) throw error;
    // learn_progress isn't in the generated Database types yet (migration 023).
    const rows = (data ?? []) as unknown as { item_type: string; slug: string }[];
    return { signedIn: true, done: new Set(rows.map((r) => `${r.item_type}:${r.slug}`)) };
  } catch (err) {
    console.error("learn: failed to load progress", err);
    return { signedIn: false, done: new Set() };
  }
}
