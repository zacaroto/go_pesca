import { Link } from "@/i18n/navigation";
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

  const habitatBadgeStyle =
    species.habitat === "freshwater"
      ? "bg-secondary text-white"
      : species.habitat === "saltwater"
        ? "bg-primary text-white"
        : "bg-tertiary-container text-white";

  return (
    <Link
      href={`/species/${species.id}`}
      className="card-foil group block rounded-3xl overflow-hidden bg-card-bg chunky-border chunky-shadow hover:scale-105 active:translate-y-0.5 active:translate-x-0.5 transition-all p-3.5 flex flex-col gap-3 relative"
    >
      {/* Image Area */}
      <div className="relative aspect-[4/3] rounded-2xl bg-surface-container flex items-center justify-center overflow-hidden border-2 border-white/60 shadow-inner">
        {species.reference_photo_url ? (
          <img
            src={species.reference_photo_url}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-primary-fixed flex items-center justify-center">
            <span className="text-3xl">🐟</span>
          </div>
        )}

        {/* Habitat badge */}
        <span
          className={`absolute top-2.5 right-2.5 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm border border-white/40 ${habitatBadgeStyle}`}
        >
          {habitatLabel}
        </span>
      </div>

      {/* Info Body */}
      <div className="flex flex-col">
        <h3
          className="font-headline-md text-base sm:text-lg font-bold text-on-surface leading-tight truncate"
          style={{ fontFamily: "var(--font-fredoka)" }}
        >
          {name}
        </h3>
        <p className="font-label-sm text-xs text-outline italic truncate mt-0.5">
          {species.scientific_name}
        </p>
      </div>
    </Link>
  );
}
