"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ReactionBar } from "./reaction-bar";
import { relativeDate } from "@/lib/community-mosaic";
import type { FeedCatch, FeedReactions } from "@/lib/feed";

type Props = {
  catch_entry: FeedCatch;
  reactions: FeedReactions;
  index?: number;
};

export function FeedCard({ catch_entry, reactions, index = 0 }: Props) {
  const t = useTranslations("feed");
  const locale = useLocale();
  const delay = `${index * 60}ms`;
  const meta = [
    catch_entry.location_name,
    relativeDate(catch_entry.catch_date, new Date(), locale, t),
  ].filter(Boolean);

  return (
    <article
      className="bg-[var(--surface)] rounded-[var(--r-card)] overflow-hidden mb-[var(--gap)] opacity-0 animate-[card-in_var(--t-enter)_var(--ease-out)_forwards] motion-reduce:opacity-100 motion-reduce:animate-none"
      style={{ animationDelay: delay }}
    >
      <div className="w-full h-[200px] bg-[var(--raised)]">
        <img src={catch_entry.photo_url} alt="" className="w-full h-full object-cover" loading="lazy" />
      </div>

      <div className="px-4 pt-3">
        <h3 className="font-serif-display text-[22px] font-black leading-tight text-[var(--text)] m-0">
          {catch_entry.species_name}
          {catch_entry.weight_kg !== null && (
            <span className="ml-2 font-sans text-base font-semibold tabular-nums text-[var(--muted)]">
              {catch_entry.weight_kg} kg
            </span>
          )}
        </h3>
        <p className="mt-1 text-xs text-[var(--muted)] [overflow-wrap:anywhere]">{meta.join(" · ")}</p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3">
        <Link
          href={`/profile/${catch_entry.user_id}` as "/profile/[userId]"}
          className="flex items-center gap-2 min-w-0 rounded-[var(--r-control)] transition-opacity duration-[var(--t-ui)] hover:opacity-80 active:opacity-60 motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          <span className="w-7 h-7 rounded-full bg-[var(--raised)] overflow-hidden shrink-0 flex items-center justify-center">
            {catch_entry.avatar_url ? (
              <img src={catch_entry.avatar_url} alt="" className="w-full h-full object-cover" />
            ) : (
              <span aria-hidden="true" className="text-[11px] font-semibold text-[var(--accent-ink)]">
                {catch_entry.display_name?.charAt(0)?.toUpperCase() ?? "?"}
              </span>
            )}
          </span>
          <span className="text-[13px] font-medium text-[var(--muted)] truncate [overflow-wrap:anywhere]">
            {catch_entry.display_name}
          </span>
        </Link>

        <ReactionBar catchId={catch_entry.id} counts={reactions.counts} userReaction={reactions.userReaction} />
      </div>
    </article>
  );
}
