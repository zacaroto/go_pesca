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
      className="block rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow"
    >
      <div className="h-40 bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-4xl">
        🐟
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
