"use client";

import { useTranslations } from "next-intl";

type Props = {
  profile: {
    display_name: string | null;
    avatar_url: string | null;
    bio: string | null;
    fishing_tags: string[];
    home_region: string | null;
    social_links: Record<string, string>;
    favorite_spots: string[];
    created_at: string;
  };
  isOwner: boolean;
  onEdit: () => void;
};

const TAG_COLORS: Record<string, string> = {
  shore: "bg-primary/12 text-primary border-primary/20",
  kayak: "bg-accent/12 text-accent border-accent/20",
  offshore: "bg-coral/12 text-coral border-coral/20",
  fly: "bg-secondary/12 text-secondary border-secondary/20",
  river: "bg-primary-light/12 text-primary-light border-primary-light/20",
  lake: "bg-primary/12 text-primary border-primary/20",
  spearfishing: "bg-coral/12 text-coral border-coral/20",
};

export function ProfileHeader({ profile, isOwner, onEdit }: Props) {
  const t = useTranslations("profile");

  const letter = profile.display_name?.charAt(0)?.toUpperCase() ?? "?";

  return (
    <div className="overflow-hidden rounded-2xl bg-surface dark:bg-surface-alt ring-1 ring-foreground/5 dark:ring-white/5 shadow-sm">
      {/* Compact gradient banner */}
      <div className="h-20 bg-gradient-to-r from-primary via-primary-light to-accent relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 400 80">
            <path d="M0 60 C100 30, 200 70, 400 40 L400 80 L0 80Z" fill="rgba(255,255,255,0.15)" />
            <path d="M0 70 C150 50, 250 80, 400 55 L400 80 L0 80Z" fill="rgba(255,255,255,0.1)" />
          </svg>
        </div>
      </div>

      {/* Avatar + name row */}
      <div className="px-4 -mt-10 relative">
        <div className="flex items-end gap-3">
          {/* Avatar */}
          {profile.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt=""
              className="w-20 h-20 rounded-2xl object-cover ring-[3px] ring-surface dark:ring-surface-alt shadow-md flex-shrink-0"
            />
          ) : (
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-white text-xl font-bold ring-[3px] ring-surface dark:ring-surface-alt shadow-md flex-shrink-0">
              {letter}
            </div>
          )}

          {/* Name + region inline */}
          <div className="flex-1 min-w-0 pb-1">
            <h1 className="text-lg font-extrabold text-foreground truncate" style={{ fontFamily: "var(--font-fredoka)" }}>
              {profile.display_name ?? "Angler"}
            </h1>
            {profile.home_region && (
              <span className="inline-flex items-center gap-1 text-xs text-muted mt-0.5">
                <svg className="w-3 h-3 text-coral flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path fillRule="evenodd" d="m11.54 22.351.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a16.975 16.975 0 0 0 1.144-.742 19.58 19.58 0 0 0 2.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 0 0-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 0 0 3.834 3.025ZM12 12.75a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" clipRule="evenodd" />
                </svg>
                {t(`regions.${profile.home_region}` as Parameters<typeof t>[0])}
              </span>
            )}
          </div>

          {/* Edit button */}
          {isOwner && (
            <button
              onClick={onEdit}
              className="flex-shrink-0 mb-1 p-2 rounded-xl bg-foreground/5 hover:bg-foreground/10 text-muted hover:text-foreground transition-colors"
              aria-label={t("editProfile")}
            >
              <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Profile details */}
      <div className="px-4 pt-3 pb-4 space-y-3">
        {/* Bio */}
        {profile.bio && (
          <p className="text-sm text-muted leading-relaxed">{profile.bio}</p>
        )}

        {/* Fishing tags */}
        {profile.fishing_tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {profile.fishing_tags.map((tag) => (
              <span
                key={tag}
                className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border ${TAG_COLORS[tag] ?? "bg-foreground/5 text-muted border-foreground/10"}`}
              >
                {t(`tags.${tag}` as Parameters<typeof t>[0])}
              </span>
            ))}
          </div>
        )}

        {/* Favorite spots */}
        {profile.favorite_spots?.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {profile.favorite_spots.map((spot) => (
              <span
                key={spot}
                className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md bg-accent/10 text-accent border border-accent/15"
              >
                <svg className="w-2.5 h-2.5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path fillRule="evenodd" d="m11.54 22.351.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a16.975 16.975 0 0 0 1.144-.742 19.58 19.58 0 0 0 2.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 0 0-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 0 0 3.834 3.025ZM12 12.75a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" clipRule="evenodd" />
                </svg>
                {spot}
              </span>
            ))}
          </div>
        )}

        {/* Social links */}
        {(profile.social_links?.instagram || profile.social_links?.youtube || profile.social_links?.other) && (
          <div className="flex items-center gap-2 pt-1">
            {profile.social_links?.instagram && (
              <a
                href={`https://instagram.com/${profile.social_links.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-foreground/5 hover:bg-foreground/10 flex items-center justify-center text-muted hover:text-foreground transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            )}
            {profile.social_links?.youtube && (
              <a
                href={profile.social_links.youtube.startsWith("http") ? profile.social_links.youtube : `https://youtube.com/@${profile.social_links.youtube}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-foreground/5 hover:bg-foreground/10 flex items-center justify-center text-muted hover:text-foreground transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            )}
            {profile.social_links?.other && (
              <a
                href={profile.social_links.other.startsWith("http") ? profile.social_links.other : `https://${profile.social_links.other}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-foreground/5 hover:bg-foreground/10 flex items-center justify-center text-muted hover:text-foreground transition-colors"
              >
                <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m9.86-2.54a4.5 4.5 0 0 0-1.242-7.244l-4.5-4.5a4.5 4.5 0 0 0-6.364 6.364L5.25 9.818" />
                </svg>
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
