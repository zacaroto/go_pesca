"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";

type Props = {
  onSelect: (file: File) => void;
};

export function PhotoUpload({ onSelect }: Props) {
  const t = useTranslations("catches");
  const inputRef = useRef<HTMLInputElement>(null);
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
      <label className="block text-sm font-medium mb-1">{t("photo")} *</label>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleChange}
        className="hidden"
      />
      {preview ? (
        <div className="relative">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-48 object-cover rounded-lg"
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="absolute bottom-2 right-2 bg-white/80 dark:bg-gray-800/80 text-sm px-3 py-1 rounded"
          >
            {t("uploadPhoto")}
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-full h-48 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex flex-col items-center justify-center gap-2 text-gray-500 hover:border-blue-400 transition-colors"
        >
          <span className="text-4xl">📷</span>
          <span className="text-sm">{t("uploadPhoto")}</span>
        </button>
      )}
    </div>
  );
}
