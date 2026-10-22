"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { FishMark } from "@/components/layout/fish-mark";
import { SpeciesCard, type CatalogCardSpecies } from "./species-card";
import { catalogCounts, filterCatalog, type CatalogFilter, type CatalogSort } from "@/lib/species-catalog";

type Props = {
  species: CatalogCardSpecies[];
  locale: string;
};

const FILTERS: CatalogFilter[] = ["all", "saltwater", "freshwater", "brackish", "release"];

const pressable =
  "focus-visible:outline-2 focus-visible:outline-offset-2 active:scale-[0.97] transition-[background-color,color,transform] duration-[var(--t-ui)] ease-[var(--ease-out)] motion-reduce:transition-none motion-reduce:active:scale-100";

/** "Láminas": search, sort and filter chips over a grid of species plates. */
export function SpeciesGrid({ species, locale }: Props) {
  const t = useTranslations("species");
  const tCommon = useTranslations("common");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<CatalogFilter>("all");
  const [sort, setSort] = useState<CatalogSort>("az");

  const counts = catalogCounts(species);
  const visible = filterCatalog(species, { query, filter, sort }, locale);
  const filterLabel: Record<CatalogFilter, string> = {
    all: t("filterAll"),
    saltwater: t("saltwater"),
    freshwater: t("freshwater"),
    brackish: t("brackish"),
    release: t("filterRelease"),
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center gap-3">
        <label className="flex h-11 min-w-0 flex-[1_1_260px] items-center gap-2 rounded-[var(--r-pill)] bg-surface px-4 focus-within:shadow-[inset_0_0_0_1.5px_var(--accent)] transition-[box-shadow] duration-[var(--t-ui)] motion-reduce:transition-none">
          <svg className="h-4 w-4 shrink-0 text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("searchPlaceholder")}
            aria-label={t("searchPlaceholder")}
            className="min-w-0 flex-1 bg-transparent text-body text-text outline-none placeholder:text-faint"
          />
        </label>
        <div role="group" aria-label={t("sortLabel")} className="inline-flex rounded-[var(--r-pill)] bg-raised p-1">
          {(["az", "largest"] as const).map((key) => (
            <button
              key={key}
              type="button"
              aria-pressed={sort === key}
              onClick={() => setSort(key)}
              className={`rounded-[var(--r-pill)] px-3.5 py-1.5 text-label font-medium text-muted hover:text-text aria-pressed:bg-surface aria-pressed:text-text ${pressable}`}
            >
              {key === "az" ? t("sortAZ") : t("sortLargest")}
            </button>
          ))}
        </div>
      </div>

      <div role="group" aria-label={t("filterLabel")} className="flex flex-wrap gap-2">
        {FILTERS.map((key) => (
          <button
            key={key}
            type="button"
            aria-pressed={filter === key}
            onClick={() => setFilter(key)}
            className={`rounded-[var(--r-pill)] bg-surface px-3.5 py-2 text-small font-medium text-text hover:bg-raised aria-pressed:bg-accent aria-pressed:text-on-primary ${pressable}`}
          >
            {filterLabel[key]}
            <span className="ml-1.5 tabular-nums opacity-70">{counts[key]}</span>
          </button>
        ))}
      </div>

      <p className="m-0 text-label text-muted" aria-live="polite">
        {t("resultCount", { count: visible.length })}
      </p>

      {visible.length === 0 ? (
        <div className="py-16 text-center">
          <FishMark className="mx-auto mb-3 h-10 w-10 text-silhouette" />
          <p className="text-muted">{tCommon("noResults")}</p>
        </div>
      ) : (
        <ul className="m-0 grid list-none grid-cols-2 gap-3 p-0 md:grid-cols-3 lg:grid-cols-4 sm:gap-4">
          {visible.map((s) => (
            <li key={s.id} className="min-w-0">
              <SpeciesCard species={s} locale={locale} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
