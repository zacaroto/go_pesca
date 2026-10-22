"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";

type Props = {
  onSelect: (file: File) => void;
};

export function PhotoUpload({ onSelect }: Props) {
  const t = useTranslations("catches");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    // Object URLs are an external resource: create per file, revoke on change/unmount.
    if (!file) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const picked = e.target.files?.[0];
    if (!picked) return;
    onSelect(picked);
    setFile(picked);
  }

  const focusRing =
    "focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-[var(--accent)]";

  return (
    <div>
      {preview ? (
        <div className="relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt={t("photoAlt")} className="w-full h-48 object-cover rounded-[var(--r-card)]" />
          <div
            className={`absolute bottom-2 right-2 h-[34px] px-3.5 inline-flex items-center rounded-[var(--r-control)] bg-[var(--surface)] text-[var(--text)] text-[13px] font-medium cursor-pointer overflow-hidden hover:bg-[var(--raised)] active:bg-[var(--raised)] transition-[background-color] duration-[var(--t-ui)] motion-reduce:transition-none ${focusRing}`}
          >
            <span>{t("changePhoto")}</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleChange}
              aria-label={t("changePhoto")}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>
        </div>
      ) : (
        <div
          className={`relative w-full h-48 rounded-[var(--r-card)] border border-dashed border-[var(--border)] bg-[var(--ground)] flex flex-col items-center justify-center gap-2 text-[var(--muted)] hover:border-[var(--accent)] hover:text-[var(--accent)] active:bg-[var(--raised)] transition-[border-color,color,background-color] duration-[var(--t-ui)] motion-reduce:transition-none cursor-pointer overflow-hidden ${focusRing}`}
        >
          <svg className="w-9 h-9 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
          </svg>
          <span className="text-sm pointer-events-none">{t("uploadPhoto")}</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleChange}
            aria-label={t("uploadPhoto")}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
        </div>
      )}
    </div>
  );
}
