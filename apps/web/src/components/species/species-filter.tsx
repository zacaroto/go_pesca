"use client";

import { useTranslations } from "next-intl";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export function SpeciesFilter({ value, onChange }: Props) {
  const t = useTranslations("species");

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-400 transition-all"
    >
      <option value="">{t("allHabitats")}</option>
      <option value="freshwater">{t("freshwater")}</option>
      <option value="saltwater">{t("saltwater")}</option>
      <option value="brackish">{t("brackish")}</option>
    </select>
  );
}
