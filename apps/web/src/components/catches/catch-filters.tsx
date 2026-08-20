"use client";

import { useTranslations } from "next-intl";

type Species = {
  id: number;
  name: string;
};

type Props = {
  species: Species[];
  selectedSpecies: string;
  onSpeciesChange: (value: string) => void;
  dateFrom: string;
  dateTo: string;
  onDateFromChange: (value: string) => void;
  onDateToChange: (value: string) => void;
};

export function CatchFilters({
  species,
  selectedSpecies,
  onSpeciesChange,
  dateFrom,
  dateTo,
  onDateFromChange,
  onDateToChange,
}: Props) {
  const t = useTranslations("catches");

  return (
    <div className="flex flex-col sm:flex-row gap-2 mb-5">
      <select
        value={selectedSpecies}
        onChange={(e) => onSpeciesChange(e.target.value)}
        className="flex-1 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-400 transition-all"
      >
        <option value="">{t("filterBySpecies")}</option>
        {species.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name}
          </option>
        ))}
      </select>
      <div className="flex gap-2">
        <input
          type="date"
          value={dateFrom}
          onChange={(e) => onDateFromChange(e.target.value)}
          className="flex-1 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-400 transition-all"
        />
        <input
          type="date"
          value={dateTo}
          onChange={(e) => onDateToChange(e.target.value)}
          className="flex-1 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-400 transition-all"
        />
      </div>
    </div>
  );
}
