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
    <section className="flex flex-col items-center text-center space-y-4 pt-4">
      {/* Avatar with rank badge */}
      <div className="relative">
        <div className="w-40 h-40 rounded-full border border-border overflow-hidden bg-raised mx-auto relative z-10">
          {profile.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt=""
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-accent-soft text-accent-ink flex items-center justify-center text-5xl font-bold">
              {letter}
            </div>
          )}
        </div>
        {/* Edit button overlay */}
        {isOwner && (
          <button
            onClick={onEdit}
            className="absolute bottom-1 right-1 z-20 w-10 h-10 rounded-full bg-surface border border-border text-text flex items-center justify-center hover:border-faint active:bg-raised transition-colors duration-[var(--t-press)] motion-reduce:transition-none"
            aria-label={t("editProfile")}
          >
            <EditIcon className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Name & bio */}
      <div className="space-y-2">
        <h1 className="font-serif-display text-3xl font-bold text-text">
          {profile.display_name ?? "Angler"}
        </h1>
        {profile.bio && (
          <p className="text-base text-muted max-w-lg mx-auto">
            {profile.bio}
          </p>
        )}

        {/* Location & join date pills */}
        <div className="flex justify-center gap-2 pt-2 flex-wrap">
          {profile.home_region && (
            <span className="bg-raised text-muted px-3 py-1 rounded-[var(--r-pill)] text-[13px] flex items-center gap-1">
              <PinIcon className="h-4 w-4" />
              {t(`regions.${profile.home_region}` as Parameters<typeof t>[0])}
            </span>
          )}
          <span className="bg-raised text-muted px-3 py-1 rounded-[var(--r-pill)] text-[13px] flex items-center gap-1">
            <CalendarIcon className="h-4 w-4" />
            {t("memberSince")} {joinYear}
          </span>
        </div>

        {/* Fishing tags */}
        {profile.fishing_tags.length > 0 && (
          <div className="flex flex-wrap justify-center gap-1.5 pt-2">
            {profile.fishing_tags.map((tag) => (
              <span
                key={tag}
                className={`text-[13px] font-medium px-2.5 py-1 rounded-[var(--r-pill)] ${TAG_COLORS[tag] ?? "bg-raised text-muted"}`}
              >
                {t(`tags.${tag}` as Parameters<typeof t>[0])}
              </span>
            ))}
          </div>
        )}

        {/* Favorite spots */}
        {profile.favorite_spots?.length > 0 && (
          <div className="flex flex-wrap justify-center gap-1.5 pt-2">
            {profile.favorite_spots.map((spot) => (
              <span
                key={spot}
                className="inline-flex items-center gap-1 text-[13px] font-medium px-3 py-1 rounded-[var(--r-pill)] pill-brack"
              >
                <PinIcon className="h-3.5 w-3.5" />
                {spot}
              </span>
            ))}
          </div>
        )}

        {/* Social links */}
        {(profile.social_links?.instagram || profile.social_links?.youtube || profile.social_links?.other) && (
          <div className="flex items-center justify-center gap-2 pt-2">
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
      </div>
    </section>
  );
}
