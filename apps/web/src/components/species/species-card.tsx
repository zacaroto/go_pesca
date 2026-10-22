import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { SpeciesPhoto } from "./species-photo";
import { RegulationTag } from "./regulation-tag";
import { parseRegulation } from "@/lib/regulation";
import type { CatalogSpecies } from "@/lib/species-catalog";

export type CatalogCardSpecies = CatalogSpecies & {
  reference_photo_url: string | null;
  trophy_weight_kg?: number | null;
  trophy_length_cm?: number | null;
};

type Props = {
  species: CatalogCardSpecies;
  locale: string;
};

const HABITAT_PILL: Record<string, string> = {
  freshwater: "pill-fresh",
  saltwater: "pill-salt",
  brackish: "pill-brack",
};

/** Catalog plate: photo with habitat and legal tags, names, then max size and trophy mark. */
export function SpeciesCard({ species, locale }: Props) {
  const t = useTranslations("species");
  const name = locale === "en" ? species.name_en : species.name_es;
  const num = new Intl.NumberFormat(locale === "en" ? "en" : "es-CR", { maximumFractionDigits: 1 });
  const habitatKey = species.habitat === "freshwater" || species.habitat === "saltwater" ? species.habitat : "brackish";
  const trophy =
    species.trophy_weight_kg != null
      ? `${num.format(species.trophy_weight_kg)} kg`
      : species.trophy_length_cm != null
        ? `${num.format(species.trophy_length_cm)} cm`
        : null;

  return (
    <Link
      href={`/species/${species.id}`}
      className="group flex h-full flex-col gap-3 rounded-[var(--r-card)] bg-surface p-2.5 hover:bg-raised active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-2 transition-[background-color,transform] duration-[var(--t-ui)] ease-[var(--ease-out)] motion-reduce:transition-none motion-reduce:active:scale-100 sm:p-3"
    >
      <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-[3px] bg-ground">
        <SpeciesPhoto
          src={species.reference_photo_url}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-500 ease-[var(--ease-out)] group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        />
        <div className="absolute inset-x-2 top-2 flex flex-wrap items-start justify-between gap-1.5">
          <span className={`rounded-[var(--r-pill)] px-2.5 py-0.5 text-[12px] font-semibold sm:text-[13px] ${HABITAT_PILL[habitatKey]}`}>
            {t(habitatKey)}
          </span>
          <RegulationTag regulation={parseRegulation(species.regulation)} className="hidden sm:inline-flex" />
        </div>
      </div>

      <div className="min-w-0 px-0.5">
        <h3 className="m-0 truncate font-serif-display text-base font-bold leading-tight text-text sm:text-lg">{name}</h3>
        <p className="sci-name m-0 mt-0.5 truncate text-sm">{species.scientific_name}</p>
      </div>

      <dl className="m-0 mt-auto flex justify-between gap-2 border-t border-rule px-0.5 pt-2 text-[12px] text-muted sm:text-[13px]">
        <div className="min-w-0">
          <dt className="sr-only">{t("maxWeight")}</dt>
          <dd className="m-0 truncate">
            {species.max_weight_kg != null
              ? t.rich("upTo", { value: `${num.format(species.max_weight_kg)} kg`, b: (c) => <b className="font-semibold text-text">{c}</b> })
              : "—"}
          </dd>
        </div>
        {trophy && (
          <div className="min-w-0 text-right">
            <dt className="sr-only">{t("trophyTitle")}</dt>
            <dd className="m-0 truncate">
              {t.rich("trophyMark", { value: trophy, b: (c) => <b className="font-semibold text-text">{c}</b> })}
            </dd>
          </div>
        )}
      </dl>
    </Link>
  );
}
