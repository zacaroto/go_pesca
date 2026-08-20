import { createClient } from "@/lib/supabase/client";

export type NewAchievement = {
  id: string;
  achievement_id: string;
  icon: string;
};

// Achievement definition with its icon
const ACHIEVEMENT_ICONS: Record<string, string> = {
  first_blood: "🩸",
  species_5: "🗺️",
  species_10: "🔬",
  species_20: "🏆",
  big_catch: "💪",
  night_owl: "🦉",
  early_bird: "🌅",
  catch_10: "🎯",
  catch_50: "👑",
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
        .select("id, species_id, weight_kg, time_of_day")
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
        weight_kg: number | null;
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

  // catch_10/50: total catch milestones
  if (!earned.has("catch_10") && totalCatches >= 10) {
    newAchievementIds.push("catch_10");
  }
  if (!earned.has("catch_50") && totalCatches >= 50) {
    newAchievementIds.push("catch_50");
  }

  if (newAchievementIds.length === 0) return [];

  // Insert all new achievements
  const rows = newAchievementIds.map((achievementId) => ({
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
      icon: ACHIEVEMENT_ICONS[a.achievement_id] ?? "🏅",
    })
  );
}
