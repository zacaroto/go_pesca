"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import type { NewAchievement } from "@/lib/achievements";

type Props = {
  achievement: NewAchievement;
  onDismiss: () => void;
};

export function AchievementToast({ achievement, onDismiss }: Props) {
  const t = useTranslations("achievements");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Slide in
    const showTimer = setTimeout(() => setVisible(true), 50);

    // Auto-dismiss after 4 seconds
    const dismissTimer = setTimeout(() => {
      setVisible(false);
      setTimeout(onDismiss, 300); // wait for slide-out animation
    }, 4000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(dismissTimer);
    };
  }, [achievement.id, onDismiss]);

  const name = t(`items.${achievement.achievement_id}.name`);
  const description = t(`items.${achievement.achievement_id}.description`);

  return (
    <div
      className={`fixed z-50 left-1/2 -translate-x-1/2 bottom-24 sm:bottom-auto sm:top-20 sm:right-6 sm:left-auto sm:translate-x-0 transition-all duration-300 ${
        visible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-4 sm:-translate-y-4"
      }`}
    >
      <div className="flex items-center gap-3 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl shadow-cyan-600/20 ring-1 ring-gray-100 dark:ring-gray-700/50 px-5 py-4 min-w-[280px] max-w-[340px]">
        {/* Animated icon */}
        <span className="text-3xl animate-bounce">{achievement.icon}</span>

        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 uppercase tracking-wide">
            {t("unlocked")}
          </p>
          <p className="text-sm font-bold text-gray-900 dark:text-gray-100 truncate">
            {name}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
            {description}
          </p>
        </div>

        {/* Dismiss button */}
        <button
          onClick={() => {
            setVisible(false);
            setTimeout(onDismiss, 300);
          }}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-4 h-4"
          >
            <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
