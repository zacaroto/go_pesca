"use client";

import { createContext, useContext, useState, useCallback } from "react";
import type { NewAchievement } from "@/lib/achievements";
import { AchievementToast } from "./achievement-toast";

type AchievementContextType = {
  showAchievements: (achievements: NewAchievement[]) => void;
};

const AchievementContext = createContext<AchievementContextType>({
  showAchievements: () => {},
});

export function useAchievements() {
  return useContext(AchievementContext);
}

export function AchievementProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queue, setQueue] = useState<NewAchievement[]>([]);

  const showAchievements = useCallback((achievements: NewAchievement[]) => {
    setQueue((prev) => [...prev, ...achievements]);
  }, []);

  const dismissFirst = useCallback(() => {
    setQueue((prev) => prev.slice(1));
  }, []);

  return (
    <AchievementContext.Provider value={{ showAchievements }}>
      {children}
      {queue.length > 0 && (
        <AchievementToast achievement={queue[0]} onDismiss={dismissFirst} />
      )}
    </AchievementContext.Provider>
  );
}
