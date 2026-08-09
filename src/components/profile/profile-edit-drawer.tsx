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
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  function toggleTag(tag: string) {
    setFishingTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
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
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Drawer */}
      <div className="absolute inset-x-0 bottom-0 max-h-[90vh] overflow-y-auto rounded-t-2xl bg-surface dark:bg-surface-alt shadow-xl animate-in slide-in-from-bottom duration-300">
        {/* Handle */}
        <div className="sticky top-0 z-10 bg-surface dark:bg-surface-alt pt-3 pb-2 px-5">
          <div className="w-10 h-1 rounded-full bg-foreground/20 mx-auto mb-3" />
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-foreground" style={{ fontFamily: "var(--font-fredoka)" }}>
              {t("editProfile")}
            </h2>
            <button
              onClick={onClose}
              className="text-muted hover:text-foreground transition-colors"
            >
              <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="px-5 pb-8 space-y-5">
          {/* Avatar */}
          <AvatarUpload
            currentUrl={profile.avatar_url}
            displayName={displayName}
            onSelect={setAvatarFile}
          />

          {/* Display Name */}
          <div>
            <label className="block text-xs font-medium text-muted mb-1.5">
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
            <label className="block text-xs font-medium text-muted mb-1.5">
              {t("bio")}
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder={t("bioPlaceholder")}
              rows={3}
              className={inputClass + " resize-none"}
            />
          </div>

          {/* Fishing Tags */}
          <div>
            <label className="block text-xs font-medium text-muted mb-2">
              {t("fishingStyle")}
            </label>
            <div className="flex flex-wrap gap-2">
              {FISHING_TAGS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-xl border-2 transition-all ${
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

          {/* Home Region */}
          <div>
            <label className="block text-xs font-medium text-muted mb-1.5">
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
            <label className="block text-xs font-medium text-muted">
              {t("socialLinks")}
            </label>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-muted w-20">{t("instagram")}</span>
                <input
                  type="text"
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  placeholder="@username"
                  className={inputClass}
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-muted w-20">{t("youtube")}</span>
                <input
                  type="text"
                  value={youtube}
                  onChange={(e) => setYoutube(e.target.value)}
                  placeholder="@channel"
                  className={inputClass}
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-muted w-20">{t("other")}</span>
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

          {/* Save button */}
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-primary text-white py-3.5 rounded-2xl font-semibold hover:bg-primary/90 active:scale-[0.98] disabled:opacity-50 transition-all duration-200 shadow-lg shadow-primary/25"
          >
            {saving ? t("saving") : t("save")}
          </button>
        </div>
      </div>
    </div>
  );
}
