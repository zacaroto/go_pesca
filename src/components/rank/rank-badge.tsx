"use client";

import { useTranslations } from "next-intl";
import { getRank, type RankKey } from "@/lib/rank";

const ROMAN = { 1: "I", 2: "II", 3: "III" } as const;

const RANK_ICONS: Record<RankKey, string> = {
  sardina: "\u{1F41F}",   // 🐟
  tilapia: "\u{1F420}",   // 🐠
  robalo: "\u{1F3A3}",    // 🎣
  dorado: "\u{2B50}",     // ⭐
  marlinAzul: "\u{1F451}", // 👑
};

const TIER_COLORS: Record<RankKey, string> = {
  sardina: "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600",
  tilapia: "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/40 dark:text-green-300 dark:border-green-800",
  robalo: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-800",
  dorado: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/40 dark:text-amber-300 dark:border-amber-800",
  marlinAzul: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/40 dark:text-purple-300 dark:border-purple-800",
};

type Props = {
  caught: number;
  total: number;
  size?: "sm" | "md" | "lg";
};

export function RankBadge({ caught, total, size = "md" }: Props) {
  const t = useTranslations("rank");
  const { key, level } = getRank(caught, total);

  const sizeClasses = {
    sm: "text-xs px-2 py-0.5 gap-1",
    md: "text-sm px-3 py-1 gap-1.5",
    lg: "text-base px-4 py-1.5 gap-2",
  }[size];

  const iconSize = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-lg",
  }[size];

  return (
    <span
      className={`inline-flex items-center font-semibold rounded-full border ${TIER_COLORS[key]} ${sizeClasses}`}
    >
      <span className={iconSize}>{RANK_ICONS[key]}</span>
      {t(key)} {ROMAN[level]}
    </span>
  );
}
