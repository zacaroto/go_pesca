"use client";

import { useTranslations } from "next-intl";

type Props = {
  achievementId: string;
  icon: string;
  earned: boolean;
  awardedAt?: string;
  progress?: string;
};

export function AchievementCard({
  achievementId,
  icon,
  earned,
  awardedAt,
  progress,
}: Props) {
  const t = useTranslations("achievements");

  const name = t(`items.${achievementId}.name`);
  const description = t(`items.${achievementId}.description`);

  // Parse progress for progress bar (e.g. "3/10")
  const progressParts = progress?.split("/");
  const progressPct = progressParts
    ? Math.min(100, Math.round((parseInt(progressParts[0]) / parseInt(progressParts[1])) * 100))
    : 0;

  return (
    <div
      className={`relative rounded-2xl p-4 transition-all duration-300 ${
        earned
          ? "bg-gradient-to-br from-accent-light/15 via-surface to-secondary/10 dark:from-accent-light/10 dark:via-surface-alt dark:to-secondary/5 ring-2 ring-accent-light/40 shadow-accent"
          : "bg-surface dark:bg-surface-alt ring-1 ring-foreground/8 dark:ring-white/8"
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className={`flex items-center justify-center w-11 h-11 rounded-xl text-2xl flex-shrink-0 ${
          earned
            ? "bg-accent-light/20 dark:bg-accent-light/10"
            : "bg-foreground/5 dark:bg-white/5"
        }`}>
          {earned ? icon : "🔒"}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-extrabold truncate ${
            earned ? "text-foreground" : "text-muted"
          }`}>
            {name}
          </p>
          <p className="text-xs text-muted mt-0.5">
            {description}
          </p>

          {/* Earned date */}
          {earned && awardedAt && (
            <p className="text-[10px] text-accent font-bold mt-2">
              {new Date(awardedAt).toLocaleDateString()}
            </p>
          )}

          {/* Progress bar for unearned */}
          {!earned && progress && (
            <div className="mt-2.5">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] text-muted font-bold">{progress}</span>
                <span className="text-[10px] text-muted font-bold">{progressPct}%</span>
              </div>
              <div className="w-full h-1.5 bg-foreground/8 dark:bg-white/8 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-primary-light rounded-full transition-all duration-500"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Check mark for earned */}
        {earned && (
          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-secondary flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="white" className="w-3.5 h-3.5">
              <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
}
