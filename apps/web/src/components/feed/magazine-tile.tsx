"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ReactionBar } from "./reaction-bar";
import { relativeDate } from "@/lib/community-mosaic";
import type { FeedCatch, FeedReactions } from "@/lib/feed";

type Props = {
  entry: FeedCatch;
  reactions: FeedReactions;
  featured?: boolean;
};

export function MagazineTile({ entry, reactions, featured = false }: Props) {
  const t = useTranslations("feed");
  const locale = useLocale();
  const meta = [entry.display_name, entry.location_name, relativeDate(entry.catch_date, new Date(), locale, t)]
    .filter(Boolean)
    .join(" · ");

  return (
    <article
      className={`flex flex-col overflow-hidden rounded-[var(--r-card)] bg-[var(--surface)] ${
        featured ? "col-span-2 row-span-2" : ""
      }`}
    >
      <Link
        href={`/profile/${entry.user_id}` as "/profile/[userId]"}
        className="group flex flex-col flex-1 min-h-0 transition-colors duration-[var(--t-ui)] ease-[var(--ease-out)] motion-reduce:transition-none hover:bg-[var(--raised)] active:bg-[var(--raised)] focus-visible:outline-2 focus-visible:outline-offset-[-2px]"
      >
        <div className="flex-1 min-h-0 overflow-hidden bg-[var(--raised)]">
          {/* eslint-disable-next-line @next/next/no-img-element -- remote user photo */}
          <img
            src={entry.photo_url}
            alt=""
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 ease-[var(--ease-out)] group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
        </div>
        <div className="px-[14px] pt-[10px] pb-[12px]">
          <span
            className={`font-serif-display block truncate text-[var(--text)] ${
              featured ? "text-[34px] font-black" : "text-[18px] font-bold"
            }`}
          >
            {entry.species_name}
          </span>
          <span className="block truncate text-xs text-[var(--muted)]">{meta}</span>
        </div>
      </Link>
      {featured && (
        <div className="px-[14px] pb-[12px]">
          <ReactionBar catchId={entry.id} counts={reactions.counts} userReaction={reactions.userReaction} />
        </div>
      )}
    </article>
  );
}
