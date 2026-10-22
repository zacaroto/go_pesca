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
      aria-label={t("habitat")}
      className="field w-auto"
    >
      <option value="">{t("allHabitats")}</option>
      <option value="freshwater">{t("freshwater")}</option>
      <option value="saltwater">{t("saltwater")}</option>
      <option value="brackish">{t("brackish")}</option>
    </select>
  );
}
