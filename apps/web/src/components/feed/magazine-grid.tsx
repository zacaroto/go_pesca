"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { MagazineTile } from "./magazine-tile";
import { fetchMoreFeedCatches, fetchMoreReactions } from "@/lib/feed-client";
import { fetchMoreAllGroupsFeedCatches } from "@/lib/group-feed-client";
import { computeRecords, pickFeatured } from "@/lib/community-mosaic";
import type { FeedCatch, FeedReactions } from "@/lib/feed";

const PAGE_SIZE = 20;
const NO_REACTIONS: FeedReactions = {
  counts: { fish: 0, fire: 0, trophy: 0, wow: 0, respect: 0 },
  userReaction: null,
};

const feedTypeFetchers = {
  global: fetchMoreFeedCatches,
  allGroups: fetchMoreAllGroupsFeedCatches,
};

type GridProps = {
  initialCatches: FeedCatch[];
  initialReactions: Record<string, FeedReactions>;
  locale: string;
  feedType: "global" | "allGroups";
  emptyMessage?: string;
};

export function MagazineGrid({ initialCatches, initialReactions, locale, feedType, emptyMessage }: GridProps) {
  const t = useTranslations("feed");
  const [catches, setCatches] = useState(initialCatches);
  const [reactions, setReactions] = useState(initialReactions);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialCatches.length >= PAGE_SIZE);
  const [loadError, setLoadError] = useState(false);

  async function loadMore() {
    if (loading || !hasMore) return;
    const lastCatch = catches[catches.length - 1];
    if (!lastCatch) return;

    setLoading(true);
    setLoadError(false);
    try {
      const moreCatches = await feedTypeFetchers[feedType](locale, lastCatch.created_at);
      if (moreCatches.length < PAGE_SIZE) setHasMore(false);
      if (moreCatches.length > 0) {
        const moreReactions = await fetchMoreReactions(moreCatches.map((c) => c.id));
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
      <div className="py-20 text-center">
        <p className="font-serif-display text-2xl font-bold text-[var(--text)]">{emptyMessage ?? t("empty")}</p>
      </div>
    );
  }

  const now = new Date();
  const { featured, rest } = pickFeatured(catches, reactions, now);
  const records = computeRecords(catches, now);

  return (
    <div>
      <div className="grid grid-cols-2 lg:grid-cols-4 auto-rows-[220px] gap-4">
        {featured && (
          <MagazineTile key={featured.id} entry={featured} reactions={reactions[featured.id] ?? NO_REACTIONS} featured />
        )}
        {rest.map((c) => (
          <MagazineTile key={c.id} entry={c} reactions={reactions[c.id] ?? NO_REACTIONS} />
        ))}
      </div>

      {hasMore && (
        <div className="mt-6 flex flex-col items-center gap-2">
          <button
            type="button"
            onClick={loadMore}
            disabled={loading}
            className="px-6 py-2.5 rounded-[var(--r-pill)] text-sm font-semibold text-[var(--text)] bg-[var(--raised)] cursor-pointer transition-[background-color,transform] duration-[var(--t-ui)] ease-[var(--ease-out)] motion-reduce:transition-none hover:bg-[var(--border)] active:scale-[0.97] motion-reduce:active:scale-100 disabled:opacity-60 disabled:cursor-default focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            {loading ? t("loading") : t("loadMore")}
          </button>
          {loadError && (
            <p role="alert" className="text-[13px] text-[var(--negative)]">
              {t("loadError")}
            </p>
          )}
        </div>
      )}

      <div className="grid sm:grid-cols-3 gap-4 mt-10">
        <Record
          label={t("recordHeaviest")}
          value={records.heaviest?.weight_kg != null ? `${records.heaviest.weight_kg.toFixed(1)} kg` : "—"}
          detail={records.heaviest ? `${records.heaviest.species_name} · ${records.heaviest.location_name ?? "—"}` : undefined}
        />
        <Record
          label={t("recordTopSpecies")}
          value={records.topSpecies ? `${records.topSpecies.name} · ${records.topSpecies.count}` : "—"}
        />
        <Record label={t("recordWeek")} value={String(records.weekCount)} />
      </div>
    </div>
  );
}

function Record({ label, value, detail }: { label: string; value: string; detail?: string }) {
  return (
    <div className="rounded-[var(--r-card)] bg-[var(--surface)] px-5 py-[18px]">
      <span className="block text-[13px] text-[var(--muted)]">{label}</span>
      <b className="block text-[30px] font-semibold tracking-tight tabular-nums text-[var(--text)] [overflow-wrap:anywhere]">
        {value}
      </b>
      {detail && <span className="block text-[13px] text-[var(--muted)]">{detail}</span>}
    </div>
  );
}

type TabsProps = {
  catches: FeedCatch[];
  groupFeedCatches: FeedCatch[];
  reactions: Record<string, FeedReactions>;
  locale: string;
  hasGroups: boolean;
};

export function CommunityTabs({ catches, groupFeedCatches, reactions, locale, hasGroups }: TabsProps) {
  const t = useTranslations("feed");
  const [tab, setTab] = useState<"all" | "groups">("all");
  const active = hasGroups ? tab : "all";

  const chip = (id: "all" | "groups", label: string) => (
    <button
      key={id}
      type="button"
      onClick={() => setTab(id)}
      aria-pressed={active === id}
      data-active={active === id}
      className="px-4 py-1.5 text-sm font-medium cursor-pointer rounded-[var(--r-pill)] bg-[var(--raised)] text-[var(--text)] transition-[background-color,color,transform] duration-[var(--t-ui)] ease-[var(--ease-out)] motion-reduce:transition-none hover:bg-[var(--border)] active:scale-[0.97] motion-reduce:active:scale-100 data-[active=true]:bg-[var(--accent)] data-[active=true]:text-[var(--on-primary)] data-[active=true]:hover:bg-[var(--accent-hi)] focus-visible:outline-2 focus-visible:outline-offset-2"
    >
      {label}
    </button>
  );

  return (
    <div>
      {hasGroups && (
        <div role="group" aria-label={t("feedTabs")} className="flex gap-2 mb-6">
          {chip("all", t("tabAll"))}
          {chip("groups", t("tabGroups"))}
        </div>
      )}
      <div hidden={active !== "all"}>
        <MagazineGrid feedType="global" initialCatches={catches} initialReactions={reactions} locale={locale} />
      </div>
      {hasGroups && (
        <div hidden={active !== "groups"}>
          <MagazineGrid
            feedType="allGroups"
            initialCatches={groupFeedCatches}
            initialReactions={reactions}
            locale={locale}
            emptyMessage={t("noGroupActivity")}
          />
        </div>
      )}
    </div>
  );
}
