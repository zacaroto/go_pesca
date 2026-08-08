"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { FeedCard } from "./feed-card";
import { fetchMoreFeedCatches, fetchMoreReactions } from "@/lib/feed-client";
import type { FeedCatch, FeedReactions } from "@/lib/feed";

type Props = {
  initialCatches: FeedCatch[];
  initialReactions: Record<string, FeedReactions>;
  locale: string;
};

export function FeedList({ initialCatches, initialReactions, locale }: Props) {
  const t = useTranslations("feed");
  const [catches, setCatches] = useState(initialCatches);
  const [reactions, setReactions] = useState(initialReactions);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialCatches.length >= 20);

  async function loadMore() {
    if (loading || !hasMore) return;

    const lastCatch = catches[catches.length - 1];
    if (!lastCatch) return;

    setLoading(true);
    try {
      const moreCatches = await fetchMoreFeedCatches(locale, lastCatch.created_at);

      if (moreCatches.length < 20) {
        setHasMore(false);
      }

      if (moreCatches.length > 0) {
        const moreReactions = await fetchMoreReactions(
          moreCatches.map((c) => c.id)
        );

        setCatches((prev) => [...prev, ...moreCatches]);
        setReactions((prev) => ({ ...prev, ...moreReactions }));
      }
    } catch {
      // Silently fail — user can retry
    } finally {
      setLoading(false);
    }
  }

  if (catches.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-primary/10 mb-4">
          <span className="text-4xl">🎣</span>
        </div>
        <p className="text-muted text-sm font-medium">
          {t("empty")}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {catches.map((c) => (
        <FeedCard
          key={c.id}
          catch_entry={c}
          reactions={reactions[c.id] ?? { counts: { fish: 0, fire: 0, trophy: 0, wow: 0, respect: 0 }, userReaction: null }}
        />
      ))}

      {hasMore && (
        <button
          onClick={loadMore}
          disabled={loading}
          className="w-full py-3.5 rounded-2xl text-sm font-bold text-primary bg-primary/10 hover:bg-primary/15 disabled:opacity-50 active:scale-[0.98] transition-all duration-200"
        >
          {loading ? t("loading") : t("loadMore")}
        </button>
      )}
    </div>
  );
}
