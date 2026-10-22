"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { CameraIcon } from "@/components/icons";

type Props = {
  currentUrl?: string | null;
  displayName?: string;
  onSelect: (file: File) => void;
};

export function AvatarUpload({ currentUrl, displayName, onSelect }: Props) {
  const t = useTranslations("catches");
  const [preview, setPreview] = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    onSelect(file);
    setPreview(URL.createObjectURL(file));
  }

  const src = preview || currentUrl;
  const letter = displayName?.charAt(0)?.toUpperCase() ?? "?";

  return (
    <div className="relative w-36 h-36 mx-auto">
      {src ? (
        <img
          src={src}
          alt=""
          className="w-36 h-36 rounded-full object-cover border border-border"
        />
      ) : (
        <div className="w-36 h-36 rounded-full bg-accent-soft text-accent-ink flex items-center justify-center text-4xl font-bold border border-border">
          {letter}
        </div>
      )}
      <label className="absolute bottom-1 right-1 w-10 h-10 rounded-full bg-surface text-text border border-border flex items-center justify-center cursor-pointer hover:border-faint active:bg-raised focus-within:outline focus-within:outline-2 focus-within:outline-accent transition-colors duration-[var(--t-press)] motion-reduce:transition-none">
        <CameraIcon className="h-5 w-5" />
        <input
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="absolute inset-0 opacity-0 cursor-pointer"
          aria-label={t("uploadPhoto")}
        />
      </label>
    </div>
  );
}
