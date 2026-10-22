"use client";

import { useTranslations } from "next-intl";
import { CalendarIcon, EditIcon, LinkIcon, PinIcon } from "@/components/icons";

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
  shore: "pill-salt",
  kayak: "pill-fresh",
  offshore: "pill-brack",
  fly: "pill-fresh",
  river: "pill-fresh",
  lake: "pill-salt",
  spearfishing: "pill-brack",
};

const socialLink =
  "w-10 h-10 rounded-full bg-raised flex items-center justify-center border border-border text-muted hover:text-text hover:border-faint active:bg-border transition-colors duration-[var(--t-press)] motion-reduce:transition-none";

export function ProfileHeader({ profile, isOwner, onEdit }: Props) {
  const t = useTranslations("profile");

  const letter = profile.display_name?.charAt(0)?.toUpperCase() ?? "?";
  const joinYear = new Date(profile.created_at).getFullYear();

  return (
    <section className="flex flex-col gap-4 rounded-[var(--r-card)] bg-surface p-6">
      <div className="h-28 w-28 overflow-hidden rounded-full bg-raised">
        {profile.avatar_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={profile.avatar_url} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-accent-soft font-serif-display text-title font-black text-accent-ink">
            {letter}
          </div>
        )}
      </div>

      <div>
        <h1 className="font-serif-display text-heading font-bold text-text break-words">
          {profile.display_name ?? "Angler"}
        </h1>
        <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-small text-muted">
          <span className="inline-flex items-center gap-1">
            <CalendarIcon className="h-4 w-4" />
            {t("memberSince")} {joinYear}
          </span>
          {profile.home_region && (
            <span className="inline-flex items-center gap-1">
              <PinIcon className="h-4 w-4" />
              {t(`regions.${profile.home_region}` as Parameters<typeof t>[0])}
            </span>
          )}
        </p>
      </div>

      {profile.bio && <p className="m-0 text-body text-text">{profile.bio}</p>}

      {profile.fishing_tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {profile.fishing_tags.map((tag) => (
            <span
              key={tag}
              className={`text-label font-medium px-2.5 py-1 rounded-[var(--r-pill)] ${TAG_COLORS[tag] ?? "bg-raised text-muted"}`}
            >
              {t(`tags.${tag}` as Parameters<typeof t>[0])}
            </span>
          ))}
        </div>
      )}

      {profile.favorite_spots?.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {profile.favorite_spots.map((spot) => (
            <span
              key={spot}
              className="inline-flex items-center gap-1 text-label font-medium px-3 py-1 rounded-[var(--r-pill)] bg-raised text-muted"
            >
              <PinIcon className="h-3.5 w-3.5" />
              {spot}
            </span>
          ))}
        </div>
      )}

        {/* Social links */}
        {(profile.social_links?.instagram || profile.social_links?.youtube || profile.social_links?.other) && (
          <div className="flex items-center gap-2">
            {profile.social_links?.instagram && (
              <a
                href={`https://instagram.com/${profile.social_links.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className={socialLink}
                aria-label="Instagram"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            )}
            {profile.social_links?.youtube && (
              <a
                href={profile.social_links.youtube.startsWith("http") ? profile.social_links.youtube : `https://youtube.com/@${profile.social_links.youtube}`}
                target="_blank"
                rel="noopener noreferrer"
                className={socialLink}
                aria-label="YouTube"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            )}
            {profile.social_links?.other && (
              <a
                href={profile.social_links.other.startsWith("http") ? profile.social_links.other : `https://${profile.social_links.other}`}
                target="_blank"
                rel="noopener noreferrer"
                className={socialLink}
                aria-label={t("websiteLink")}
              >
                <LinkIcon className="h-5 w-5" />
              </a>
            )}
          </div>
        )}

      {isOwner && (
        <button
          type="button"
          onClick={onEdit}
          className="inline-flex items-center justify-center gap-2 rounded-[var(--r-control)] bg-raised px-4 py-2.5 text-small font-semibold text-text hover:bg-border active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 transition-[background-color,transform] duration-[var(--t-press)] motion-reduce:transition-none motion-reduce:active:scale-100"
        >
          <EditIcon className="h-4 w-4" />
          {t("editProfile")}
        </button>
      )}
    </section>
  );
}
