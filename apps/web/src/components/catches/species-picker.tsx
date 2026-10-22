"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { FishMark } from "@/components/layout/fish-mark";
import { RegulationCard } from "@/components/species/regulation-tag";
import { parseRegulation, type Regulation } from "@/lib/regulation";

type Species = {
  id: number;
  name_es: string;
  name_en: string;
  scientific_name: string;
  reference_photo_url: string | null;
  regulation?: string | null;
  regulation_note_es?: string | null;
  regulation_note_en?: string | null;
  regulation_source_url?: string | null;
};

export type PickedSpecies = {
  id: number;
  name: string;
  scientific_name: string;
  reference_photo_url: string | null;
  regulation: Regulation | null;
};

type Props = {
  locale: string;
  value: number | null;
  onChange: (id: number) => void;
  onSpeciesMeta?: (meta: PickedSpecies) => void;
};

const INITIAL_COUNT = 8;

export function SpeciesPicker({ locale, value, onChange, onSpeciesMeta }: Props) {
  const t = useTranslations("catches");
  const [species, setSpecies] = useState<Species[]>([]);
  const [search, setSearch] = useState("");
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("species")
          // "*" so the picker keeps working before the regulation columns exist.
          .select("*")
          .order("name_es");
        if (error) throw error;
        if (data) setSpecies(data);
      } catch (err) {
        console.error("SpeciesPicker: failed to load species", err);
        setLoadError(true);
      }
    }
    load();
  }, []);

  const getName = (s: Species) => (locale === "es" ? s.name_es : s.name_en);

  const q = search.trim().toLowerCase();
  const filtered = q
    ? species.filter(
        (s) =>
          s.name_es.toLowerCase().includes(q) ||
          s.name_en.toLowerCase().includes(q) ||
          s.scientific_name.toLowerCase().includes(q)
      )
    : species.slice(0, INITIAL_COUNT);

  // Keep the chosen species visible even when it falls outside the first 8.
  const selected = species.find((s) => s.id === value);
  const visible =
    !q && selected && !filtered.some((s) => s.id === selected.id)
      ? [selected, ...filtered.slice(0, INITIAL_COUNT - 1)]
      : filtered;

  function pick(s: Species) {
    onChange(s.id);
    onSpeciesMeta?.({
      id: s.id,
      name: getName(s),
      scientific_name: s.scientific_name,
      reference_photo_url: s.reference_photo_url,
      regulation: parseRegulation(s.regulation),
    });
  }

  return (
    <div>
      <label
        className="flex items-center gap-2 h-[42px] px-3.5 rounded-[var(--r-pill)] bg-[var(--ground)] focus-within:shadow-[inset_0_0_0_1.5px_var(--accent)] transition-[box-shadow] duration-[var(--t-ui)] motion-reduce:transition-none"
      >
        <svg className="w-4 h-4 shrink-0 text-[var(--muted)]" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth={1.8} strokeLinecap="round" aria-hidden="true">
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t("searchSpecies", { count: species.length })}
          aria-label={t("selectSpecies")}
          className="flex-1 min-w-0 bg-transparent outline-none text-sm text-[var(--text)] placeholder:text-[var(--faint)]"
        />
      </label>

      {loadError && (
        <p role="alert" className="mt-3 text-sm text-[var(--negative)]">{t("errorLoadSpecies")}</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
        {visible.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => pick(s)}
            aria-pressed={s.id === value}
            data-selected={s.id === value}
            className="grid grid-cols-[52px_minmax(0,1fr)] gap-3 items-center p-2 rounded-md text-left cursor-pointer bg-[var(--ground)] hover:bg-[var(--raised)] active:bg-[var(--raised)] active:scale-[0.99] data-[selected=true]:bg-[var(--accent-soft)] data-[selected=true]:shadow-[inset_0_0_0_1.5px_var(--accent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] transition-[background-color,box-shadow,transform] duration-[var(--t-ui)] ease-[var(--ease-out)] motion-reduce:transition-none motion-reduce:active:scale-100"
          >
            <span className="h-9 rounded-[3px] overflow-hidden bg-[var(--surface)] flex items-center justify-center text-[var(--silhouette)]">
              {s.reference_photo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={s.reference_photo_url} alt="" className="w-full h-full object-cover" />
              ) : (
                <FishMark className="w-6 h-6" />
              )}
            </span>
            <span className="min-w-0">
              <span className="font-serif-display font-bold text-[15px] leading-tight block truncate text-[var(--text)]">
                {getName(s)}
              </span>
              <span className="sci-name text-[11px] block truncate">{s.scientific_name}</span>
            </span>
          </button>
        ))}
      </div>

      {selected && parseRegulation(selected.regulation) && (
        <div className="mt-3">
          <RegulationCard
            regulation={parseRegulation(selected.regulation)}
            note={(locale === "en" ? selected.regulation_note_en : selected.regulation_note_es) ?? null}
            sourceUrl={selected.regulation_source_url ?? null}
          />
        </div>
      )}

      {species.length > 0 && visible.length === 0 && (
        <p className="mt-3 text-sm text-[var(--muted)]">{t("noSpeciesFound")}</p>
      )}
    </div>
  );
}
