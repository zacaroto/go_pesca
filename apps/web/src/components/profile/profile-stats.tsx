"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { RankBadge } from "@/components/rank/rank-badge";

type Props = {
  stats: {
    totalCatches: number;
    speciesCaught: number;
    achievements: number;
  };
  memberSince: string;
  rankData: { caught: number; total: number };
};

export function ProfileStats({ stats, memberSince, rankData }: Props) {
  const t = useTranslations("profile");

  return (
    <div className="space-y-8">
      {/* Rank badge */}
      <div className="flex justify-center">
        <RankBadge caught={rankData.caught} total={rankData.total} size="lg" />
      </div>

      {/* Stats Grid (Bento Style) */}
      <section className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {/* Catches Card */}
        <div className="bg-card-bg rounded-xl chunky-border p-4 flex flex-col items-center text-center chunky-shadow hover:-translate-y-1 transition-transform cursor-pointer relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-sunny-yellow/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="bg-sunny-yellow text-on-surface p-3 rounded-full mb-3 border-2 border-on-surface chunky-shadow transform group-hover:rotate-12 transition-transform relative z-10">
            <span className="material-symbols-outlined text-3xl">set_meal</span>
          </div>
          <span
            className="text-display-lg text-on-surface leading-none mb-1 relative z-10"
            style={{ fontFamily: "var(--font-fredoka)" }}
          >
            {stats.totalCatches.toLocaleString()}
          </span>
          <span className="text-label-sm text-muted uppercase tracking-wider relative z-10">
            {t("totalCatches")}
          </span>
        </div>

        {/* Species Card */}
        <div className="bg-card-bg rounded-xl chunky-border p-4 flex flex-col items-center text-center chunky-shadow hover:-translate-y-1 transition-transform cursor-pointer relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-secondary-container/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="bg-secondary-container text-on-secondary-container p-3 rounded-full mb-3 border-2 border-on-surface chunky-shadow transform group-hover:-rotate-12 transition-transform relative z-10">
            <span className="material-symbols-outlined text-3xl">20mp</span>
          </div>
          <span
            className="text-display-lg text-on-surface leading-none mb-1 relative z-10"
            style={{ fontFamily: "var(--font-fredoka)" }}
          >
            {stats.speciesCaught}
          </span>
          <span className="text-label-sm text-muted uppercase tracking-wider relative z-10">
            {t("speciesCaught")}
          </span>
        </div>

        {/* Achievements Card */}
        <Link
          href="/achievements"
          className="bg-card-bg rounded-xl chunky-border p-4 flex flex-col items-center text-center chunky-shadow hover:-translate-y-1 transition-transform cursor-pointer relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-electric-purple/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="bg-electric-purple text-on-primary p-3 rounded-full mb-3 border-2 border-on-surface chunky-shadow transform group-hover:rotate-180 transition-transform duration-500 relative z-10">
            <span className="material-symbols-outlined text-3xl">military_tech</span>
          </div>
          <span
            className="text-display-lg text-on-surface leading-none mb-1 relative z-10"
            style={{ fontFamily: "var(--font-fredoka)" }}
          >
            {stats.achievements}
          </span>
          <span className="text-label-sm text-muted uppercase tracking-wider relative z-10">
            {t("achievements")} &rsaquo;
          </span>
        </Link>
      </section>
    </div>
  );
}
