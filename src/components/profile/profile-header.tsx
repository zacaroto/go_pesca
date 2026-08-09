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
    created_at: string;
  };
  isOwner: boolean;
  onEdit: () => void;
};

const TAG_COLORS: Record<string, string> = {
  shore: "bg-primary/15 text-primary",
  kayak: "bg-accent/15 text-accent",
  offshore: "bg-coral/15 text-coral",
  fly: "bg-secondary/15 text-secondary",
  river: "bg-primary-light/15 text-primary-light",
  lake: "bg-primary/15 text-primary",
  spearfishing: "bg-coral/15 text-coral",
};

export function ProfileHeader({ profile, isOwner, onEdit }: Props) {
  const t = useTranslations("profile");

  const letter = profile.display_name?.charAt(0)?.toUpperCase() ?? "?";

  return (
    <div className="overflow-hidden rounded-2xl bg-surface dark:bg-surface-alt ring-1 ring-foreground/5 dark:ring-white/5 shadow-sm">
      {/* Ocean gradient banner */}
      <div className="h-28 bg-gradient-to-br from-primary via-primary-light to-accent relative">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMCAxMDBjNTAgLTMwIDEwMCAzMCAxNTAgMCAyNTAgLTMwIDI1MCAzMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiIHN0cm9rZS13aWR0aD0iMiIvPjwvc3ZnPg==')] opacity-30" />
      </div>

      {/* Avatar overlapping banner */}
      <div className="px-5 -mt-12 relative">
        <div className="flex items-end justify-between">
          <div>
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt=""
                className="w-24 h-24 rounded-full object-cover ring-4 ring-surface dark:ring-surface-alt shadow-lg"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-white text-2xl font-bold ring-4 ring-surface dark:ring-surface-alt shadow-lg">
                {letter}
              </div>
            )}
          </div>
          {isOwner && (
            <button
              onClick={onEdit}
              className="mb-1 px-4 py-2 text-sm font-semibold rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
            >
              {t("editProfile")}
            </button>
          )}
        </div>
      </div>

      {/* Profile info */}
      <div className="px-5 pt-3 pb-5 space-y-3">
        <h1 className="text-xl font-extrabold text-foreground" style={{ fontFamily: "var(--font-fredoka)" }}>
          {profile.display_name ?? "Angler"}
        </h1>

        {profile.bio && (
          <p className="text-sm text-muted leading-relaxed">{profile.bio}</p>
        )}

        {/* Tags */}
        {profile.fishing_tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {profile.fishing_tags.map((tag) => (
              <span
                key={tag}
                className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${TAG_COLORS[tag] ?? "bg-foreground/8 text-muted"}`}
              >
                {t(`tags.${tag}` as Parameters<typeof t>[0])}
              </span>
            ))}
          </div>
        )}

        {/* Region + Social links row */}
        <div className="flex flex-wrap items-center gap-3 text-sm text-muted">
          {profile.home_region && (
            <span className="inline-flex items-center gap-1">
              <svg className="w-4 h-4 text-coral" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path fillRule="evenodd" d="m11.54 22.351.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a16.975 16.975 0 0 0 1.144-.742 19.58 19.58 0 0 0 2.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 0 0-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 0 0 3.834 3.025ZM12 12.75a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" clipRule="evenodd" />
              </svg>
              {t(`regions.${profile.home_region}` as Parameters<typeof t>[0])}
            </span>
          )}

          {profile.social_links?.instagram && (
            <a
              href={`https://instagram.com/${profile.social_links.instagram}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:text-primary transition-colors"
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
              className="inline-flex items-center gap-1 hover:text-primary transition-colors"
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
              className="inline-flex items-center gap-1 hover:text-primary transition-colors"
            >
              <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m9.86-2.54a4.5 4.5 0 0 0-1.242-7.244l-4.5-4.5a4.5 4.5 0 0 0-6.364 6.364L5.25 9.818" />
              </svg>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
