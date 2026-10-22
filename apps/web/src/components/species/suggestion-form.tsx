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
        <p className="text-positive font-medium">{t("suggestionSent")}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-small font-medium mb-1">
          {t("commonName")} *
        </label>
        <input
          type="text"
          value={commonName}
          onChange={(e) => setCommonName(e.target.value)}
          className="field"
          required
        />
      </div>

      <PhotoUpload onSelect={setPhoto} />

      <div>
        <label className="block text-small font-medium mb-1">
          {t("suggestionNotes")}
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className="field"
        />
      </div>

      {error && <p className="text-negative text-small">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="btn-primary w-full"
      >
        {submitting ? tCommon("loading") : tCommon("submit")}
      </button>
    </form>
  );
}
