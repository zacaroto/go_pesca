"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { CatchCard } from "./catch-card";
import { CatchFilters } from "./catch-filters";

type CatchEntry = {
  id: string;
  photo_url: string;
  catch_date: string;
  location_name: string | null;
  species_id: number;
  species_name: string;
};

type Species = {
  id: number;
  name: string;
};

type Props = {
  catches: CatchEntry[];
  species: Species[];
};

export function CatchList({ catches, species }: Props) {
  const t = useTranslations("catches");
  const tCommon = useTranslations("common");
  const [search, setSearch] = useState("");
  const [selectedSpecies, setSelectedSpecies] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const filtered = catches.filter((c) => {
    if (search) {
      const q = search.toLowerCase();
      const matchesSpecies = c.species_name.toLowerCase().includes(q);
      const matchesLocation = c.location_name?.toLowerCase().includes(q);
      if (!matchesSpecies && !matchesLocation) return false;
    }
    if (selectedSpecies && c.species_id !== parseInt(selectedSpecies))
      return false;
    if (dateFrom && c.catch_date < dateFrom) return false;
    if (dateTo && c.catch_date > dateTo) return false;
    return true;
  });

  return (
    <div>
      {/* Search */}
      <div className="relative mb-3">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </svg>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={`${tCommon("search")}...`}
          className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm bg-white dark:bg-gray-800/50 focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-400 outline-none transition-all"
        />
      </div>

      {/* Filters */}
      <CatchFilters
        species={species}
        selectedSpecies={selectedSpecies}
        onSpeciesChange={setSelectedSpecies}
        dateFrom={dateFrom}
        dateTo={dateTo}
        onDateFromChange={setDateFrom}
        onDateToChange={setDateTo}
      />

      {/* Results count */}
      <p className="text-xs text-gray-400 mb-3">
        {filtered.length} {filtered.length === 1 ? "catch" : "catches"}
      </p>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-4xl mb-3">{"\u{1F3A3}"}</div>
          <p className="text-gray-500 dark:text-gray-400">{t("noCatches")}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((c) => (
            <CatchCard key={c.id} catch_entry={c} />
          ))}
        </div>
      )}
    </div>
  );
}
