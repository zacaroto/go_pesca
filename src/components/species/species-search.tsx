"use client";

import { useTranslations } from "next-intl";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export function SpeciesSearch({ value, onChange }: Props) {
  const t = useTranslations("common");

  return (
    <div className="relative flex-1">
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
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={`${t("search")}...`}
        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm bg-white dark:bg-gray-800/50 focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-400 outline-none transition-all"
      />
    </div>
  );
}
