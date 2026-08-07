"use client";

import { useTranslations } from "next-intl";
import { getRank, type RankKey } from "@/lib/rank";

const ROMAN = { 1: "I", 2: "II", 3: "III" } as const;

const TIER_COLORS: Record<RankKey, string> = {
  sardina: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300",
  tilapia: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  robalo: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  dorado: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
  marlinAzul: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
};

type Props = {
  caught: number;
  total: number;
  size?: "sm" | "md";
};

export function RankBadge({ caught, total, size = "md" }: Props) {
  const t = useTranslations("rank");
  const { key, level } = getRank(caught, total);

  const sizeClasses = size === "sm" ? "text-xs px-2 py-0.5" : "text-sm px-3 py-1";

  return (
    <span
      className={`inline-flex items-center font-semibold rounded-full ${TIER_COLORS[key]} ${sizeClasses}`}
    >
      {t(key)} {ROMAN[level]}
    </span>
  );
}
