"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

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
          className="w-36 h-36 rounded-full object-cover sticker-border"
        />
      ) : (
        <div className="w-36 h-36 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-white text-4xl font-bold sticker-border">
          {letter}
        </div>
      )}
      <label className="absolute bottom-1 right-1 w-10 h-10 rounded-full bg-tertiary-container text-on-tertiary-container flex items-center justify-center cursor-pointer sticker-border hover:scale-105 transition-transform active:translate-y-0.5 active:translate-x-0.5">
        <span className="material-symbols-outlined text-xl">photo_camera</span>
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
