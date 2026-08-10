"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { createGroup, updateGroup } from "@/lib/groups";

type Props = {
  locale: string;
  mode: "create" | "edit";
  groupId?: string;
  initialValues?: {
    name: string;
    description: string;
    isPublic: boolean;
  };
};

const inputClass =
  "w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-400 transition-all";

export function GroupForm({ locale, mode, groupId, initialValues }: Props) {
  const t = useTranslations("groups");
  const tCommon = useTranslations("common");
  const router = useRouter();

  const [name, setName] = useState(initialValues?.name ?? "");
  const [description, setDescription] = useState(initialValues?.description ?? "");
  const [isPublic, setIsPublic] = useState(initialValues?.isPublic ?? false);
  const [avatar, setAvatar] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError(t("nameRequired"));
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      if (mode === "create") {
        const group = (await createGroup(name.trim(), description.trim(), isPublic, avatar ?? undefined)) as { id: string };
        router.push(`/${locale}/groups/${group.id}`);
      } else if (groupId) {
        await updateGroup(groupId, { name: name.trim(), description: description.trim(), is_public: isPublic }, avatar ?? undefined);
        router.push(`/${locale}/groups/${groupId}`);
      }
    } catch {
      setError(t("saveError"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Name */}
      <section className="rounded-2xl bg-white dark:bg-gray-800/50 ring-1 ring-gray-100 dark:ring-gray-700/50 p-4">
        <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
          {t("name")} *
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={inputClass}
          maxLength={50}
          required
        />
      </section>

      {/* Description */}
      <section className="rounded-2xl bg-white dark:bg-gray-800/50 ring-1 ring-gray-100 dark:ring-gray-700/50 p-4">
        <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
          {t("description")}
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className={inputClass + " resize-none"}
          maxLength={200}
        />
      </section>

      {/* Avatar */}
      <section className="rounded-2xl bg-white dark:bg-gray-800/50 ring-1 ring-gray-100 dark:ring-gray-700/50 p-4">
        <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
          {t("avatar")}
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setAvatar(e.target.files?.[0] ?? null)}
          className="text-sm text-gray-500 dark:text-gray-400"
        />
      </section>

      {/* Public/Private toggle */}
      <section className="rounded-2xl bg-white dark:bg-gray-800/50 ring-1 ring-gray-100 dark:ring-gray-700/50 p-4">
        <label className="flex items-center justify-between cursor-pointer">
          <div>
            <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              {t("publicGroup")}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 block">
              {t("publicGroupHelp")}
            </span>
          </div>
          <div
            role="switch"
            aria-checked={isPublic}
            onClick={() => setIsPublic(!isPublic)}
            onKeyDown={(e) => { if (e.key === " " || e.key === "Enter") { e.preventDefault(); setIsPublic(!isPublic); } }}
            tabIndex={0}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out cursor-pointer ${
              isPublic ? "bg-cyan-600" : "bg-gray-300 dark:bg-gray-600"
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                isPublic ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </div>
        </label>
      </section>

      {error && (
        <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 dark:bg-red-900/20 rounded-xl px-4 py-3">
          <svg className="w-4 h-4 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-cyan-600 text-white py-3.5 rounded-2xl font-semibold hover:bg-cyan-700 active:scale-[0.98] disabled:opacity-50 transition-all duration-200 shadow-lg shadow-cyan-600/25"
      >
        {submitting ? tCommon("loading") : mode === "create" ? t("createGroup") : tCommon("save")}
      </button>
    </form>
  );
}
