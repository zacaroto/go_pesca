"use client";

import { useTranslations } from "next-intl";
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

  const memberDate = new Date(memberSince);
  const formattedDate = memberDate.toLocaleDateString(undefined, {
    month: "short",
    year: "numeric",
  });

  return (
    <div className="rounded-2xl bg-surface dark:bg-surface-alt ring-1 ring-foreground/5 dark:ring-white/5 shadow-sm p-4 space-y-4">
      {/* Rank badge */}
      <div className="flex justify-center">
        <RankBadge caught={rankData.caught} total={rankData.total} size="lg" />
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-2">
        <div className="text-center">
          <div className="text-xl font-extrabold text-primary" style={{ fontFamily: "var(--font-fredoka)" }}>
            {stats.totalCatches}
          </div>
          <div className="text-[10px] font-medium text-muted leading-tight mt-0.5">{t("totalCatches")}</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-extrabold text-accent" style={{ fontFamily: "var(--font-fredoka)" }}>
            {stats.speciesCaught}
          </div>
          <div className="text-[10px] font-medium text-muted leading-tight mt-0.5">{t("speciesCaught")}</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-extrabold text-coral" style={{ fontFamily: "var(--font-fredoka)" }}>
            {stats.achievements}
          </div>
          <div className="text-[10px] font-medium text-muted leading-tight mt-0.5">{t("achievements")}</div>
        </div>
        <div className="text-center">
          <div className="text-sm font-extrabold text-secondary" style={{ fontFamily: "var(--font-fredoka)" }}>
            {formattedDate}
          </div>
          <div className="text-[10px] font-medium text-muted leading-tight mt-0.5">{t("memberSince")}</div>
        </div>
      </div>
    </div>
  );
}
