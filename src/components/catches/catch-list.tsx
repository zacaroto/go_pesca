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
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder={`${tCommon("search")}...`}
        className="w-full mb-3 rounded-md border border-gray-300 dark:border-gray-700 px-3 py-2 text-sm dark:bg-gray-900"
      />
      <CatchFilters
        species={species}
        selectedSpecies={selectedSpecies}
        onSpeciesChange={setSelectedSpecies}
        dateFrom={dateFrom}
        dateTo={dateTo}
        onDateFromChange={setDateFrom}
        onDateToChange={setDateTo}
      />
      {filtered.length === 0 ? (
        <p className="text-gray-500 text-center py-8">{t("noCatches")}</p>
      ) : (
        <div className="space-y-3">
          {filtered.map((c) => (
            <CatchCard key={c.id} catch_entry={c} />
          ))}
        </div>
      )}
    </div>
  );
}
