"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { RankRing } from "@/components/rank/rank-ring";

type Props = {
  stats: {
    totalCatches: number;
    speciesCaught: number;
    achievements: number;
  };
  memberSince: string;
  rankData: { caught: number; total: number };
};

const statCard =
  "bg-surface border border-border rounded-[var(--r-card)] p-4 flex flex-col items-center text-center";
const statValue = "font-serif-display text-4xl font-bold text-text leading-none mb-1";
const statLabel = "text-[13px] text-muted";

export function ProfileStats({ stats, rankData }: Props) {
  const t = useTranslations("profile");

  return (
    <div className="space-y-8">
      {/* Rank badge */}
      <div className="flex justify-center">
        <RankRing caught={rankData.caught} total={rankData.total} />
      </div>

      <section className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className={statCard}>
          <span className={statValue}>{stats.totalCatches.toLocaleString()}</span>
          <span className={statLabel}>{t("totalCatches")}</span>
        </div>

        <div className={statCard}>
          <span className={statValue}>{stats.speciesCaught}</span>
          <span className={statLabel}>{t("speciesCaught")}</span>
        </div>

        <Link
          href="/achievements"
          className={`${statCard} hover:border-faint active:bg-raised transition-[border-color,background-color] duration-[var(--t-ui)] ease-[var(--ease-out)] motion-reduce:transition-none`}
        >
          <span className={statValue}>{stats.achievements}</span>
          <span className={statLabel}>{t("achievements")} &rsaquo;</span>
        </Link>
      </section>
    </div>
  );
}
