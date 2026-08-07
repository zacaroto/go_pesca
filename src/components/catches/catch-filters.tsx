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
    <div className="flex flex-col sm:flex-row gap-3 mb-6">
      <select
        value={selectedSpecies}
        onChange={(e) => onSpeciesChange(e.target.value)}
        className="rounded-md border border-gray-300 dark:border-gray-700 px-3 py-2 text-sm dark:bg-gray-900"
      >
        <option value="">{t("filterBySpecies")}</option>
        {species.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name}
          </option>
        ))}
      </select>
      <input
        type="date"
        value={dateFrom}
        onChange={(e) => onDateFromChange(e.target.value)}
        placeholder={t("filterByDate")}
        className="rounded-md border border-gray-300 dark:border-gray-700 px-3 py-2 text-sm dark:bg-gray-900"
      />
      <input
        type="date"
        value={dateTo}
        onChange={(e) => onDateToChange(e.target.value)}
        className="rounded-md border border-gray-300 dark:border-gray-700 px-3 py-2 text-sm dark:bg-gray-900"
      />
    </div>
  );
}
