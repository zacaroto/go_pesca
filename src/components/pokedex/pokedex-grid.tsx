"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { PokedexCard } from "./pokedex-card";
import { ProgressBar } from "./progress-bar";
import type { PokedexEntry } from "@/lib/pokedex";

type Props = {
  entries: PokedexEntry[];
  locale: string;
};

export function PokedexGrid({ entries, locale }: Props) {
  const t = useTranslations("pokedex");
  const tSpecies = useTranslations("species");
  const [filter, setFilter] = useState<"all" | "caught" | "uncaught">("all");
  const [habitat, setHabitat] = useState("");

  const caught = entries.filter((e) => e.catch_count > 0).length;

  const filtered = entries.filter((e) => {
    if (filter === "caught" && e.catch_count === 0) return false;
    if (filter === "uncaught" && e.catch_count > 0) return false;
    if (habitat && e.habitat !== habitat) return false;
    return true;
  });

  return (
    <div>
      <ProgressBar caught={caught} total={entries.length} />

      <div className="flex flex-wrap gap-2 mb-6">
        {(["all", "caught", "uncaught"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 text-sm rounded-full border transition-all duration-200 active:scale-[0.98] ${
              filter === f
                ? "bg-cyan-600 text-white border-cyan-600 shadow-sm"
                : "border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 hover:border-gray-400"
            }`}
          >
            {t(f)}
          </button>
        ))}
        <select
          value={habitat}
          onChange={(e) => setHabitat(e.target.value)}
          className="rounded-full border border-gray-300 dark:border-gray-600 px-3 py-1.5 text-sm dark:bg-gray-900"
        >
          <option value="">{tSpecies("allHabitats")}</option>
          <option value="freshwater">{tSpecies("freshwater")}</option>
          <option value="saltwater">{tSpecies("saltwater")}</option>
          <option value="brackish">{tSpecies("brackish")}</option>
        </select>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {filtered.map((entry) => (
          <PokedexCard key={entry.id} entry={entry} locale={locale} />
        ))}
      </div>
    </div>
  );
}
