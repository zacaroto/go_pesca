"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { SpeciesCard } from "./species-card";
import { SpeciesFilter } from "./species-filter";
import { SpeciesSearch } from "./species-search";

type Species = {
  id: number;
  name_es: string;
  name_en: string;
  scientific_name: string;
  habitat: string;
  description_es: string | null;
  description_en: string | null;
  reference_photo_url: string | null;
};

type Props = {
  species: Species[];
  locale: string;
};

export function SpeciesGrid({ species, locale }: Props) {
  const tCommon = useTranslations("common");
  const [search, setSearch] = useState("");
  const [habitat, setHabitat] = useState("");

  const filtered = species.filter((s) => {
    const name = locale === "es" ? s.name_es : s.name_en;
    const matchesSearch =
      !search ||
      name.toLowerCase().includes(search.toLowerCase()) ||
      s.scientific_name.toLowerCase().includes(search.toLowerCase());
    const matchesHabitat = !habitat || s.habitat === habitat;
    return matchesSearch && matchesHabitat;
  });

  return (
    <div>
      {/* Search & Filters */}
      <div className="space-y-3 mb-5">
        <SpeciesSearch value={search} onChange={setSearch} />
        <div className="flex items-center gap-2">
          <SpeciesFilter value={habitat} onChange={setHabitat} />
        </div>
      </div>

      {/* Results count */}
      <p className="text-xs text-gray-400 mb-3">
        {filtered.length} species
      </p>

      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-4xl mb-3">{"\u{1F41F}"}</div>
          <p className="text-gray-500 dark:text-gray-400">{tCommon("noResults")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {filtered.map((s) => (
            <SpeciesCard key={s.id} species={s} locale={locale} />
          ))}
        </div>
      )}
    </div>
  );
}
