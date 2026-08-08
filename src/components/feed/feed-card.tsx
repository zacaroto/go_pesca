"use client";

import { ReactionBar } from "./reaction-bar";
import type { FeedCatch, FeedReactions } from "@/lib/feed";

type Props = {
  catch_entry: FeedCatch;
  reactions: FeedReactions;
};

export function FeedCard({ catch_entry, reactions }: Props) {
  const date = new Date(catch_entry.catch_date + "T00:00:00");
  const day = date.getDate();
  const month = date.toLocaleDateString(undefined, { month: "short" });

  return (
    <div className="rounded-2xl bg-surface dark:bg-surface-alt ring-1 ring-foreground/5 dark:ring-white/5 overflow-hidden shadow-sm hover:shadow-ocean transition-shadow duration-300">
      {/* Photo */}
      <div className="relative w-full aspect-[4/3] overflow-hidden bg-foreground/5 dark:bg-white/5">
        <img
          src={catch_entry.photo_url}
          alt=""
          className="w-full h-full object-cover"
          loading="lazy"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/40 to-transparent" />
        {/* Species name on photo */}
        <div className="absolute bottom-3 left-3.5">
          <h3 className="font-extrabold text-base text-white drop-shadow-md" style={{ fontFamily: "var(--font-fredoka)" }}>
            {catch_entry.species_name}
          </h3>
        </div>
      </div>

      {/* Info */}
      <div className="p-3.5 space-y-3">
        {/* Angler + meta row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Avatar placeholder */}
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-white text-xs font-bold">
              {catch_entry.display_name?.charAt(0)?.toUpperCase() ?? "?"}
            </div>
            <span className="text-sm font-bold text-foreground">
              {catch_entry.display_name}
            </span>
          </div>
          <div className="flex items-center gap-2.5 text-xs text-muted font-medium">
            <span className="inline-flex items-center gap-1">
              <svg className="w-3.5 h-3.5 text-accent" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path fillRule="evenodd" d="M6.75 2.25A.75.75 0 0 1 7.5 3v1.5h9V3A.75.75 0 0 1 18 3v1.5h.75a3 3 0 0 1 3 3v11.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V7.5a3 3 0 0 1 3-3H6V3a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
              </svg>
              {day} {month}
            </span>
            {catch_entry.location_name && (
              <span className="inline-flex items-center gap-1 truncate max-w-[120px]">
                <svg className="w-3.5 h-3.5 flex-shrink-0 text-coral" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path fillRule="evenodd" d="m11.54 22.351.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a16.975 16.975 0 0 0 1.144-.742 19.58 19.58 0 0 0 2.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 0 0-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 0 0 3.834 3.025ZM12 12.75a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" clipRule="evenodd" />
                </svg>
                {catch_entry.location_name}
              </span>
            )}
          </div>
        </div>

        {/* Reactions */}
        <ReactionBar
          catchId={catch_entry.id}
          counts={reactions.counts}
          userReaction={reactions.userReaction}
        />
      </div>
    </div>
  );
}
