import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";

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

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("species")
      .select("*")
      .eq("id", parseInt(id))
      .single();
    if (data) species = data as Species;
  } catch {
    // Supabase error handling
  }

  if (!species) {
    notFound();
  }

  return <SpeciesDetailContent species={species} locale={locale} />;
}

function SpeciesDetailContent({
  species,
  locale,
}: {
  species: Species;
  locale: string;
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

  const habitatBadgeStyle =
    species.habitat === "freshwater"
      ? "bg-secondary text-white"
      : species.habitat === "saltwater"
        ? "bg-primary text-white"
        : "bg-tertiary-container text-white";

  const regions = fishingRegions
    ? fishingRegions.split(",").map((r) => r.trim())
    : [];

  const baits = bestBait
    ? bestBait.split(",").map((b) => b.trim())
    : [];

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 pb-24">
      {/* Back Button */}
      <Link
        href="/species"
        className="inline-flex items-center gap-2 font-bold text-sm text-outline hover:text-primary transition-colors mb-6 bg-surface px-4 py-2 rounded-2xl chunky-border bouncy-shadow bouncy-hover"
      >
        <span className="material-symbols-outlined text-lg">arrow_back</span>
        Volver al Catálogo
      </Link>

      {/* Main TCG Foil Card */}
      <div className="card-foil bg-card-bg rounded-3xl chunky-border chunky-shadow p-5 sm:p-8 mb-8 relative">
        <div className="flex flex-col md:flex-row gap-6 items-center">
          {/* Fish Image Frame */}
          <div className="w-full md:w-1/2 aspect-[4/3] rounded-3xl overflow-hidden bg-surface-container border-[3px] border-white shadow-md relative flex items-center justify-center">
            {species.reference_photo_url ? (
              <img
                src={species.reference_photo_url}
                alt={name}
                className="w-full h-full object-cover sticker-glow"
              />
            ) : (
              <span className="text-6xl">🐟</span>
            )}
            <span
              className={`absolute top-3 left-3 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm border border-white/60 ${habitatBadgeStyle}`}
            >
              {habitatLabel}
            </span>
          </div>

          {/* Header Info */}
          <div className="w-full md:w-1/2 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-sunny-yellow text-on-surface px-3 py-0.5 rounded-full text-xs font-extrabold border border-on-surface">
                Ficha #{species.id.toString().padStart(3, "0")}
              </span>
            </div>
            <h1
              className="font-display-lg text-3xl sm:text-4xl font-bold text-on-surface mb-1 tracking-tight"
              style={{ fontFamily: "var(--font-fredoka)" }}
            >
              {name}
            </h1>
            <p className="font-label-sm text-sm text-outline italic mb-4 font-semibold">
              {species.scientific_name}
            </p>
            {description && (
              <p className="font-body-md text-sm sm:text-base text-on-surface/85 leading-relaxed bg-surface-container-low p-4 rounded-2xl chunky-border">
                {description}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Bento Grid Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {/* Max Weight */}
        <div className="bg-surface rounded-3xl chunky-border p-5 bouncy-shadow flex flex-col justify-between">
          <div className="flex items-center gap-2 text-outline mb-2">
            <span className="material-symbols-outlined text-primary text-2xl">scale</span>
            <span className="font-bold text-xs uppercase tracking-wider font-heading">Peso Máximo</span>
          </div>
          <p className="font-display-lg text-2xl sm:text-3xl font-bold text-primary" style={{ fontFamily: "var(--font-fredoka)" }}>
            {species.max_weight_kg ? `${species.max_weight_kg} kg` : "N/D"}
          </p>
        </div>

        {/* Max Length */}
        <div className="bg-surface rounded-3xl chunky-border p-5 bouncy-shadow flex flex-col justify-between">
          <div className="flex items-center gap-2 text-outline mb-2">
            <span className="material-symbols-outlined text-secondary text-2xl">straighten</span>
            <span className="font-bold text-xs uppercase tracking-wider font-heading">Longitud Máx</span>
          </div>
          <p className="font-display-lg text-2xl sm:text-3xl font-bold text-secondary" style={{ fontFamily: "var(--font-fredoka)" }}>
            {species.max_length_cm ? `${species.max_length_cm} cm` : "N/D"}
          </p>
        </div>

        {/* Habitat */}
        <div className="bg-surface rounded-3xl chunky-border p-5 bouncy-shadow flex flex-col justify-between sm:col-span-2 md:col-span-1">
          <div className="flex items-center gap-2 text-outline mb-2">
            <span className="material-symbols-outlined text-tertiary-container text-2xl">water</span>
            <span className="font-bold text-xs uppercase tracking-wider font-heading">Hábitat</span>
          </div>
          <p className="font-display-lg text-xl sm:text-2xl font-bold text-on-surface" style={{ fontFamily: "var(--font-fredoka)" }}>
            {habitatLabel}
          </p>
        </div>
      </div>

      {/* Fishing Regions & Bait Bento */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {regions.length > 0 && (
          <div className="bg-surface rounded-3xl chunky-border p-5 bouncy-shadow">
            <h3 className="font-headline-md text-base font-bold text-on-surface flex items-center gap-2 mb-3 font-heading">
              <span className="material-symbols-outlined text-primary">location_on</span>
              {t("fishingRegions")}
            </h3>
            <div className="flex flex-wrap gap-2">
              {regions.map((region) => (
                <span
                  key={region}
                  className="bg-primary-fixed text-on-primary-fixed-variant px-3 py-1 rounded-full text-xs font-bold border border-primary-fixed-dim"
                >
                  {region}
                </span>
              ))}
            </div>
          </div>
        )}

        {baits.length > 0 && (
          <div className="bg-surface rounded-3xl chunky-border p-5 bouncy-shadow">
            <h3 className="font-headline-md text-base font-bold text-on-surface flex items-center gap-2 mb-3 font-heading">
              <span className="material-symbols-outlined text-tertiary-container">phishing</span>
              {t("bestBait")}
            </h3>
            <div className="flex flex-wrap gap-2">
              {baits.map((bait) => (
                <span
                  key={bait}
                  className="bg-tertiary-fixed text-on-tertiary-fixed-variant px-3 py-1 rounded-full text-xs font-bold border border-tertiary-fixed-dim"
                >
                  {bait}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Action CTA */}
      <div className="text-center">
        <Link
          href={`/catches/new`}
          className="inline-flex items-center gap-2.5 bg-gradient-sunset text-white font-headline-md text-lg px-8 py-4 rounded-full chunky-border bouncy-shadow bouncy-hover bouncy-active transition-all font-bold"
          style={{ fontFamily: "var(--font-fredoka)" }}
        >
          <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
            add_circle
          </span>
          + Registrar Captura de {name}
        </Link>
      </div>
    </div>
  );
}
