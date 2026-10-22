"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { AvatarUpload } from "./avatar-upload";
import { updateProfile, uploadAvatar } from "@/lib/profile";
import { CheckCircleIcon, CloseIcon, PinIcon } from "@/components/icons";

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

const inputClass = "field";
const labelClass = "block text-sm font-semibold text-text";

const FISHING_TAGS = ["shore", "kayak", "offshore", "fly", "river", "lake", "spearfishing"] as const;
const REGIONS = ["pacific", "caribbean", "centralValley", "northernPlains", "southPacific"] as const;
const MAX_SPOTS = 10;

export function ProfileEditDrawer({ open, onClose, profile }: Props) {
  const t = useTranslations("profile");
  const tCommon = useTranslations("common");
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
  const [saveError, setSaveError] = useState<string | null>(null);

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
    setSaveError(null);
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
    } catch (err) {
      console.error("Failed to save profile:", err);
      setSaveError(tCommon("errorSaving"));
    } finally {
      setSaving(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-text/40" onClick={onClose} />

      {/* Drawer */}
      <div className="absolute inset-x-0 bottom-0 mx-auto max-w-lg max-h-[75vh] flex flex-col rounded-t-[var(--r-card)] bg-surface border border-border border-b-0 shadow-xl">
        {/* Handle + header (sticky) */}
        <div className="flex-shrink-0 pt-3 pb-2 px-5 border-b border-border">
          <div className="w-10 h-1.5 rounded-full bg-border mx-auto mb-3" />
          <div className="flex items-center justify-between">
            <h2 className="font-serif-display text-xl font-bold text-text">
              {t("editProfile")}
            </h2>
            <button
              onClick={onClose}
              aria-label={tCommon("close")}
              className="w-9 h-9 rounded-full bg-raised flex items-center justify-center border border-border hover:border-faint active:bg-border text-muted transition-colors duration-[var(--t-press)] motion-reduce:transition-none"
            >
              <CloseIcon className="h-5 w-5" />
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
            <label className={`${labelClass} mb-1.5`}>
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
            <label className={`${labelClass} mb-1.5`}>
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
            <label className={`${labelClass} mb-2`}>
              {t("fishingStyle")}
            </label>
            <div className="flex flex-wrap gap-2">
              {FISHING_TAGS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  aria-pressed={fishingTags.includes(tag)}
                  className={`text-[13px] font-medium px-3 py-1.5 rounded-[var(--r-pill)] border transition-[background-color,border-color,transform] duration-[var(--t-press)] ease-[var(--ease-out)] active:scale-[0.97] motion-reduce:transition-none motion-reduce:active:scale-100 ${
                    fishingTags.includes(tag)
                      ? "bg-accent text-on-primary border-accent"
                      : "bg-surface text-muted border-border hover:border-faint active:bg-raised"
                  }`}
                >
                  {t(`tags.${tag}` as Parameters<typeof t>[0])}
                </button>
              ))}
            </div>
          </div>

          {/* Favorite Spots */}
          <div>
            <label className={`${labelClass} mb-2`}>
              {t("favoriteSpots")}
            </label>
            {favoriteSpots.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {favoriteSpots.map((spot) => (
                  <span
                    key={spot}
                    className="inline-flex items-center gap-1 text-[13px] font-medium px-3 py-1.5 rounded-[var(--r-pill)] pill-brack"
                  >
                    <PinIcon className="h-3.5 w-3.5" />
                    {spot}
                    <button
                      type="button"
                      onClick={() => removeSpot(spot)}
                      aria-label={`${tCommon("close")} ${spot}`}
                      className="ml-0.5 rounded-full hover:text-negative active:text-negative transition-colors duration-[var(--t-press)] motion-reduce:transition-none"
                    >
                      <CloseIcon className="h-3.5 w-3.5" />
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
                  className="btn-secondary flex-shrink-0 px-4 py-2 text-[13px]"
                >
                  {t("addSpot")}
                </button>
              </div>
            )}
            {favoriteSpots.length >= MAX_SPOTS && (
              <p className="text-[13px] text-muted mt-1">{t("maxSpots")}</p>
            )}
          </div>

          {/* Home Region */}
          <div>
            <label className={`${labelClass} mb-1.5`}>
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
            <label className={`${labelClass}`}>
              {t("socialLinks")}
            </label>
            <div className="flex items-center gap-2">
              <span className="text-[13px] font-medium text-muted w-20 flex-shrink-0">{t("instagram")}</span>
              <input
                type="text"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                placeholder="@username"
                className={inputClass}
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[13px] font-medium text-muted w-20 flex-shrink-0">{t("youtube")}</span>
              <input
                type="text"
                value={youtube}
                onChange={(e) => setYoutube(e.target.value)}
                placeholder="@channel"
                className={inputClass}
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[13px] font-medium text-muted w-20 flex-shrink-0">{t("other")}</span>
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
        <div className="flex-shrink-0 px-5 py-4 border-t border-border">
          {saveError && (
            <p role="alert" className="mb-3 text-sm text-negative">
              {saveError}
            </p>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-primary w-full"
          >
            <CheckCircleIcon className="h-5 w-5" />
            {saving ? t("saving") : t("save")}
          </button>
        </div>
      </div>
    </div>
  );
}
