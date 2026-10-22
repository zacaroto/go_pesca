import { getTranslations, setRequestLocale } from "next-intl/server";
import { redirect } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import { FishMark } from "@/components/layout/fish-mark";
import { CatchGallery, type GalleryEntry } from "@/components/catches/catch-gallery";
import { isTrophy } from "@/lib/profile-records";

type Props = {
  params: Promise<{ locale: string }>;
};

type SpeciesRow = { id: number; name_es: string; name_en: string; trophy_weight_kg?: number | null; trophy_length_cm?: number | null };
type CatchRow = {
  id: string;
  species_id: number;
  photo_url: string | null;
  catch_date: string;
  weight_kg: number | null;
  length_cm: number | null;
  location_name: string | null;
};

const newCatchClass =
  "inline-flex items-center gap-2 rounded-[var(--r-control)] bg-accent px-4 py-2.5 text-small font-semibold text-on-primary hover:bg-accent-hi active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 transition-[background-color,transform] duration-[var(--t-press)] motion-reduce:transition-none motion-reduce:active:scale-100";

export default async function CatchesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("catches");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/auth/login`);

  const [{ data: catchData, error: catchError }, { data: speciesData }] = await Promise.all([
    supabase
      .from("catches")
      .select("id, species_id, photo_url, catch_date, weight_kg, length_cm, location_name")
      .eq("user_id", user.id)
      .order("catch_date", { ascending: false }),
    // "*" so this keeps working on databases without the trophy columns yet.
    supabase.from("species").select("*"),
  ]);
  if (catchError) console.error("catches: failed to load", catchError);

  const species = new Map(((speciesData ?? []) as SpeciesRow[]).map((s) => [s.id, s]));
  const catches: GalleryEntry[] = ((catchData ?? []) as CatchRow[]).map((c) => {
    const s = species.get(c.species_id);
    return {
      ...c,
      species_name: (locale === "en" ? s?.name_en : s?.name_es) ?? "—",
      trophy: isTrophy(c, s ? { trophy_weight_kg: s.trophy_weight_kg ?? null, trophy_length_cm: s.trophy_length_cm ?? null } : undefined),
    };
  });
  const speciesCaught = new Set(catches.map((c) => c.species_id)).size;

  const plus = (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" aria-hidden="true">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 pb-24 sm:px-8">
      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <h1 className="m-0 font-serif-display text-[length:clamp(var(--text-heading),6vw,var(--text-title))] leading-none text-text">
            {t("title")}
          </h1>
          {catches.length > 0 && (
            <p className="m-0 mt-2 text-small text-muted">{t("summary", { catches: catches.length, species: speciesCaught })}</p>
          )}
        </div>
        <Link href="/catches/new" className={newCatchClass}>
          {plus}
          {t("newCatch")}
        </Link>
      </header>

      {catches.length === 0 ? (
        <section className="flex flex-col items-center gap-3 rounded-[var(--r-card)] bg-surface px-6 py-16 text-center">
          <FishMark className="h-14 w-14 text-silhouette" />
          <h2 className="m-0 font-serif-display text-subhead font-bold">{t("emptyTitle")}</h2>
          <p className="m-0 max-w-[44ch] text-body text-muted">{t("noCatches")}</p>
          <Link href="/catches/new" className={`${newCatchClass} mt-2`}>
            {plus}
            {t("newCatch")}
          </Link>
        </section>
      ) : (
        <CatchGallery catches={catches} locale={locale} />
      )}
    </div>
  );
}
