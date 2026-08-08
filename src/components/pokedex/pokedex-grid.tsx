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
  const tCommon = useTranslations("common");
  const tSpecies = useTranslations("species");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "caught" | "uncaught">("all");
  const [habitat, setHabitat] = useState("");

  const caught = entries.filter((e) => e.catch_count > 0).length;

  const filtered = entries.filter((e) => {
    if (search) {
      const q = search.toLowerCase();
      const name = locale === "es" ? e.name_es : e.name_en;
      const matchesName = name.toLowerCase().includes(q);
      const matchesScientific = e.scientific_name.toLowerCase().includes(q);
      if (!matchesName && !matchesScientific) return false;
    }
    if (filter === "caught" && e.catch_count === 0) return false;
    if (filter === "uncaught" && e.catch_count > 0) return false;
    if (habitat && e.habitat !== habitat) return false;
    return true;
  });

  return (
    <div>
      <ProgressBar caught={caught} total={entries.length} />

      {/* Search & Filters */}
      <div className="mb-5 space-y-3">
        <div className="relative">
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

        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {(["all", "caught", "uncaught"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-shrink-0 px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 active:scale-[0.97] ${
                filter === f
                  ? "bg-cyan-600 text-white shadow-sm shadow-cyan-600/25"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              {t(f)}
              {f === "caught" && (
                <span className={`ml-1.5 text-xs ${filter === f ? "text-cyan-200" : "text-gray-400"}`}>
                  {caught}
                </span>
              )}
              {f === "uncaught" && (
                <span className={`ml-1.5 text-xs ${filter === f ? "text-cyan-200" : "text-gray-400"}`}>
                  {entries.length - caught}
                </span>
              )}
            </button>
          ))}
          <select
            value={habitat}
            onChange={(e) => setHabitat(e.target.value)}
            className="flex-shrink-0 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-cyan-500/30"
          >
            <option value="">{tSpecies("allHabitats")}</option>
            <option value="freshwater">{tSpecies("freshwater")}</option>
            <option value="saltwater">{tSpecies("saltwater")}</option>
            <option value="brackish">{tSpecies("brackish")}</option>
          </select>
        </div>
      </div>

      {/* Results count */}
      <p className="text-xs text-gray-400 mb-3">
        {filtered.length} {filtered.length === 1 ? "species" : "species"}
      </p>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {filtered.map((entry) => (
          <PokedexCard key={entry.id} entry={entry} locale={locale} />
        ))}
      </div>
    </div>
  );
}
