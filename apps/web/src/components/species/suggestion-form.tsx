"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { PhotoUpload } from "@/components/catches/photo-upload";
import { submitSuggestion } from "@/lib/suggestions";

type Props = {
  locale: string;
};

export function SuggestionForm({ locale }: Props) {
  const t = useTranslations("species");
  const tCommon = useTranslations("common");
  const router = useRouter();

  const [photo, setPhoto] = useState<File | null>(null);
  const [commonName, setCommonName] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!commonName.trim()) {
      setError("Common name is required");
      return;
    }

    setSubmitting(true);
    try {
      await submitSuggestion(photo, {
        commonName: commonName.trim(),
        notes: notes || undefined,
      });
      setSuccess(true);
      setTimeout(() => router.push(`/${locale}/species`), 2000);
    } catch {
      setError("Error submitting suggestion");
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="text-center py-8">
        <p className="text-green-600 font-medium">{t("suggestionSent")}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-1">
          {t("commonName")} *
        </label>
        <input
          type="text"
          value={commonName}
          onChange={(e) => setCommonName(e.target.value)}
          className="w-full rounded-md border border-gray-300 dark:border-gray-700 px-3 py-2 text-sm dark:bg-gray-900"
          required
        />
      </div>

      <PhotoUpload onSelect={setPhoto} />

      <div>
        <label className="block text-sm font-medium mb-1">
          {t("suggestionNotes")}
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className="w-full rounded-md border border-gray-300 dark:border-gray-700 px-3 py-2 text-sm dark:bg-gray-900"
        />
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
      >
        {submitting ? tCommon("loading") : tCommon("submit")}
      </button>
    </form>
  );
}
