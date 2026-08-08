"use client";

import { useId, useState } from "react";
import { useTranslations } from "next-intl";

type Props = {
  onSelect: (file: File) => void;
};

export function PhotoUpload({ onSelect }: Props) {
  const t = useTranslations("catches");
  const inputId = useId();
  const [preview, setPreview] = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    onSelect(file);
    const url = URL.createObjectURL(file);
    setPreview(url);
  }

  return (
    <div>
      <input
        id={inputId}
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="sr-only"
      />
      {preview ? (
        <div className="relative">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-48 object-cover rounded-lg"
          />
          <label
            htmlFor={inputId}
            className="absolute bottom-2 right-2 bg-white/80 dark:bg-gray-800/80 text-sm px-3 py-1 rounded cursor-pointer"
          >
            {t("uploadPhoto")}
          </label>
        </div>
      ) : (
        <label
          htmlFor={inputId}
          className="w-full h-48 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex flex-col items-center justify-center gap-2 text-gray-500 hover:border-cyan-400 hover:text-cyan-500 transition-all duration-200 cursor-pointer"
        >
          <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
          </svg>
          <span className="text-sm">{t("uploadPhoto")}</span>
        </label>
      )}
    </div>
  );
}
