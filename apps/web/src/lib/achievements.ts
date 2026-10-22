import { createClient } from "@/lib/supabase/client";
import { isTrophy } from "@/lib/profile-records";
import { LEARN_GOALS } from "@/lib/achievement-defs";

export type NewAchievement = {
  id: string;
  achievement_id: string;
};

export async function checkAndAwardAchievements(
  userId: string,
  catchId: string
): Promise<NewAchievement[]> {
  const supabase = createClient();

  // Fetch existing achievements and all catches in parallel
  const [{ data: existingAchievements }, { data: allCatches }] =
    await Promise.all([
      supabase
        .from("user_achievements")
        .select("achievement_id")
        .eq("user_id", userId),
      supabase
        .from("catches")
        .select("id, species_id, weight_kg, length_cm, time_of_day")
        .eq("user_id", userId),
    ]);

  const earned = new Set(
    (existingAchievements ?? []).map(
      (a: { achievement_id: string }) => a.achievement_id
    )
  );
  const catches = allCatches ?? [];
  const totalCatches = catches.length;
  const distinctSpecies = new Set(
    catches.map((c: { species_id: number }) => c.species_id)
  );

  // Find the catch that triggered this check
  const triggeringCatch = catches.find(
    (c: { id: string }) => c.id === catchId
  ) as
    | {
        id: string;
        species_id: number;
        weight_kg: number | null;
        length_cm: number | null;
        time_of_day: string | null;
      }
    | undefined;

  const newAchievementIds: string[] = [];

  // first_blood: 1st catch ever
  if (!earned.has("first_blood") && totalCatches >= 1) {
    newAchievementIds.push("first_blood");
  }

  // species_5/10/20: distinct species milestones
  if (!earned.has("species_5") && distinctSpecies.size >= 5) {
    newAchievementIds.push("species_5");
  }
  if (!earned.has("species_10") && distinctSpecies.size >= 10) {
    newAchievementIds.push("species_10");
  }
  if (!earned.has("species_20") && distinctSpecies.size >= 20) {
    newAchievementIds.push("species_20");
  }

  // big_catch: over 10kg
  if (
    !earned.has("big_catch") &&
    triggeringCatch?.weight_kg &&
    triggeringCatch.weight_kg > 10
  ) {
    newAchievementIds.push("big_catch");
  }

  // night_owl: catch between 20:00-05:00
  if (!earned.has("night_owl") && triggeringCatch?.time_of_day) {
    const hour = parseInt(triggeringCatch.time_of_day.split(":")[0], 10);
    if (hour >= 20 || hour < 5) {
      newAchievementIds.push("night_owl");
    }
  }

  // early_bird: catch between 04:00-07:00
  if (!earned.has("early_bird") && triggeringCatch?.time_of_day) {
    const hour = parseInt(triggeringCatch.time_of_day.split(":")[0], 10);
    if (hour >= 4 && hour < 7) {
      newAchievementIds.push("early_bird");
    }
  }

  // trophy_catch / release_catch: depend on the caught species' trophy threshold and legal rule.
  if (triggeringCatch && (!earned.has("trophy_catch") || !earned.has("release_catch"))) {
    // "*" so this keeps working on databases without the trophy/regulation columns.
    const { data: species } = await supabase.from("species").select("*").eq("id", triggeringCatch.species_id).maybeSingle();
    const s = species as { trophy_weight_kg?: number | null; trophy_length_cm?: number | null; regulation?: string | null } | null;
    if (!earned.has("trophy_catch") && s && isTrophy(triggeringCatch, { trophy_weight_kg: s.trophy_weight_kg ?? null, trophy_length_cm: s.trophy_length_cm ?? null })) {
      newAchievementIds.push("trophy_catch");
    }
    if (!earned.has("release_catch") && s?.regulation === "release") {
      newAchievementIds.push("release_catch");
    }
  }

  // catch_10/50: total catch milestones
  if (!earned.has("catch_10") && totalCatches >= 10) {
    newAchievementIds.push("catch_10");
  }
  if (!earned.has("catch_50") && totalCatches >= 50) {
    newAchievementIds.push("catch_50");
  }

  return insertAchievements(userId, newAchievementIds, catchId);
}

/** Awards the Aprender milestones (guides read, knots learned) once the angler reaches them. */
export async function checkLearnAchievements(userId: string): Promise<NewAchievement[]> {
  const supabase = createClient();
  const [{ data: existing }, { data: progress }] = await Promise.all([
    supabase.from("user_achievements").select("achievement_id").eq("user_id", userId),
    supabase.from("learn_progress").select("item_type").eq("user_id", userId),
  ]);
  const earned = new Set(((existing ?? []) as { achievement_id: string }[]).map((a) => a.achievement_id));
  // learn_progress isn't in the generated Database types yet (migration 023).
  const items = (progress ?? []) as unknown as { item_type: string }[];
  const ids = LEARN_GOALS.filter(
    (g) => !earned.has(g.id) && items.filter((i) => i.item_type === g.itemType).length >= g.threshold,
  ).map((g) => g.id);
  return insertAchievements(userId, ids, null);
}

async function insertAchievements(userId: string, achievementIds: string[], catchId: string | null): Promise<NewAchievement[]> {
  if (achievementIds.length === 0) return [];
  const supabase = createClient();
  const rows = achievementIds.map((achievementId) => ({
    user_id: userId,
    achievement_id: achievementId,
    catch_id: catchId,
  }));

  const { data: inserted, error } = await supabase
    .from("user_achievements")
    .insert(rows as never[])
    .select("id, achievement_id");

  if (error) {
    console.error("Failed to insert achievements:", error);
    return [];
  }

  return (inserted ?? []).map(
    (a: { id: string; achievement_id: string }) => ({
      id: a.id,
      achievement_id: a.achievement_id,
    })
  );
}
