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
  sardina: "bg-foreground/8 text-muted border-foreground/15 dark:bg-white/8 dark:text-muted dark:border-white/15",
  tilapia: "bg-secondary/15 text-secondary border-secondary/30",
  robalo: "bg-primary/15 text-primary border-primary/30",
  dorado: "bg-accent/15 text-accent border-accent/30",
  marlinAzul: "bg-gradient-to-r from-coral/15 to-purple-500/15 text-coral border-coral/30",
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
    sm: "text-xs px-2.5 py-1 gap-1",
    md: "text-sm px-3.5 py-1.5 gap-1.5",
    lg: "text-base px-5 py-2 gap-2",
  }[size];

  const iconSize = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-lg",
  }[size];

  return (
    <span
      className={`inline-flex items-center font-extrabold rounded-xl border-2 ${TIER_COLORS[key]} ${sizeClasses}`}
    >
      <span className={iconSize}>{RANK_ICONS[key]}</span>
      {t(key)} {ROMAN[level]}
    </span>
  );
}
