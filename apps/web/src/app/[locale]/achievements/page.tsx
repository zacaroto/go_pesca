import { getTranslations, setRequestLocale } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AchievementCard } from "@/components/achievements/achievement-card";

const ACHIEVEMENT_DEFS = [
  { id: "first_blood", icon: "🩸", type: "catch_count", threshold: 1 },
  { id: "species_5", icon: "🗺️", type: "species_count", threshold: 5 },
  { id: "species_10", icon: "🔬", type: "species_count", threshold: 10 },
  { id: "species_20", icon: "🏆", type: "species_count", threshold: 20 },
  { id: "big_catch", icon: "💪", type: "special", threshold: 0 },
  { id: "night_owl", icon: "🦉", type: "special", threshold: 0 },
  { id: "early_bird", icon: "🌅", type: "special", threshold: 0 },
  { id: "catch_10", icon: "🎯", type: "catch_count", threshold: 10 },
  { id: "catch_50", icon: "👑", type: "catch_count", threshold: 50 },
];

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function AchievementsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("achievements");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${locale}/auth/login`);
  }

  const [{ data: userAchievements }, { data: allCatches }] = await Promise.all([
    supabase
      .from("user_achievements")
      .select("achievement_id, awarded_at")
      .eq("user_id", user.id),
    supabase
      .from("catches")
      .select("species_id")
      .eq("user_id", user.id),
  ]);

  const earnedMap = new Map(
    (userAchievements ?? []).map(
      (a: { achievement_id: string; awarded_at: string }) => [
        a.achievement_id,
        a.awarded_at,
      ]
    )
  );

  const catches = allCatches ?? [];
  const totalCatches = catches.length;
  const distinctSpecies = new Set(
    catches.map((c: { species_id: number }) => c.species_id)
  ).size;

  const earnedCount = earnedMap.size;

  function getProgress(def: (typeof ACHIEVEMENT_DEFS)[number]): string | undefined {
    if (earnedMap.has(def.id)) return undefined;
    if (def.type === "catch_count") {
      return `${totalCatches}/${def.threshold}`;
    }
    if (def.type === "species_count") {
      return `${distinctSpecies}/${def.threshold}`;
    }
    return undefined;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-extrabold text-gradient-ocean" style={{ fontFamily: "var(--font-fredoka)" }}>
          {t("title")}
        </h1>
        <span className="text-sm font-extrabold text-primary bg-primary/10 px-4 py-1.5 rounded-xl">
          {earnedCount}/{ACHIEVEMENT_DEFS.length}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {ACHIEVEMENT_DEFS.map((def) => (
          <AchievementCard
            key={def.id}
            achievementId={def.id}
            icon={def.icon}
            earned={earnedMap.has(def.id)}
            awardedAt={earnedMap.get(def.id)}
            progress={getProgress(def)}
          />
        ))}
      </div>
    </div>
  );
}
