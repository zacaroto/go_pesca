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

  // Determine active chip: habitat chips take priority when a habitat is selected
  const activeChip = habitat || filter;

  function handleChip(value: string) {
    if (value === "all" || value === "caught" || value === "uncaught") {
      setFilter(value as "all" | "caught" | "uncaught");
      setHabitat("");
    } else {
      // habitat chip
      setHabitat(value);
      setFilter("all");
    }
  }

  // Suppress unused translation warnings — kept for potential future use
  void t;
  void tCommon;
  void tSpecies;

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <ProgressBar caught={caught} total={entries.length} />

      {/* Filter chip row */}
      <div
        className="flex items-center gap-2 overflow-x-auto pb-1 mb-4"
        style={{ scrollbarWidth: "none" }}
      >
        {[
          { value: "all",        label: "Todas" },
          { value: "caught",     label: "Capturadas" },
          { value: "uncaught",   label: "Sin capturar" },
          { value: "saltwater",  label: "Salada" },
          { value: "freshwater", label: "Dulce" },
          { value: "brackish",   label: "Salobre" },
        ].map((chip) => {
          const active = activeChip === chip.value;
          return (
            <button
              key={chip.value}
              onClick={() => handleChip(chip.value)}
              style={{
                background: active ? "rgba(37,99,235,0.15)" : "transparent",
                color: active ? "var(--accent-hi)" : "var(--muted)",
                border: "none",
                borderRadius: "var(--r-pill)",
                padding: "6px 14px",
                fontSize: "12px",
                fontWeight: 600,
                letterSpacing: "0.04em",
                cursor: "pointer",
                whiteSpace: "nowrap",
                flexShrink: 0,
                transition: `color var(--t-ui), background var(--t-ui)`,
              }}
            >
              {chip.label}
            </button>
          );
        })}
      </div>

      {/* Species grid */}
      <div className="grid grid-cols-2 gap-3">
        {filtered.map((entry) => (
          <PokedexCard key={entry.id} entry={entry} locale={locale} />
        ))}
      </div>
    </div>
  );
}
