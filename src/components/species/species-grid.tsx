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
        <p className="text-gray-500 text-center py-8">{t("allHabitats")}</p>
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
