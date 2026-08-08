"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { toggleReaction } from "@/lib/feed-client";
import type { ReactionCounts } from "@/lib/feed";

const REACTIONS = [
  { type: "fish", emoji: "\ud83d\udc1f", activeColor: "bg-primary/15 ring-primary/40 text-primary dark:text-primary-light" },
  { type: "fire", emoji: "\ud83d\udd25", activeColor: "bg-coral/15 ring-coral/40 text-coral" },
  { type: "trophy", emoji: "\ud83c\udfc6", activeColor: "bg-accent/15 ring-accent/40 text-accent" },
  { type: "wow", emoji: "\ud83d\ude2e", activeColor: "bg-purple-500/15 ring-purple-500/40 text-purple-600 dark:text-purple-400" },
  { type: "respect", emoji: "\ud83c\udfa3", activeColor: "bg-secondary/15 ring-secondary/40 text-secondary" },
] as const;

type Props = {
  catchId: string;
  counts: ReactionCounts;
  userReaction: string | null;
};

export function ReactionBar({ catchId, counts: initialCounts, userReaction: initialReaction }: Props) {
  const t = useTranslations("feed.reactions");
  const [counts, setCounts] = useState(initialCounts);
  const [userReaction, setUserReaction] = useState(initialReaction);
  const [loading, setLoading] = useState(false);

  async function handleReaction(reactionType: string) {
    if (loading) return;

    const prevCounts = { ...counts };
    const prevReaction = userReaction;

    const newCounts = { ...counts };

    if (userReaction === reactionType) {
      newCounts[reactionType as keyof ReactionCounts]--;
      setUserReaction(null);
    } else {
      if (userReaction) {
        newCounts[userReaction as keyof ReactionCounts]--;
      }
      newCounts[reactionType as keyof ReactionCounts]++;
      setUserReaction(reactionType);
    }
    setCounts(newCounts);

    setLoading(true);
    try {
      await toggleReaction(catchId, reactionType);
    } catch {
      setCounts(prevCounts);
      setUserReaction(prevReaction);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-1.5">
      {REACTIONS.map(({ type, emoji, activeColor }) => {
        const count = counts[type as keyof ReactionCounts];
        const isActive = userReaction === type;

        return (
          <button
            key={type}
            onClick={() => handleReaction(type)}
            disabled={loading}
            title={t(type as "fish" | "fire" | "trophy" | "wow" | "respect")}
            className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 ${
              isActive
                ? `${activeColor} ring-1 scale-105`
                : "bg-foreground/5 dark:bg-white/5 hover:bg-foreground/10 dark:hover:bg-white/10 text-muted"
            } ${loading ? "opacity-50" : "active:scale-90"}`}
          >
            <span className={`text-sm transition-transform duration-200 ${isActive ? "scale-110" : ""}`}>{emoji}</span>
            {count > 0 && (
              <span>{count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
