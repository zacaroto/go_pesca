"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { FishMark } from "@/components/layout/fish-mark";
import { TrophyPill } from "@/components/profile/personal-records";
import { filterGallery, speciesCounts, type GalleryCatch, type GallerySort } from "@/lib/catch-gallery";

export type GalleryEntry = GalleryCatch & {
  photo_url: string | null;
  length_cm: number | null;
  trophy: boolean;
};

type Props = { catches: GalleryEntry[]; locale: string };
type View = "photos" | "list";

const SPECIES_CHIPS = 5;

const pressable =
  "focus-visible:outline-2 focus-visible:outline-offset-2 active:scale-[0.97] transition-[background-color,color,transform] duration-[var(--t-ui)] ease-[var(--ease-out)] motion-reduce:transition-none motion-reduce:active:scale-100";
const segButton = `rounded-[var(--r-pill)] px-3.5 py-1.5 text-label font-medium text-muted hover:text-text aria-pressed:bg-surface aria-pressed:text-text ${pressable}`;
const chip = `rounded-[var(--r-pill)] bg-surface px-3.5 py-2 text-small font-medium text-text hover:bg-raised aria-pressed:bg-accent aria-pressed:text-on-primary ${pressable}`;

/** "Galería": photo mosaic of the angler's catches with a compact list view, search, sort and species chips. */
export function CatchGallery({ catches, locale }: Props) {
  const t = useTranslations("catches");
  const [query, setQuery] = useState("");
  const [speciesId, setSpeciesId] = useState<number | null>(null);
  const [sort, setSort] = useState<GallerySort>("recent");
  const [view, setView] = useState<View>("photos");
  const [allChips, setAllChips] = useState(false);

  const counts = speciesCounts(catches);
  const chips = allChips ? counts : counts.slice(0, SPECIES_CHIPS);
  const visible = filterGallery(catches, { query, speciesId, sort });
  const num = new Intl.NumberFormat(locale === "en" ? "en" : "es-CR", { maximumFractionDigits: 1 });
  const date = (d: string) =>
    new Date(`${d}T00:00:00Z`).toLocaleDateString(locale, { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
  const meta = (c: GalleryEntry) =>
    [c.weight_kg != null ? `${num.format(c.weight_kg)} kg` : null, c.location_name, date(c.catch_date)].filter(Boolean).join(" · ");

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <label className="flex h-11 min-w-0 flex-[1_1_240px] items-center gap-2 rounded-[var(--r-pill)] bg-surface px-4 focus-within:shadow-[inset_0_0_0_1.5px_var(--accent)] transition-[box-shadow] duration-[var(--t-ui)] motion-reduce:transition-none">
          <svg className="h-4 w-4 shrink-0 text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("searchCatches")}
            aria-label={t("searchCatches")}
            className="min-w-0 flex-1 bg-transparent text-body text-text outline-none placeholder:text-faint"
          />
        </label>
        <div role="group" aria-label={t("sortLabel")} className="inline-flex rounded-[var(--r-pill)] bg-raised p-1">
          <button type="button" aria-pressed={sort === "recent"} onClick={() => setSort("recent")} className={segButton}>
            {t("sortRecent")}
          </button>
          <button type="button" aria-pressed={sort === "heaviest"} onClick={() => setSort("heaviest")} className={segButton}>
            {t("sortHeaviest")}
          </button>
        </div>
        <div role="group" aria-label={t("viewLabel")} className="inline-flex rounded-[var(--r-pill)] bg-raised p-1">
          <button type="button" aria-pressed={view === "photos"} onClick={() => setView("photos")} className={segButton}>
            {t("viewPhotos")}
          </button>
          <button type="button" aria-pressed={view === "list"} onClick={() => setView("list")} className={segButton}>
            {t("viewList")}
          </button>
        </div>
      </div>

      {counts.length > 1 && (
        <div role="group" aria-label={t("filterSpecies")} className="flex flex-wrap gap-2">
          <button type="button" aria-pressed={speciesId === null} onClick={() => setSpeciesId(null)} className={chip}>
            {t("allSpecies")}
            <span className="ml-1.5 tabular-nums opacity-70">{catches.length}</span>
          </button>
          {chips.map((s) => (
            <button key={s.id} type="button" aria-pressed={speciesId === s.id} onClick={() => setSpeciesId(s.id)} className={chip}>
              {s.name}
              <span className="ml-1.5 tabular-nums opacity-70">{s.count}</span>
            </button>
          ))}
          {counts.length > SPECIES_CHIPS && (
            <button type="button" onClick={() => setAllChips((v) => !v)} className={chip}>
              {allChips ? t("showLess") : t("showMore", { count: counts.length - SPECIES_CHIPS })}
            </button>
          )}
        </div>
      )}

      {visible.length === 0 ? (
        <div className="rounded-[var(--r-card)] bg-surface py-16 text-center">
          <FishMark className="mx-auto mb-3 h-10 w-10 text-silhouette" />
          <p className="m-0 text-muted">{t("noMatches")}</p>
        </div>
      ) : view === "photos" ? (
        <ul className="m-0 grid list-none grid-cols-2 gap-2 p-0 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4">
          {visible.map((c) => (
            <li key={c.id} className="min-w-0">
              <Link
                href={`/catches/${c.id}`}
                className="group relative block aspect-[4/5] overflow-hidden rounded-[var(--r-card)] bg-raised active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-2 transition-transform duration-[var(--t-ui)] ease-[var(--ease-out)] motion-reduce:transition-none motion-reduce:active:scale-100"
              >
                {c.photo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={c.photo_url}
                    alt={c.species_name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 ease-[var(--ease-out)] group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <FishMark className="h-14 w-14 text-silhouette" />
                  </div>
                )}
                {c.trophy && <TrophyPill className="absolute top-2.5 left-2.5" />}
                <div className="absolute inset-x-0 bottom-0 bg-[rgb(10_14_28/0.62)] px-3 py-2.5 text-white">
                  <p className="m-0 truncate font-serif-display text-name font-bold leading-tight">{c.species_name}</p>
                  <p className="m-0 truncate text-label opacity-85">{meta(c)}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <ul className="m-0 flex list-none flex-col gap-2 p-0">
          {visible.map((c) => (
            <li key={c.id}>
              <Link
                href={`/catches/${c.id}`}
                className="grid grid-cols-[72px_minmax(0,1fr)_auto] items-center gap-3 rounded-[var(--r-card)] bg-surface p-2 hover:bg-raised active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-2 transition-[background-color,transform] duration-[var(--t-ui)] ease-[var(--ease-out)] motion-reduce:transition-none motion-reduce:active:scale-100 sm:grid-cols-[96px_minmax(0,1fr)_auto]"
              >
                <div className="flex aspect-[4/3] items-center justify-center overflow-hidden rounded-[3px] bg-raised">
                  {c.photo_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={c.photo_url} alt="" loading="lazy" className="h-full w-full object-cover" />
                  ) : (
                    <FishMark className="h-8 w-8 text-silhouette" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="m-0 truncate font-serif-display text-name font-bold text-text">{c.species_name}</p>
                  <p className="m-0 truncate text-small text-muted tabular-nums">
                    {[c.weight_kg != null ? `${num.format(c.weight_kg)} kg` : null, c.length_cm != null ? `${num.format(c.length_cm)} cm` : null, c.location_name]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1.5 pr-1">
                  <span className="whitespace-nowrap text-label text-muted">{date(c.catch_date)}</span>
                  {c.trophy && <TrophyPill />}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
