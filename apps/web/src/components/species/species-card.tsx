import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { FishMark } from "@/components/layout/fish-mark";

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

  const habitatPill =
    species.habitat === "freshwater"
      ? "pill-fresh"
      : species.habitat === "saltwater"
        ? "pill-salt"
        : "pill-brack";

  return (
    <Link
      href={`/species/${species.id}`}
      className="group block overflow-hidden bg-surface border border-border rounded-[var(--r-card)] hover:border-faint active:bg-raised p-3 flex flex-col gap-3 relative transition-[border-color,background-color] duration-[var(--t-ui)] ease-[var(--ease-out)] motion-reduce:transition-none"
    >
      <div className="relative aspect-[4/3] rounded-[var(--r-control)] bg-ground flex items-center justify-center overflow-hidden">
        {species.reference_photo_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={species.reference_photo_url}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-500 ease-[var(--ease-out)] group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
        ) : (
          <FishMark className="h-12 w-12 text-silhouette" />
        )}

        <span
          className={`absolute top-2.5 right-2.5 text-[13px] font-semibold px-2.5 py-0.5 rounded-[var(--r-pill)] ${habitatPill}`}
        >
          {habitatLabel}
        </span>
      </div>

      <div className="flex flex-col">
        <h3 className="font-serif-display text-base sm:text-lg font-bold text-text leading-tight truncate">
          {name}
        </h3>
        <p className="sci-name text-sm truncate mt-0.5">
          {species.scientific_name}
        </p>
      </div>
    </Link>
  );
}
