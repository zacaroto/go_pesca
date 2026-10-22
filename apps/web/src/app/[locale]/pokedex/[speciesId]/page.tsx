import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound, redirect } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import { getSpeciesCatches } from "@/lib/pokedex";
import { isBetterCatch, isTrophy } from "@/lib/profile-records";
import { parseRegulation } from "@/lib/regulation";
import { SpeciesPhoto } from "@/components/species/species-photo";
import { RegulationTag } from "@/components/species/regulation-tag";
import { TrophyPill } from "@/components/profile/personal-records";
import { FishMark } from "@/components/layout/fish-mark";

type Props = {
  params: Promise<{ locale: string; speciesId: string }>;
};

type SpeciesExtras = {
  trophy_weight_kg?: number | null;
  trophy_length_cm?: number | null;
  regulation?: string | null;
};

const HABITAT_PILL: Record<string, string> = { saltwater: "pill-salt", freshwater: "pill-fresh", brackish: "pill-brack" };

/** One species in the angler's own Pescadex: their best catch as the plate, numbers, trophy progress and every catch. */
export default async function PokedexSpeciesPage({ params }: Props) {
  const { locale, speciesId } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("pokedex");
  const tSpecies = await getTranslations("species");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/auth/login`);

  const { species, catches } = await getSpeciesCatches(user.id, parseInt(speciesId));
  if (!species) notFound();

  const extra = species as typeof species & SpeciesExtras;
  const thresholds = { trophy_weight_kg: extra.trophy_weight_kg ?? null, trophy_length_cm: extra.trophy_length_cm ?? null };
  const en = locale === "en";
  const name = en ? species.name_en : species.name_es;
  const num = new Intl.NumberFormat(en ? "en" : "es-CR", { maximumFractionDigits: 1 });
  const date = (d: string, opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "short", year: "numeric" }) =>
    new Date(`${d}T00:00:00Z`).toLocaleDateString(locale, { ...opts, timeZone: "UTC" });

  const best = catches.reduce<(typeof catches)[number] | null>((b, c) => (!b || isBetterCatch(c, b) ? c : b), null);
  const longest = catches.reduce<number | null>((m, c) => (c.length_cm != null && (m == null || c.length_cm > m) ? c.length_cm : m), null);
  const heaviest = catches.reduce<number | null>((m, c) => (c.weight_kg != null && (m == null || c.weight_kg > m) ? c.weight_kg : m), null);
  const trophies = new Set(catches.filter((c) => isTrophy(c, thresholds)).map((c) => c.id));
  const first = catches[catches.length - 1];
  const habitatKey = species.habitat === "freshwater" || species.habitat === "saltwater" ? species.habitat : "brackish";
  const photo = best?.photo_url ?? species.reference_photo_url;

  // Trophy progress: by weight when the species has a weight threshold, else by length.
  const byWeight = thresholds.trophy_weight_kg != null;
  const target = byWeight ? thresholds.trophy_weight_kg : thresholds.trophy_length_cm;
  const mine = byWeight ? heaviest : longest;
  const unit = byWeight ? "kg" : "cm";
  const share = target && mine != null ? Math.min(mine / target, 1) : 0;

  const stat = "rounded-[var(--r-card)] bg-surface p-4 min-w-0";
  const statValue = "block truncate font-serif-display text-heading font-bold leading-none text-text";
  const statLabel = "mt-1.5 block text-label text-muted";

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 pb-24 sm:px-8">
      <Link
        href="/pokedex"
        className="mb-4 inline-flex items-center gap-2 py-2 text-small font-medium text-muted hover:text-text active:scale-[0.98] transition-[color,transform] duration-[var(--t-press)] motion-reduce:transition-none motion-reduce:active:scale-100"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        {t("title")}
      </Link>

      <section className="mb-5 grid gap-6 rounded-[var(--r-card)] bg-surface p-5 sm:p-8 md:grid-cols-2 md:items-center">
        <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-[3px] bg-ground">
          <SpeciesPhoto src={photo} alt={name} className="h-full w-full object-cover" fallbackClassName="h-20 w-20" />
          <div className="absolute top-3 left-3 flex flex-col items-start gap-1.5">
            <span className={`rounded-[var(--r-pill)] px-3 py-1 text-label font-semibold ${HABITAT_PILL[habitatKey]}`}>{tSpecies(habitatKey)}</span>
            <RegulationTag regulation={parseRegulation(extra.regulation)} />
          </div>
          {best?.photo_url && (
            <span className="absolute bottom-3 left-3 rounded-[var(--r-pill)] bg-surface px-3 py-1 text-label font-semibold text-text">{t("yourBestCatch")}</span>
          )}
        </div>
        <div className="min-w-0">
          <p className="m-0 mb-2 text-label font-medium text-muted">{tSpecies("plateNumber", { n: species.id.toString().padStart(3, "0") })}</p>
          <h1 className="m-0 font-serif-display text-[length:clamp(var(--text-heading),5vw,var(--text-title))] leading-none text-text">{name}</h1>
          <p className="sci-name m-0 mt-1.5 text-body">{species.scientific_name}</p>
          {trophies.size > 0 && <TrophyPill className="mt-3" />}
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/catches/new"
              className="inline-flex items-center gap-2 rounded-[var(--r-control)] bg-accent px-4 py-2.5 text-small font-semibold text-on-primary hover:bg-accent-hi active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 transition-[background-color,transform] duration-[var(--t-press)] motion-reduce:transition-none motion-reduce:active:scale-100"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" aria-hidden="true">
                <path d="M12 5v14M5 12h14" />
              </svg>
              {t("logAnother")}
            </Link>
            <Link
              href={`/species/${species.id}`}
              className="inline-flex items-center rounded-[var(--r-control)] bg-raised px-4 py-2.5 text-small font-semibold text-text hover:bg-border active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 transition-[background-color,transform] duration-[var(--t-press)] motion-reduce:transition-none motion-reduce:active:scale-100"
            >
              {t("speciesPage")}
            </Link>
          </div>
        </div>
      </section>

      <section className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-4" aria-label={t("statsLabel")}>
        <div className={stat}>
          <span className={statValue}>{catches.length}</span>
          <span className={statLabel}>{t("totalCatches")}</span>
        </div>
        <div className={stat}>
          <span className={statValue}>{heaviest != null ? `${num.format(heaviest)} kg` : "—"}</span>
          <span className={statLabel}>{t("bestWeight")}</span>
        </div>
        <div className={stat}>
          <span className={statValue}>{longest != null ? `${num.format(longest)} cm` : "—"}</span>
          <span className={statLabel}>{t("longest")}</span>
        </div>
        <div className={stat}>
          <span className={statValue}>{first ? date(first.catch_date, { month: "short", year: "numeric" }) : "—"}</span>
          <span className={statLabel}>{t("firstCatch")}</span>
        </div>
      </section>

      {target != null && catches.length > 0 && (
        <section className="mb-8 rounded-[var(--r-card)] bg-[var(--trophy-soft)] p-5 text-[var(--pill-trophy-ink)] sm:p-6" aria-labelledby="trophy-road">
          <h2 id="trophy-road" className="m-0 font-serif-display text-subhead font-bold">
            {trophies.size > 0 ? t("trophyDone") : t("trophyRoad")}
          </h2>
          <p className="m-0 mt-1 text-small text-text">
            {t("trophyProgress", {
              best: mine != null ? `${num.format(mine)} ${unit}` : "—",
              target: `${num.format(target)} ${unit}`,
            })}
            {trophies.size === 0 && mine != null && ` · ${t("trophyLeft", { value: `${num.format(target - mine)} ${unit}` })}`}
          </p>
          <span className="mt-3 block h-2 overflow-hidden rounded-full bg-surface" aria-hidden="true">
            <span className="block h-full rounded-full bg-[var(--pill-trophy-ink)]" style={{ width: `${Math.round(share * 100)}%` }} />
          </span>
        </section>
      )}

      <h2 className="m-0 mb-4 font-serif-display text-heading leading-tight">{t("yourCatches")}</h2>
      {catches.length === 0 ? (
        <div className="rounded-[var(--r-card)] bg-surface py-14 text-center">
          <FishMark className="mx-auto mb-3 h-12 w-12 text-silhouette" />
          <p className="m-0 text-muted">{t("noCatches")}</p>
        </div>
      ) : (
        <ul className="m-0 grid list-none grid-cols-2 gap-2 p-0 sm:grid-cols-3 sm:gap-3">
          {catches.map((c) => (
            <li key={c.id} className="min-w-0">
              <Link
                href={`/catches/${c.id}`}
                className="group relative block aspect-[4/5] overflow-hidden rounded-[var(--r-card)] bg-raised active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-2 transition-transform duration-[var(--t-ui)] ease-[var(--ease-out)] motion-reduce:transition-none motion-reduce:active:scale-100"
              >
                <SpeciesPhoto
                  src={c.photo_url}
                  alt={`${name} · ${date(c.catch_date)}`}
                  className="h-full w-full object-cover transition-transform duration-500 ease-[var(--ease-out)] group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                  fallbackClassName="mx-auto mt-[40%] h-12 w-12"
                />
                {trophies.has(c.id) && <TrophyPill className="absolute top-2.5 left-2.5" />}
                {best?.id === c.id && !trophies.has(c.id) && (
                  <span className="absolute top-2.5 left-2.5 rounded-[var(--r-pill)] bg-surface px-2.5 py-0.5 text-label font-semibold text-text">{t("yourBest")}</span>
                )}
                <div className="absolute inset-x-0 bottom-0 bg-[rgb(10_14_28/0.62)] px-3 py-2.5 text-white">
                  <p className="m-0 truncate text-small font-semibold tabular-nums">
                    {[c.weight_kg != null ? `${num.format(c.weight_kg)} kg` : null, c.length_cm != null ? `${num.format(c.length_cm)} cm` : null].filter(Boolean).join(" · ") || "—"}
                  </p>
                  <p className="m-0 truncate text-label opacity-85">{[c.location_name, date(c.catch_date)].filter(Boolean).join(" · ")}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
