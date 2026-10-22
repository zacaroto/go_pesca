"use client";

import { useTranslations } from "next-intl";
import { FishMark } from "@/components/layout/fish-mark";
import { getRank, type RankKey } from "@/lib/rank";

const ROMAN = { 1: "I", 2: "II", 3: "III" } as const;

const TIER_COLORS: Record<RankKey, string> = {
  sardina: "bg-raised text-muted",
  tilapia: "pill-fresh",
  robalo: "pill-salt",
  dorado: "pill-brack",
  marlinAzul: "bg-accent text-on-primary",
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
    sm: "text-[13px] px-2.5 py-1 gap-1",
    md: "text-sm px-3.5 py-1.5 gap-1.5",
    lg: "text-base px-5 py-2 gap-2",
  }[size];

  const iconSize = {
    sm: "h-3.5 w-3.5",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  }[size];

  return (
    <span
      className={`inline-flex items-center font-semibold rounded-[var(--r-pill)] ${TIER_COLORS[key]} ${sizeClasses}`}
    >
      <FishMark className={iconSize} />
      {t(key)} {ROMAN[level]}
    </span>
  );
}
