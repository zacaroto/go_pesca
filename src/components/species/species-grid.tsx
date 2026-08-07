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
  const t = useTranslations("species");
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
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <SpeciesSearch value={search} onChange={setSearch} />
        <SpeciesFilter value={habitat} onChange={setHabitat} />
      </div>
      {filtered.length === 0 ? (
        <div className="text-center py-12">
          <svg className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <p className="text-gray-500">{t("allHabitats")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((s) => (
            <SpeciesCard key={s.id} species={s} locale={locale} />
          ))}
        </div>
      )}
    </div>
  );
}
