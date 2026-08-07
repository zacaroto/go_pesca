"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";

type Species = {
  id: number;
  name_es: string;
  name_en: string;
  scientific_name: string;
};

type Props = {
  locale: string;
  value: number | null;
  onChange: (id: number) => void;
};

export function SpeciesPicker({ locale, value, onChange }: Props) {
  const t = useTranslations("catches");
  const [species, setSpecies] = useState<Species[]>([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const supabase = createClient();
        const { data } = await supabase
          .from("species")
          .select("id, name_es, name_en, scientific_name")
          .order("name_es");
        if (data) setSpecies(data);
      } catch {
        // Supabase not configured
      }
    }
    load();
  }, []);

  const getName = (s: Species) =>
    locale === "es" ? s.name_es : s.name_en;

  const filtered = species.filter((s) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      s.name_es.toLowerCase().includes(q) ||
      s.name_en.toLowerCase().includes(q) ||
      s.scientific_name.toLowerCase().includes(q)
    );
  });

  const selected = species.find((s) => s.id === value);

  return (
    <div className="relative">
      <label className="block text-sm font-medium mb-1">
        {t("species")} *
      </label>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full text-left rounded-md border border-gray-300 dark:border-gray-700 px-3 py-2 text-sm dark:bg-gray-900"
      >
        {selected ? getName(selected) : t("selectSpecies")}
      </button>
      {open && (
        <div className="absolute z-50 mt-1 w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md shadow-lg max-h-60 overflow-auto">
          <div className="p-2 sticky top-0 bg-white dark:bg-gray-900">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={`${t("selectSpecies")}...`}
              className="w-full rounded border border-gray-300 dark:border-gray-700 px-2 py-1 text-sm dark:bg-gray-800"
              autoFocus
            />
          </div>
          {filtered.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => {
                onChange(s.id);
                setOpen(false);
                setSearch("");
              }}
              className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 ${
                s.id === value ? "bg-blue-50 dark:bg-blue-900/30" : ""
              }`}
            >
              <span className="font-medium">{getName(s)}</span>
              <span className="text-gray-500 ml-2 text-xs italic">
                {s.scientific_name}
              </span>
            </button>
          ))}
          {filtered.length === 0 && (
            <p className="px-3 py-2 text-sm text-gray-500">
              {t("selectSpecies")}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
