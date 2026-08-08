import Link from "next/link";
import { useTranslations } from "next-intl";

type Species = {
  id: number;
  name_es: string;
  name_en: string;
  scientific_name: string;
  habitat: string;
  reference_photo_url: string | null;
};

type Props = {
  species: Species;
  locale: string;
};

export function SpeciesCard({ species, locale }: Props) {
  const t = useTranslations("species");
  const name = locale === "es" ? species.name_es : species.name_en;

  const habitatLabel =
    species.habitat === "freshwater"
      ? t("freshwater")
      : species.habitat === "saltwater"
        ? t("saltwater")
        : t("brackish");

  const habitatColor =
    species.habitat === "freshwater"
      ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800"
      : species.habitat === "saltwater"
        ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800"
        : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800";

  return (
    <Link
      href={`/species/${species.id}`}
      className="group block rounded-2xl overflow-hidden bg-white dark:bg-gray-800/50 ring-1 ring-gray-100 dark:ring-gray-700/50 hover:shadow-lg hover:shadow-cyan-100/30 dark:hover:shadow-cyan-900/10 transition-all duration-300 hover:-translate-y-1"
    >
      <div className="relative h-44 bg-gradient-to-br from-cyan-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center overflow-hidden">
        {species.reference_photo_url ? (
          <img
            src={species.reference_photo_url}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <svg className="w-14 h-14 text-cyan-200 dark:text-cyan-800" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-1 14.5c-2 0-4-1.5-4-4s2-5 4-5c1 0 2 .5 2.5 1l2-1.5c.5-.3 1 0 .8.5l-1 3h2c.5 0 .7.5.4.8l-4 4c-.3.3-.7.1-.7-.3v-2h-1c-.5 0-1-.3-1-.5z"/>
          </svg>
        )}
        <span
          className={`absolute top-2 right-2 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${habitatColor}`}
        >
          {habitatLabel}
        </span>
      </div>
      <div className="p-3">
        <h3 className="font-semibold text-sm text-gray-900 dark:text-gray-100">{name}</h3>
        <p className="text-[11px] text-gray-400 dark:text-gray-500 italic mt-0.5 truncate">
          {species.scientific_name}
        </p>
      </div>
    </Link>
  );
}
