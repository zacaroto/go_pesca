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

  const habitatColor =
    species.habitat === "freshwater"
      ? "bg-secondary/15 text-secondary border-secondary/30"
      : species.habitat === "saltwater"
        ? "bg-primary/15 text-primary border-primary/30"
        : "bg-accent/15 text-accent border-accent/30";

  const topStripe =
    species.habitat === "freshwater"
      ? "from-secondary to-emerald-400"
      : species.habitat === "saltwater"
        ? "from-primary to-primary-light"
        : "from-accent to-accent-light";

  return (
    <Link
      href={`/species/${species.id}`}
      className="group block rounded-2xl overflow-hidden bg-surface dark:bg-surface-alt ring-1 ring-foreground/5 dark:ring-white/5 hover:shadow-ocean transition-all duration-300 hover:-translate-y-1"
    >
      {/* Habitat color stripe */}
      <div className={`h-1 bg-gradient-to-r ${topStripe}`} />

      {/* Image */}
      <div className="relative h-44 bg-gradient-to-br from-primary-light/10 to-surface-alt/50 dark:from-white/5 dark:to-surface flex items-center justify-center overflow-hidden">
        {species.reference_photo_url ? (
          <img
            src={species.reference_photo_url}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-primary-light/10 flex items-center justify-center">
            <span className="text-3xl">🐟</span>
          </div>
        )}
        <span
          className={`absolute top-2.5 right-2.5 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${habitatColor}`}
        >
          {habitatLabel}
        </span>
      </div>

      {/* Info */}
      <div className="p-3">
        <h3 className="font-bold text-sm text-foreground">{name}</h3>
        <p className="text-[11px] text-muted italic mt-0.5 truncate">
          {species.scientific_name}
        </p>
      </div>
    </Link>
  );
}
