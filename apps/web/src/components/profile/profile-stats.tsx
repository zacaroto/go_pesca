"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { RankRing } from "@/components/rank/rank-ring";

type Props = {
  stats: {
    totalCatches: number;
    speciesCaught: number;
    trophies: number;
    /** Null for visitors: achievements are only readable by their owner. */
    achievements: number | null;
  };
  rankData: { caught: number; total: number };
};

const statCard = "rounded-[var(--r-card)] bg-surface p-4";
const statValue = "block font-serif-display text-4xl font-black leading-none text-text tabular-nums";
const statLabel = "mt-1.5 block text-[13px] text-muted";

/** Rank ring plus the angler's headline numbers. */
export function ProfileStats({ stats, rankData }: Props) {
  const t = useTranslations("profile");

  return (
    <div className="flex flex-col gap-4">
      <section className="rounded-[var(--r-card)] bg-surface p-5">
        <RankRing caught={rankData.caught} total={rankData.total} />
      </section>

      <section className={`grid grid-cols-2 gap-3 ${stats.achievements != null ? "md:grid-cols-4" : "md:grid-cols-3"}`}>
        <div className={statCard}>
          <span className={statValue}>{stats.totalCatches.toLocaleString()}</span>
          <span className={statLabel}>{t("totalCatches")}</span>
        </div>
        <div className={statCard}>
          <span className={statValue}>
            {stats.speciesCaught}
            <span className="font-sans text-base font-medium text-muted">/{rankData.total}</span>
          </span>
          <span className={statLabel}>{t("speciesCaught")}</span>
        </div>
        <div className={statCard}>
          <span className={statValue}>{stats.trophies}</span>
          <span className={statLabel}>{t("trophies")}</span>
        </div>
        {stats.achievements != null && (
          <Link
            href="/achievements"
            className={`${statCard} hover:bg-raised active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 transition-[background-color,transform] duration-[var(--t-ui)] ease-[var(--ease-out)] motion-reduce:transition-none motion-reduce:active:scale-100`}
          >
            <span className={statValue}>{stats.achievements}</span>
            <span className={statLabel}>{t("achievements")} &rsaquo;</span>
          </Link>
        )}
      </section>
    </div>
  );
}
