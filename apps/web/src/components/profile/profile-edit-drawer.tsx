"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { AvatarUpload } from "./avatar-upload";
import { updateProfile, uploadAvatar } from "@/lib/profile";

type ProfileData = {
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  fishing_tags: string[];
  home_region: string | null;
  social_links: Record<string, string>;
  favorite_spots: string[];
};

type Props = {
  open: boolean;
  onClose: () => void;
  profile: ProfileData;
};

const inputClass =
  "w-full bg-surface-container-lowest text-on-surface rounded-2xl chunky-border p-3 text-sm focus:outline-none focus:ring-4 focus:ring-secondary-container transition-all";

const FISHING_TAGS = ["shore", "kayak", "offshore", "fly", "river", "lake", "spearfishing"] as const;
const REGIONS = ["pacific", "caribbean", "centralValley", "northernPlains", "southPacific"] as const;
const MAX_SPOTS = 10;

export function ProfileEditDrawer({ open, onClose, profile }: Props) {
  const t = useTranslations("profile");
  const router = useRouter();

  const [displayName, setDisplayName] = useState(profile.display_name ?? "");
  const [bio, setBio] = useState(profile.bio ?? "");
  const [fishingTags, setFishingTags] = useState<string[]>(profile.fishing_tags ?? []);
  const [homeRegion, setHomeRegion] = useState(profile.home_region ?? "");
  const [instagram, setInstagram] = useState(profile.social_links?.instagram ?? "");
  const [youtube, setYoutube] = useState(profile.social_links?.youtube ?? "");
  const [other, setOther] = useState(profile.social_links?.other ?? "");
  const [favoriteSpots, setFavoriteSpots] = useState<string[]>(profile.favorite_spots ?? []);
  const [spotInput, setSpotInput] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  function toggleTag(tag: string) {
    setFishingTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }

  function addSpot() {
    const trimmed = spotInput.trim();
    if (!trimmed || favoriteSpots.length >= MAX_SPOTS || favoriteSpots.includes(trimmed)) return;
    setFavoriteSpots((prev) => [...prev, trimmed]);
    setSpotInput("");
  }

  function removeSpot(spot: string) {
    setFavoriteSpots((prev) => prev.filter((s) => s !== spot));
  }

  async function handleSave() {
    setSaving(true);
    try {
      if (avatarFile) {
        await uploadAvatar(avatarFile);
      }

      const socialLinks: Record<string, string> = {};
      if (instagram) socialLinks.instagram = instagram;
      if (youtube) socialLinks.youtube = youtube;
      if (other) socialLinks.other = other;

      await updateProfile({
        display_name: displayName || null,
        bio: bio || null,
        fishing_tags: fishingTags,
        home_region: homeRegion || null,
        social_links: socialLinks,
        favorite_spots: favoriteSpots,
      });

      router.refresh();
      onClose();
    } catch {
      // Error handled silently
    } finally {
      setSaving(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm" onClick={onClose} />

      {/* Drawer */}
      <div className="absolute inset-x-0 bottom-0 mx-auto max-w-lg max-h-[75vh] flex flex-col rounded-t-3xl bg-card-bg chunky-border border-b-0 shadow-xl">
        {/* Handle + header (sticky) */}
        <div className="flex-shrink-0 pt-3 pb-2 px-5 border-b border-outline-variant">
          <div className="w-10 h-1.5 rounded-full bg-outline-variant mx-auto mb-3" />
          <div className="flex items-center justify-between">
            <h2
              className="text-headline-md text-on-surface"
              style={{ fontFamily: "var(--font-fredoka)" }}
            >
              {t("editProfile")}
            </h2>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center border-2 border-outline-variant hover:scale-105 transition-transform active:translate-y-0.5 active:translate-x-0.5 text-muted"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
          {/* Avatar */}
          <AvatarUpload
            currentUrl={profile.avatar_url}
            displayName={displayName}
            onSelect={setAvatarFile}
          />

          {/* Display Name */}
          <div>
            <label className="block text-label-lg font-bold text-on-surface mb-1.5" style={{ fontFamily: "var(--font-fredoka)" }}>
              {t("displayName")}
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className={inputClass}
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-label-lg font-bold text-on-surface mb-1.5" style={{ fontFamily: "var(--font-fredoka)" }}>
              {t("bio")}
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder={t("bioPlaceholder")}
              rows={2}
              className={inputClass + " resize-none"}
            />
          </div>

          {/* Fishing Tags */}
          <div>
            <label className="block text-label-lg font-bold text-on-surface mb-2" style={{ fontFamily: "var(--font-fredoka)" }}>
              {t("fishingStyle")}
            </label>
            <div className="flex flex-wrap gap-2">
              {FISHING_TAGS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`text-label-sm font-bold px-3 py-1.5 rounded-full border-2 transition-all bouncy-active ${
                    fishingTags.includes(tag)
                      ? "bg-primary text-on-primary border-on-surface chunky-shadow"
                      : "bg-surface-container text-muted border-outline-variant hover:border-primary"
                  }`}
                >
                  {t(`tags.${tag}` as Parameters<typeof t>[0])}
                </button>
              ))}
            </div>
          </div>

          {/* Favorite Spots */}
          <div>
            <label className="block text-label-lg font-bold text-on-surface mb-2" style={{ fontFamily: "var(--font-fredoka)" }}>
              {t("favoriteSpots")}
            </label>
            {favoriteSpots.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {favoriteSpots.map((spot) => (
                  <span
                    key={spot}
                    className="inline-flex items-center gap-1 text-label-sm font-bold px-3 py-1.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed border-2 border-outline-variant"
                  >
                    <span className="material-symbols-outlined text-[14px]">location_on</span>
                    {spot}
                    <button
                      type="button"
                      onClick={() => removeSpot(spot)}
                      className="ml-0.5 hover:text-neon-coral transition-colors"
                    >
                      <span className="material-symbols-outlined text-[14px]">close</span>
                    </button>
                  </span>
                ))}
              </div>
            )}
            {favoriteSpots.length < MAX_SPOTS && (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={spotInput}
                  onChange={(e) => setSpotInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSpot(); } }}
                  placeholder={t("favoriteSpotsPlaceholder")}
                  className={inputClass}
                />
                <button
                  type="button"
                  onClick={addSpot}
                  disabled={!spotInput.trim()}
                  className="flex-shrink-0 px-4 py-2 text-label-sm font-bold rounded-2xl bg-tertiary-container text-on-tertiary-container chunky-border bouncy-shadow bouncy-active disabled:opacity-40 transition-all"
                >
                  {t("addSpot")}
                </button>
              </div>
            )}
            {favoriteSpots.length >= MAX_SPOTS && (
              <p className="text-label-sm text-muted mt-1">{t("maxSpots")}</p>
            )}
          </div>

          {/* Home Region */}
          <div>
            <label className="block text-label-lg font-bold text-on-surface mb-1.5" style={{ fontFamily: "var(--font-fredoka)" }}>
              {t("homeRegion")}
            </label>
            <select
              value={homeRegion}
              onChange={(e) => setHomeRegion(e.target.value)}
              className={inputClass}
            >
              <option value="">—</option>
              {REGIONS.map((region) => (
                <option key={region} value={region}>
                  {t(`regions.${region}` as Parameters<typeof t>[0])}
                </option>
              ))}
            </select>
          </div>

          {/* Social Links */}
          <div className="space-y-3">
            <label className="block text-label-lg font-bold text-on-surface" style={{ fontFamily: "var(--font-fredoka)" }}>
              {t("socialLinks")}
            </label>
            <div className="flex items-center gap-2">
              <span className="text-label-sm font-bold text-muted w-20 flex-shrink-0">{t("instagram")}</span>
              <input
                type="text"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                placeholder="@username"
                className={inputClass}
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-label-sm font-bold text-muted w-20 flex-shrink-0">{t("youtube")}</span>
              <input
                type="text"
                value={youtube}
                onChange={(e) => setYoutube(e.target.value)}
                placeholder="@channel"
                className={inputClass}
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-label-sm font-bold text-muted w-20 flex-shrink-0">{t("other")}</span>
              <input
                type="text"
                value={other}
                onChange={(e) => setOther(e.target.value)}
                placeholder="https://..."
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* Save button (sticky bottom) */}
        <div className="flex-shrink-0 px-5 py-4 border-t border-outline-variant">
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-primary text-on-primary py-3.5 rounded-2xl font-bold chunky-border chunky-shadow bouncy-hover bouncy-active disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            style={{ fontFamily: "var(--font-fredoka)" }}
          >
            <span className="material-symbols-outlined text-xl">check_circle</span>
            {saving ? t("saving") : t("save")}
          </button>
        </div>
      </div>
    </div>
  );
}
