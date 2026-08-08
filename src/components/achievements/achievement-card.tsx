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

  return (
    <div
      className={`relative rounded-2xl p-4 ring-1 transition-all duration-200 ${
        earned
          ? "bg-white dark:bg-gray-800/50 ring-cyan-200 dark:ring-cyan-800/50 shadow-sm"
          : "bg-gray-50 dark:bg-gray-900/50 ring-gray-200 dark:ring-gray-700/50 opacity-60"
      }`}
    >
      <div className="flex items-start gap-3">
        <span
          className={`text-2xl ${earned ? "" : "grayscale"}`}
        >
          {earned ? icon : "🔒"}
        </span>
        <div className="flex-1 min-w-0">
          <p
            className={`text-sm font-bold truncate ${
              earned
                ? "text-gray-900 dark:text-gray-100"
                : "text-gray-500 dark:text-gray-400"
            }`}
          >
            {name}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            {description}
          </p>
          {earned && awardedAt && (
            <p className="text-[10px] text-cyan-600 dark:text-cyan-400 mt-1.5 font-medium">
              {new Date(awardedAt).toLocaleDateString()}
            </p>
          )}
          {!earned && progress && (
            <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1.5 font-medium">
              {progress}
            </p>
          )}
        </div>
        {earned && (
          <span className="text-cyan-500 dark:text-cyan-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z"
                clipRule="evenodd"
              />
            </svg>
          </span>
        )}
      </div>
    </div>
  );
}
