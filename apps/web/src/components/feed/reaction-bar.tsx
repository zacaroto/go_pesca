"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { toggleReaction } from "@/lib/feed-client";
import type { ReactionCounts } from "@/lib/feed";

const REACTIONS = [
  { type: "fish", emoji: "\ud83d\udc1f" },
  { type: "fire", emoji: "\ud83d\udd25" },
  { type: "trophy", emoji: "\ud83c\udfc6" },
  { type: "wow", emoji: "\ud83d\ude2e" },
  { type: "respect", emoji: "\ud83c\udfa3" },
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
    } catch (err) {
      console.error("Failed to toggle reaction", err);
      setCounts(prevCounts);
      setUserReaction(prevReaction);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {REACTIONS.map(({ type, emoji }) => {
        const count = counts[type as keyof ReactionCounts];
        const isActive = userReaction === type;
        const label = t(type);

        return (
          <button
            key={type}
            type="button"
            onClick={() => handleReaction(type)}
            disabled={loading}
            aria-pressed={isActive}
            aria-label={`${label}${count > 0 ? ` (${count})` : ""}`}
            title={label}
            data-active={isActive}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold tabular-nums cursor-pointer rounded-[var(--r-pill)] bg-[var(--raised)] text-[var(--muted)] transition-[background-color,color,transform] duration-[var(--t-ui)] ease-[var(--ease-out)] motion-reduce:transition-none hover:bg-[var(--border)] hover:text-[var(--text)] active:scale-95 motion-reduce:active:scale-100 data-[active=true]:bg-[var(--accent)] data-[active=true]:text-[var(--on-primary)] data-[active=true]:hover:bg-[var(--accent-hi)] disabled:opacity-60 disabled:cursor-default focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            <span aria-hidden="true" className="text-sm leading-none">{emoji}</span>
            {count > 0 && <span aria-hidden="true">{count}</span>}
          </button>
        );
      })}
    </div>
  );
}
