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

  const statCards = [
    {
      label: t("totalCatches"),
      value: stats.totalCatches,
      icon: (
        <svg className="w-5 h-5 text-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
        </svg>
      ),
      color: "text-primary",
    },
    {
      label: t("speciesCaught"),
      value: stats.speciesCaught,
      icon: (
        <svg className="w-5 h-5 text-accent" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z" clipRule="evenodd" />
        </svg>
      ),
      color: "text-accent",
    },
    {
      label: t("achievements"),
      value: stats.achievements,
      icon: (
        <svg className="w-5 h-5 text-coral" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path fillRule="evenodd" d="M5.166 2.621v.858c-1.035.148-2.059.33-3.071.543a.75.75 0 00-.584.859 6.753 6.753 0 006.138 5.6 6.73 6.73 0 002.743 1.346A6.707 6.707 0 019.279 15H8.54c-1.036 0-1.875.84-1.875 1.875V19.5h-.75a.75.75 0 000 1.5h12.17a.75.75 0 000-1.5h-.75v-2.625c0-1.036-.84-1.875-1.875-1.875h-.739a6.707 6.707 0 01-1.112-3.173 6.73 6.73 0 002.743-1.347 6.753 6.753 0 006.139-5.6.75.75 0 00-.585-.858 47.077 47.077 0 00-3.07-.543V2.62a.75.75 0 00-.658-.744 49.22 49.22 0 00-6.093-.377c-2.063 0-4.096.128-6.093.377a.75.75 0 00-.657.744z" clipRule="evenodd" />
        </svg>
      ),
      color: "text-coral",
    },
    {
      label: t("memberSince"),
      value: formattedDate,
      icon: (
        <svg className="w-5 h-5 text-secondary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path fillRule="evenodd" d="M6.75 2.25A.75.75 0 017.5 3v1.5h9V3A.75.75 0 0118 3v1.5h.75a3 3 0 013 3v11.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V7.5a3 3 0 013-3H6V3a.75.75 0 01.75-.75z" clipRule="evenodd" />
        </svg>
      ),
      color: "text-secondary",
    },
  ];

  return (
    <div className="space-y-4">
      {/* Rank badge prominent */}
      <div className="flex justify-center">
        <RankBadge caught={rankData.caught} total={rankData.total} size="lg" />
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="rounded-2xl bg-surface dark:bg-surface-alt ring-1 ring-foreground/5 dark:ring-white/5 p-4 text-center space-y-1.5"
          >
            <div className="flex justify-center">{card.icon}</div>
            <div className={`text-2xl font-extrabold ${card.color}`} style={{ fontFamily: "var(--font-fredoka)" }}>
              {card.value}
            </div>
            <div className="text-xs font-medium text-muted">{card.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
