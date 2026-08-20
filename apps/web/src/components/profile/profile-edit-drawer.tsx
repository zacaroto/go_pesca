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
  "w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-400 transition-all";

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
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Drawer — capped at 60vh */}
      <div className="absolute inset-x-0 bottom-0 max-h-[60vh] flex flex-col rounded-t-2xl bg-surface dark:bg-surface-alt shadow-xl animate-in slide-in-from-bottom duration-300">
        {/* Handle + header (sticky) */}
        <div className="flex-shrink-0 pt-2.5 pb-2 px-4 border-b border-foreground/5">
          <div className="w-8 h-1 rounded-full bg-foreground/15 mx-auto mb-2" />
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold text-foreground" style={{ fontFamily: "var(--font-fredoka)" }}>
              {t("editProfile")}
            </h2>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-foreground/5 text-muted hover:text-foreground transition-colors"
            >
              <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {/* Avatar */}
          <AvatarUpload
            currentUrl={profile.avatar_url}
            displayName={displayName}
            onSelect={setAvatarFile}
          />

          {/* Display Name */}
          <div>
            <label className="block text-xs font-medium text-muted mb-1">
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
            <label className="block text-xs font-medium text-muted mb-1">
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
            <label className="block text-xs font-medium text-muted mb-1.5">
              {t("fishingStyle")}
            </label>
            <div className="flex flex-wrap gap-1.5">
              {FISHING_TAGS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`text-xs font-semibold px-2.5 py-1 rounded-lg border transition-all ${
                    fishingTags.includes(tag)
                      ? "bg-primary/15 text-primary border-primary/30"
                      : "bg-foreground/5 text-muted border-transparent hover:border-foreground/15"
                  }`}
                >
                  {t(`tags.${tag}` as Parameters<typeof t>[0])}
                </button>
              ))}
            </div>
          </div>

          {/* Favorite Spots */}
          <div>
            <label className="block text-xs font-medium text-muted mb-1.5">
              {t("favoriteSpots")}
            </label>
            {/* Current spots */}
            {favoriteSpots.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-2">
                {favoriteSpots.map((spot) => (
                  <span
                    key={spot}
                    className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-lg bg-accent/10 text-accent border border-accent/15"
                  >
                    <svg className="w-3 h-3 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                      <path fillRule="evenodd" d="m11.54 22.351.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a16.975 16.975 0 0 0 1.144-.742 19.58 19.58 0 0 0 2.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 0 0-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 0 0 3.834 3.025ZM12 12.75a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" clipRule="evenodd" />
                    </svg>
                    {spot}
                    <button
                      type="button"
                      onClick={() => removeSpot(spot)}
                      className="ml-0.5 hover:text-red-500 transition-colors"
                    >
                      <svg className="w-3 h-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
            )}
            {/* Add spot input */}
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
                  className="flex-shrink-0 px-3 py-2 text-xs font-semibold rounded-xl bg-accent/15 text-accent hover:bg-accent/25 disabled:opacity-40 transition-colors"
                >
                  {t("addSpot")}
                </button>
              </div>
            )}
            {favoriteSpots.length >= MAX_SPOTS && (
              <p className="text-[11px] text-muted mt-1">{t("maxSpots")}</p>
            )}
          </div>

          {/* Home Region */}
          <div>
            <label className="block text-xs font-medium text-muted mb-1">
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
          <div className="space-y-2">
            <label className="block text-xs font-medium text-muted">
              {t("socialLinks")}
            </label>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-muted w-16 flex-shrink-0">{t("instagram")}</span>
              <input
                type="text"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                placeholder="@username"
                className={inputClass}
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-muted w-16 flex-shrink-0">{t("youtube")}</span>
              <input
                type="text"
                value={youtube}
                onChange={(e) => setYoutube(e.target.value)}
                placeholder="@channel"
                className={inputClass}
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-muted w-16 flex-shrink-0">{t("other")}</span>
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
        <div className="flex-shrink-0 px-4 py-3 border-t border-foreground/5">
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-primary text-white py-3 rounded-2xl font-semibold hover:bg-primary/90 active:scale-[0.98] disabled:opacity-50 transition-all duration-200 shadow-lg shadow-primary/25"
          >
            {saving ? t("saving") : t("save")}
          </button>
        </div>
      </div>
    </div>
  );
}
