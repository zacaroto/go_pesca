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
    <div className="relative w-24 h-24 mx-auto">
      {src ? (
        <img
          src={src}
          alt=""
          className="w-24 h-24 rounded-full object-cover ring-4 ring-white dark:ring-gray-800 shadow-lg"
        />
      ) : (
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-white text-2xl font-bold ring-4 ring-white dark:ring-gray-800 shadow-lg">
          {letter}
        </div>
      )}
      <label className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center cursor-pointer shadow-lg hover:bg-accent/90 transition-colors">
        <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Z" />
        </svg>
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
