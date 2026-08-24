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
      className={`relative bg-card-bg rounded-xl chunky-border p-4 chunky-shadow transition-all duration-300 hover:-translate-y-1 ${
        earned ? "" : "opacity-70 grayscale hover:grayscale-0 hover:opacity-100"
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div
          className={`flex items-center justify-center w-14 h-14 rounded-full text-2xl flex-shrink-0 sticker-border ${
            earned
              ? "bg-sunny-yellow"
              : "bg-surface-container border-dashed"
          }`}
        >
          {earned ? icon : "🔒"}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p
            className={`text-label-lg font-bold truncate ${
              earned ? "text-on-surface" : "text-muted"
            }`}
            style={{ fontFamily: "var(--font-fredoka)" }}
          >
            {name}
          </p>
          <p className="text-label-sm text-muted mt-0.5">
            {description}
          </p>

          {/* Earned date */}
          {earned && awardedAt && (
            <p className="text-label-sm text-secondary font-bold mt-2 flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">check_circle</span>
              {new Date(awardedAt).toLocaleDateString()}
            </p>
          )}

          {/* Progress bar for unearned */}
          {!earned && progress && (
            <div className="mt-2.5">
              <div className="flex items-center justify-between mb-1">
                <span className="text-label-sm text-muted font-bold">{progress}</span>
                <span className="text-label-sm text-muted font-bold">{progressPct}%</span>
              </div>
              <div className="w-full h-3 bg-surface-container rounded-full overflow-hidden chunky-border">
                <div
                  className="h-full bg-gradient-to-r from-primary to-primary-light rounded-full transition-all duration-500 liquid-tube"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Check mark for earned */}
        {earned && (
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary flex items-center justify-center sticker-border">
            <span className="material-symbols-outlined text-on-secondary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
              check
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
