import { getTranslations, setRequestLocale } from "next-intl/server";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AchievementIcon } from "@/components/achievements/achievement-icon";
import { Stamp } from "@/components/achievements/stamp";
import { ACHIEVEMENT_DEFS, achievementProgress, nextAchievement, stampTilt } from "@/lib/achievement-defs";

type Props = {
  params: Promise<{ locale: string }>;
};

/** "Libreta de sellos": every achievement is a stamp, inked once earned, with the next one called out. */
export default async function AchievementsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("achievements");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/auth/login`);

  const [{ data: userAchievements }, { data: allCatches }, { data: learnRows }] = await Promise.all([
    supabase.from("user_achievements").select("achievement_id, awarded_at").eq("user_id", user.id),
    supabase.from("catches").select("species_id").eq("user_id", user.id),
    supabase.from("learn_progress").select("item_type").eq("user_id", user.id),
  ]);

  const awarded = new Map(
    ((userAchievements ?? []) as { achievement_id: string; awarded_at: string }[]).map((a) => [a.achievement_id, a.awarded_at]),
  );
  const catches = (allCatches ?? []) as { species_id: number }[];
  // learn_progress isn't in the generated Database types yet (migration 023); null before it runs.
  const learned = (learnRows ?? []) as unknown as { item_type: string }[];
  const stats = {
    catches: catches.length,
    species: new Set(catches.map((c) => c.species_id)).size,
    guides: learned.filter((r) => r.item_type === "guide").length,
    knots: learned.filter((r) => r.item_type === "knot").length,
  };
  const next = nextAchievement(ACHIEVEMENT_DEFS, new Set(awarded.keys()), stats);
  const nextProgress = next ? achievementProgress(next, stats) : null;
  const now = new Date().getTime();
  const isFresh = (awardedAt: string | undefined) => Boolean(awardedAt) && now - Date.parse(awardedAt!) < 86_400_000;
  const item = (id: string, field: "name" | "description") => t(`items.${id}.${field}` as Parameters<typeof t>[0]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 pb-24 sm:px-8">
      <header className="mb-8">
        <h1 className="m-0 font-serif-display text-[length:clamp(var(--text-heading),6vw,var(--text-title))] leading-none text-text">{t("title")}</h1>
        <p className="m-0 mt-3 text-body text-muted">{t("summary", { earned: awarded.size, total: ACHIEVEMENT_DEFS.length })}</p>
      </header>

      {next && nextProgress && (
        <section aria-labelledby="next-stamp" className="mb-8 grid grid-cols-[auto_minmax(0,1fr)] items-center gap-4 rounded-[var(--r-card)] bg-surface p-5 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:gap-5">
          <span className="grid h-16 w-16 place-items-center rounded-full border-[3px] border-dashed border-silhouette text-faint">
            <AchievementIcon id={next.id} className="h-7 w-7" />
          </span>
          <div className="min-w-0">
            <p id="next-stamp" className="m-0 text-label text-muted">{t("nextLabel")}</p>
            <h2 className="m-0 font-serif-display text-subhead font-bold leading-tight">{item(next.id, "name")}</h2>
            <p className="m-0 mt-0.5 text-small text-muted">{item(next.id, "description")}</p>
            <span className="mt-2.5 block h-2 overflow-hidden rounded-full bg-raised" aria-hidden="true">
              <span className="block h-full rounded-full bg-progress" style={{ width: `${(nextProgress.current / nextProgress.total) * 100}%` }} />
            </span>
          </div>
          <span className="col-span-2 font-serif-display text-heading font-bold tabular-nums sm:col-span-1">
            {nextProgress.current}/{nextProgress.total}
          </span>
        </section>
      )}

      {/* Ruled-paper page: the stamp book itself. */}
      <ul className="m-0 grid list-none grid-cols-2 gap-x-3 gap-y-5 rounded-[var(--r-card)] bg-surface bg-[repeating-linear-gradient(0deg,transparent_0_31px,var(--rule)_31px_32px)] p-4 sm:grid-cols-3 sm:p-8 lg:grid-cols-4">
        {ACHIEVEMENT_DEFS.map((def) => (
          <Stamp
            key={def.id}
            id={def.id}
            name={item(def.id, "name")}
            description={item(def.id, "description")}
            awardedAt={awarded.get(def.id)}
            progress={achievementProgress(def, stats)}
            tilt={stampTilt(def.id)}
            fresh={isFresh(awarded.get(def.id))}
            locale={locale}
            labels={{
              sealedOn: (date) => t("sealedOn", { date }),
              progress: (current, total) => t("progress", { current, total }),
            }}
          />
        ))}
      </ul>
    </div>
  );
}
