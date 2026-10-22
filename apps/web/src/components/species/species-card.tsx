import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { SpeciesPhoto } from "./species-photo";

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
      className="group block overflow-hidden bg-surface rounded-[var(--r-card)] hover:bg-raised active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-2 p-3 flex flex-col gap-3 relative transition-[background-color,transform] motion-reduce:active:scale-100 duration-[var(--t-ui)] ease-[var(--ease-out)] motion-reduce:transition-none"
    >
      <div className="relative aspect-[4/3] rounded-[var(--r-control)] bg-ground flex items-center justify-center overflow-hidden">
        <SpeciesPhoto
          src={species.reference_photo_url}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 ease-[var(--ease-out)] group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        />

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
