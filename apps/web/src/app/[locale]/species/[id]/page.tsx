import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { SpeciesPagerBottom, SpeciesPagerTop } from "@/components/species/species-pager";
import { TrophyCard } from "@/components/species/trophy-card";
import { SpeciesPhoto } from "@/components/species/species-photo";
import { RegulationCard, RegulationTag } from "@/components/species/regulation-tag";
import { parseRegulation } from "@/lib/regulation";
import { speciesNeighbors, type SpeciesLink } from "@/lib/species-neighbors";
import {
  ArrowLeftIcon,
  HookIcon,
  PinIcon,
  PlusIcon,
  RulerIcon,
  ScaleIcon,
  WaterIcon,
} from "@/components/icons";

type Species = {
  id: number;
  name_es: string;
  name_en: string;
  scientific_name: string;
  habitat: string;
  description_es: string | null;
  description_en: string | null;
  reference_photo_url: string | null;
  max_weight_kg: number | null;
  max_length_cm: number | null;
  trophy_weight_kg?: number | null;
  trophy_length_cm?: number | null;
  trophy_note_es?: string | null;
  trophy_note_en?: string | null;
  trophy_source_url?: string | null;
  regulation?: string | null;
  regulation_note_es?: string | null;
  regulation_note_en?: string | null;
  regulation_source_url?: string | null;
  fishing_regions_es: string | null;
  fishing_regions_en: string | null;
  best_bait_es: string | null;
  best_bait_en: string | null;
};

type Props = {
  params: Promise<{ locale: string; id: string }>;
};

export default async function SpeciesDetailPage({ params }: Props) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  let species: Species | null = null;
  let all: SpeciesLink[] = [];

  try {
    const supabase = await createClient();
    const nameCol = locale === "en" ? "name_en" : "name_es";
    const [{ data }, { data: list, error: listError }] = await Promise.all([
      supabase.from("species").select("*").eq("id", parseInt(id)).single(),
      supabase.from("species").select(`id, ${nameCol}`),
    ]);
    if (data) species = data as Species;
    if (listError) console.error("species: failed to load catalog for prev/next", listError);
    all = ((list ?? []) as Record<string, unknown>[]).map((r) => ({ id: r.id as number, name: (r[nameCol] as string) ?? "" }));
  } catch {
    // Supabase error handling
  }

  if (!species) {
    notFound();
  }

  const neighbors = speciesNeighbors(all, species.id, locale);
  return <SpeciesDetailContent species={species} locale={locale} neighbors={neighbors} />;
}

function SpeciesDetailContent({
  species,
  locale,
  neighbors,
}: {
  species: Species;
  locale: string;
  neighbors: ReturnType<typeof speciesNeighbors>;
}) {
  const t = useTranslations("species");
  const name = locale === "es" ? species.name_es : species.name_en;
  const description =
    locale === "es" ? species.description_es : species.description_en;
  const fishingRegions =
    locale === "es" ? species.fishing_regions_es : species.fishing_regions_en;
  const bestBait =
    locale === "es" ? species.best_bait_es : species.best_bait_en;

  const habitatLabel =
    species.habitat === "freshwater"
      ? t("freshwater")
      : species.habitat === "saltwater"
        ? t("saltwater")
        : t("brackish");

  const habitatPill =
    species.habitat === "freshwater"
      ? "pill-fresh"
      : species.habitat === "saltwater"
        ? "pill-salt"
        : "pill-brack";

  const regulation = parseRegulation(species.regulation);

  const regions = fishingRegions
    ? fishingRegions.split(",").map((r) => r.trim())
    : [];

  const baits = bestBait
    ? bestBait.split(",").map((b) => b.trim())
    : [];

  const factLabel = "text-[12px] sm:text-[13px] font-medium text-muted leading-tight";
  const factValue = "font-serif-display text-lg sm:text-3xl font-bold text-text leading-tight";
  const card = "bg-surface rounded-[var(--r-card)] p-5";
  const factCard = "bg-surface rounded-[var(--r-card)] p-3 sm:p-5 min-w-0";

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 pb-24">
      <div className="mb-6 flex items-center justify-between gap-3">
      <Link
          href="/species"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted hover:text-text active:text-text active:scale-[0.98] py-2 rounded-[var(--r-control)] transition-[color,transform] duration-[var(--t-press)] ease-[var(--ease-out)] motion-reduce:transition-none motion-reduce:active:scale-100"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          {t("backToCatalog")}
        </Link>
        {neighbors && <SpeciesPagerTop prev={neighbors.prev} next={neighbors.next} />}
      </div>

      <div className={`${card} sm:p-8 mb-6`}>
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <div className="w-full md:w-1/2 aspect-[4/3] rounded-[var(--r-card)] overflow-hidden bg-ground relative flex items-center justify-center">
            <SpeciesPhoto
              src={species.reference_photo_url}
              alt={name}
              className="w-full h-full object-cover"
              fallbackClassName="h-20 w-20"
            />
            <div className="absolute top-3 left-3 flex flex-col items-start gap-1.5">
              <span className={`text-[13px] font-semibold px-3 py-1 rounded-[var(--r-pill)] ${habitatPill}`}>
                {habitatLabel}
              </span>
              <RegulationTag regulation={regulation} />
            </div>
          </div>

          <div className="w-full md:w-1/2 flex flex-col justify-center">
            <p className="text-[13px] font-medium text-muted mb-2">
              {t("plateNumber", { n: species.id.toString().padStart(3, "0") })}
            </p>
            <h1 className="font-serif-display text-4xl sm:text-5xl text-text mb-1">
              {name}
            </h1>
            <p className="sci-name text-base mb-4">{species.scientific_name}</p>
            {description && (
              <p className="text-sm sm:text-base text-text leading-relaxed">
                {description}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-6">
        <div className={factCard}>
          <div className="flex items-center gap-2 text-muted mb-2">
            <ScaleIcon className="hidden h-5 w-5 shrink-0 sm:block" />
            <span className={factLabel}>{t("maxWeight")}</span>
          </div>
          <p className={factValue}>
            {species.max_weight_kg ? `${species.max_weight_kg} kg` : "—"}
          </p>
        </div>

        <div className={factCard}>
          <div className="flex items-center gap-2 text-muted mb-2">
            <RulerIcon className="hidden h-5 w-5 shrink-0 sm:block" />
            <span className={factLabel}>{t("maxLength")}</span>
          </div>
          <p className={factValue}>
            {species.max_length_cm ? `${species.max_length_cm} cm` : "—"}
          </p>
        </div>

        <div className={factCard}>
          <div className="flex items-center gap-2 text-muted mb-2">
            <WaterIcon className="hidden h-5 w-5 shrink-0 sm:block" />
            <span className={factLabel}>{t("habitat")}</span>
          </div>
          <p className={factValue}>{habitatLabel}</p>
        </div>
      </div>

      <RegulationCard
        regulation={regulation}
        note={(locale === "en" ? species.regulation_note_en : species.regulation_note_es) ?? null}
        sourceUrl={species.regulation_source_url ?? null}
      />

      <TrophyCard
        weightKg={species.trophy_weight_kg ?? null}
        lengthCm={species.trophy_length_cm ?? null}
        note={(locale === "en" ? species.trophy_note_en : species.trophy_note_es) ?? null}
        sourceUrl={species.trophy_source_url ?? null}
        locale={locale}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {regions.length > 0 && (
          <div className={card}>
            <h2 className="font-serif-display text-lg font-bold text-text flex items-center gap-2 mb-3">
              <PinIcon className="h-5 w-5 text-muted" />
              {t("fishingRegions")}
            </h2>
            <div className="flex flex-wrap gap-2">
              {regions.map((region) => (
                <span
                  key={region}
                  className="pill-salt px-3 py-1 rounded-[var(--r-pill)] text-[13px] font-medium"
                >
                  {region}
                </span>
              ))}
            </div>
          </div>
        )}

        {baits.length > 0 && (
          <div className={card}>
            <h2 className="font-serif-display text-lg font-bold text-text flex items-center gap-2 mb-3">
              <HookIcon className="h-5 w-5 text-muted" />
              {t("bestBait")}
            </h2>
            <div className="flex flex-wrap gap-2">
              {baits.map((bait) => (
                <span
                  key={bait}
                  className="pill-brack px-3 py-1 rounded-[var(--r-pill)] text-[13px] font-medium"
                >
                  {bait}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="text-center">
        <Link
          href="/catches/new"
          className="inline-flex items-center gap-2 bg-accent text-on-primary text-base font-semibold px-6 py-3 rounded-[var(--r-control)] hover:bg-accent-hi active:bg-accent-hi active:scale-[0.98] transition-[background-color,transform] duration-[var(--t-press)] ease-[var(--ease-out)] motion-reduce:transition-none motion-reduce:active:scale-100"
        >
          <PlusIcon className="h-5 w-5" />
          {t("registerCatchOf", { name })}
        </Link>
      </div>
      {neighbors && (
        <div className="mt-10">
          <SpeciesPagerBottom prev={neighbors.prev} next={neighbors.next} />
        </div>
      )}
    </div>
  );
}
