"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import type { NewAchievement } from "@/lib/achievements";
import { AchievementIcon } from "./achievement-icon";

type Props = {
  achievement: NewAchievement;
  onDismiss: () => void;
};

export function AchievementToast({ achievement, onDismiss }: Props) {
  const t = useTranslations("achievements");
  const tCommon = useTranslations("common");
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
      className={`fixed z-50 left-1/2 -translate-x-1/2 bottom-24 sm:bottom-auto sm:top-20 sm:right-6 sm:left-auto sm:translate-x-0 transition-[opacity,transform] duration-300 ease-[var(--ease-out)] motion-reduce:transition-none ${
        visible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-4 sm:-translate-y-4"
      }`}
    >
      <div className="flex items-center gap-3 bg-surface border border-border rounded-[var(--r-card)] shadow-xl px-5 py-4 min-w-[280px] max-w-[340px]">
        {/* Animated icon */}
        <span className="grid h-11 w-11 shrink-0 -rotate-6 place-items-center rounded-full border-2 border-accent text-accent motion-safe:animate-[badge-pop_400ms_var(--ease-spring)]">
          <AchievementIcon id={achievement.achievement_id} className="h-5 w-5" />
        </span>

        <div className="flex-1 min-w-0">
          <p className="text-label font-semibold text-accent-ink">
            {t("unlocked")}
          </p>
          <p className="font-serif-display text-body font-bold text-text truncate">
            {name}
          </p>
          <p className="text-label text-muted truncate">
            {description}
          </p>
        </div>

        {/* Dismiss button */}
        <button
          onClick={() => {
            setVisible(false);
            setTimeout(onDismiss, 300);
          }}
          aria-label={tCommon("close")}
          className="p-1 rounded-[var(--r-control)] text-faint hover:text-text active:text-text transition-colors duration-[var(--t-press)] motion-reduce:transition-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            aria-hidden="true"
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
