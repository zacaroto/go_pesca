"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { FeedCard } from "./feed-card";
import { fetchMoreFeedCatches, fetchMoreReactions } from "@/lib/feed-client";
import { fetchMoreAllGroupsFeedCatches } from "@/lib/group-feed-client";
import type { FeedCatch, FeedReactions } from "@/lib/feed";

type Props = {
  initialCatches: FeedCatch[];
  initialReactions: Record<string, FeedReactions>;
  locale: string;
  fetchMoreFn?: (locale: string, cursor: string) => Promise<FeedCatch[]>;
  feedType?: "global" | "allGroups";
  emptyMessage?: string;
};

const feedTypeFetchers = {
  global: fetchMoreFeedCatches,
  allGroups: fetchMoreAllGroupsFeedCatches,
};

export function FeedList({ initialCatches, initialReactions, locale, fetchMoreFn, feedType, emptyMessage }: Props) {
  const t = useTranslations("feed");
  const [catches, setCatches] = useState(initialCatches);
  const [reactions, setReactions] = useState(initialReactions);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [hasMore, setHasMore] = useState(initialCatches.length >= 20);

  async function loadMore() {
    if (loading || !hasMore) return;

    const lastCatch = catches[catches.length - 1];
    if (!lastCatch) return;

    setLoading(true);
    setLoadError(false);
    try {
      const fetcher = fetchMoreFn ?? (feedType ? feedTypeFetchers[feedType] : fetchMoreFeedCatches);
      const moreCatches = await fetcher(locale, lastCatch.created_at);

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
    } catch (err) {
      console.error("Failed to load more catches", err);
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  }

  if (catches.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-[var(--muted)] text-sm">{emptyMessage ?? t("empty")}</p>
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
          className="w-full py-3 rounded-[var(--r-pill)] text-sm font-semibold text-[var(--text)] bg-[var(--raised)] hover:bg-[var(--border)] disabled:opacity-60 active:scale-[0.98] motion-reduce:active:scale-100 transition-[background-color,transform] duration-[var(--t-ui)] ease-[var(--ease-out)] motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          {loading ? t("loading") : t("loadMore")}
        </button>
      )}
      {loadError && (
        <p role="alert" className="text-center text-[13px] text-[var(--negative)]">
          {t("loadError")}
        </p>
      )}
    </div>
  );
}
