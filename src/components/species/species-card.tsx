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
      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      : species.habitat === "saltwater"
        ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
        : "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200";

  return (
    <Link
      href={`/species/${species.id}`}
      className="block rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5"
    >
      <div className="h-44 bg-gradient-to-br from-cyan-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center">
        <svg className="w-16 h-16 text-cyan-300 dark:text-cyan-700" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-1 14.5c-2 0-4-1.5-4-4s2-5 4-5c1 0 2 .5 2.5 1l2-1.5c.5-.3 1 0 .8.5l-1 3h2c.5 0 .7.5.4.8l-4 4c-.3.3-.7.1-.7-.3v-2h-1c-.5 0-1-.3-1-.5z"/>
        </svg>
      </div>
      <div className="p-3">
        <h3 className="font-semibold text-sm">{name}</h3>
        <p className="text-xs text-gray-500 italic">{species.scientific_name}</p>
        <span
          className={`inline-block mt-2 text-xs px-2 py-0.5 rounded-full ${habitatColor}`}
        >
          {habitatLabel}
        </span>
      </div>
    </Link>
  );
}
