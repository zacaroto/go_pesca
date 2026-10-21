"use client";

import { useState } from "react";
import { PokedexCard } from "./pokedex-card";
import { ProgressBar } from "./progress-bar";
import type { PokedexEntry } from "@/lib/pokedex";

type Props = {
  entries: PokedexEntry[];
  locale: string;
};

export function PokedexGrid({ entries, locale }: Props) {
  const [filter, setFilter] = useState<"all" | "caught" | "uncaught">("all");
  const [habitat, setHabitat] = useState("");

  const caught = entries.filter((e) => e.catch_count > 0).length;

  const filtered = entries.filter((e) => {
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
              onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.95)")}
              onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              style={{
                background: active ? "var(--accent-soft)" : "transparent",
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
                transition: `color var(--t-ui), background var(--t-ui), transform var(--t-press)`,
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
