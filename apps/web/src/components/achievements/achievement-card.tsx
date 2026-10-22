"use client";

import { useTranslations } from "next-intl";
import { CheckCircleIcon, LockIcon } from "@/components/icons";

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
      className={`relative bg-surface border border-border rounded-[var(--r-card)] p-4 ${
        earned ? "" : "opacity-80"
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Icon (achievement emoji is content) */}
        <div
          className={`flex items-center justify-center w-14 h-14 rounded-full text-2xl flex-shrink-0 ${
            earned
              ? "bg-accent-soft"
              : "bg-raised border border-dashed border-border text-faint"
          }`}
        >
          {earned ? icon : <LockIcon className="h-6 w-6" />}
        </div>

        <div className="flex-1 min-w-0">
          <p
            className={`font-serif-display text-base font-bold truncate ${
              earned ? "text-text" : "text-muted"
            }`}
          >
            {name}
          </p>
          <p className="text-[13px] text-muted mt-0.5">
            {description}
          </p>

          {earned && awardedAt && (
            <p className="text-[13px] text-accent-ink font-medium mt-2 flex items-center gap-1">
              <CheckCircleIcon className="h-4 w-4" />
              {new Date(awardedAt).toLocaleDateString()}
            </p>
          )}

          {!earned && progress && (
            <div className="mt-2.5">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[13px] text-muted font-medium">{progress}</span>
                <span className="text-[13px] text-muted font-medium">{progressPct}%</span>
              </div>
              <div
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={progressPct}
                aria-label={name}
                className="w-full h-2 bg-raised rounded-full overflow-hidden"
              >
                <div
                  className="h-full bg-accent rounded-full transition-[width] duration-500 ease-[var(--ease-out)] motion-reduce:transition-none"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {earned && (
          <CheckCircleIcon className="h-6 w-6 flex-shrink-0 text-accent" />
        )}
      </div>
    </div>
  );
}
