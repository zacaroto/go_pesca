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
    // Supabase not configured
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

  const habitatColor =
    species.habitat === "freshwater"
      ? "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300"
      : species.habitat === "saltwater"
        ? "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300"
        : "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300";

  const regions = fishingRegions
    ? fishingRegions.split(",").map((r) => r.trim())
    : [];

  const baits = bestBait
    ? bestBait.split(",").map((b) => b.trim())
    : [];

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Back link */}
      <Link
        href="/species"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-cyan-600 transition-colors mb-4"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="w-4 h-4"
        >
          <path
            fillRule="evenodd"
            d="M17 10a.75.75 0 0 1-.75.75H5.612l4.158 3.96a.75.75 0 1 1-1.04 1.08l-5.5-5.25a.75.75 0 0 1 0-1.08l5.5-5.25a.75.75 0 1 1 1.04 1.08L5.612 9.25H16.25A.75.75 0 0 1 17 10Z"
            clipRule="evenodd"
          />
        </svg>
        {t("title")}
      </Link>

      {/* Hero */}
      <div className="rounded-2xl overflow-hidden bg-white dark:bg-gray-800 ring-1 ring-gray-100 dark:ring-gray-700/50 shadow-sm mb-6">
        <div className="relative h-56 sm:h-72 bg-gradient-to-br from-cyan-50 via-blue-50 to-teal-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center overflow-hidden">
          {species.reference_photo_url ? (
            <img
              src={species.reference_photo_url}
              alt={name}
              className="w-full h-full object-cover"
            />
          ) : (
            <svg
              className="w-20 h-20 text-cyan-200 dark:text-cyan-800"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-1 14.5c-2 0-4-1.5-4-4s2-5 4-5c1 0 2 .5 2.5 1l2-1.5c.5-.3 1 0 .8.5l-1 3h2c.5 0 .7.5.4.8l-4 4c-.3.3-.7.1-.7-.3v-2h-1c-.5 0-1-.3-1-.5z" />
            </svg>
          )}
          <span
            className={`absolute top-3 right-3 text-xs font-semibold px-3 py-1 rounded-full ${habitatColor}`}
          >
            {habitatLabel}
          </span>
        </div>

        <div className="p-5">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
            {name}
          </h1>
          <p className="text-sm text-gray-400 dark:text-gray-500 italic mt-1">
            {species.scientific_name}
          </p>
          {description && (
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-3 leading-relaxed">
              {description}
            </p>
          )}
        </div>
      </div>

      {/* Info cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Max Size Card */}
        {(species.max_weight_kg || species.max_length_cm) && (
          <div className="rounded-2xl bg-white dark:bg-gray-800 ring-1 ring-gray-100 dark:ring-gray-700/50 p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-cyan-50 dark:bg-cyan-900/30">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-4.5 h-4.5 text-cyan-600 dark:text-cyan-400"
                >
                  <path
                    fillRule="evenodd"
                    d="M2.25 13.5a8.25 8.25 0 0 1 8.25-8.25.75.75 0 0 1 .75.75v6.75H18a.75.75 0 0 1 .75.75 8.25 8.25 0 0 1-16.5 0Z"
                    clipRule="evenodd"
                  />
                  <path
                    fillRule="evenodd"
                    d="M12.75 3a.75.75 0 0 1 .75-.75 8.25 8.25 0 0 1 8.25 8.25.75.75 0 0 1-.75.75H12.75V3Z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
              <h2 className="font-semibold text-gray-900 dark:text-gray-100">
                {t("maxSize")}
              </h2>
            </div>
            <div className="space-y-2">
              {species.max_weight_kg && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {t("weight")}
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {species.max_weight_kg} kg
                  </span>
                </div>
              )}
              {species.max_length_cm && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {t("length")}
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {species.max_length_cm} cm
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Habitat Card */}
        <div className="rounded-2xl bg-white dark:bg-gray-800 ring-1 ring-gray-100 dark:ring-gray-700/50 p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-900/30">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-4.5 h-4.5 text-teal-600 dark:text-teal-400"
              >
                <path
                  fillRule="evenodd"
                  d="m11.54 22.351.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a16.975 16.975 0 0 0 1.144-.742 19.58 19.58 0 0 0 2.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 0 0-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 0 0 2.682 2.282 16.975 16.975 0 0 0 1.145.742ZM12 13.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
            <h2 className="font-semibold text-gray-900 dark:text-gray-100">
              {t("habitat")}
            </h2>
          </div>
          <span
            className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${habitatColor}`}
          >
            {habitatLabel}
          </span>
        </div>

        {/* Fishing Regions Card */}
        {regions.length > 0 && (
          <div className="rounded-2xl bg-white dark:bg-gray-800 ring-1 ring-gray-100 dark:ring-gray-700/50 p-5 sm:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/30">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-4.5 h-4.5 text-blue-600 dark:text-blue-400"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.161 2.58a1.875 1.875 0 0 1 1.678 0l4.993 2.498c.106.052.23.052.336 0l3.869-1.935A1.875 1.875 0 0 1 21.75 4.82v12.485c0 .71-.401 1.36-1.037 1.677l-4.875 2.437a1.875 1.875 0 0 1-1.676 0L9.17 18.92a.188.188 0 0 0-.336 0l-3.868 1.935A1.875 1.875 0 0 1 2.25 19.18V6.695c0-.71.401-1.36 1.036-1.677l4.875-2.437ZM9 6a.75.75 0 0 1 .75.75V15a.75.75 0 0 1-1.5 0V6.75A.75.75 0 0 1 9 6Zm6.75 3a.75.75 0 0 0-1.5 0v8.25a.75.75 0 0 0 1.5 0V9Z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
              <h2 className="font-semibold text-gray-900 dark:text-gray-100">
                {t("fishingRegions")}
              </h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {regions.map((region) => (
                <span
                  key={region}
                  className="text-xs px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-100 dark:border-blue-800/50"
                >
                  {region}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Bait & Lure Card */}
        {baits.length > 0 && (
          <div className="rounded-2xl bg-white dark:bg-gray-800 ring-1 ring-gray-100 dark:ring-gray-700/50 p-5 sm:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-900/30">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-4.5 h-4.5 text-amber-600 dark:text-amber-400"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.5 3.798v5.02a3 3 0 0 1-.879 2.121l-2.377 2.377a9.845 9.845 0 0 1 5.091 1.013 8.315 8.315 0 0 0 5.713.636l.285-.071-3.954-3.955a3 3 0 0 1-.879-2.121v-5.02a23.614 23.614 0 0 0-3 0Zm4.5.138a.75.75 0 0 0 .093-1.495A24.837 24.837 0 0 0 12 2.25a25.048 25.048 0 0 0-3.093.191A.75.75 0 0 0 9 3.936v4.882a1.5 1.5 0 0 1-.44 1.06l-6.293 6.294c-1.62 1.621-.903 4.475 1.471 4.88 2.686.46 5.447.698 8.262.698 2.816 0 5.576-.239 8.262-.697 2.373-.406 3.092-3.26 1.471-4.881L15.44 9.879A1.5 1.5 0 0 1 15 8.818V3.936Z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
              <h2 className="font-semibold text-gray-900 dark:text-gray-100">
                {t("bestBait")}
              </h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {baits.map((bait) => (
                <span
                  key={bait}
                  className="text-xs px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 border border-amber-100 dark:border-amber-800/50"
                >
                  {bait}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
