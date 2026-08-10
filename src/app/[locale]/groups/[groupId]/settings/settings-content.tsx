"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { GroupForm } from "@/components/groups/group-form";
import { deleteGroup } from "@/lib/groups";
import type { GroupWithMemberCount } from "@/lib/groups";

type Props = {
  group: GroupWithMemberCount;
  locale: string;
};

export function GroupSettingsContent({ group, locale }: Props) {
  const t = useTranslations("groups");
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!confirm(t("confirmDelete"))) return;
    setDeleting(true);
    try {
      await deleteGroup(group.id);
      router.push(`/${locale}/community`);
    } catch {
      setDeleting(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">{t("settings")}</h1>

      <GroupForm
        locale={locale}
        mode="edit"
        groupId={group.id}
        initialValues={{
          name: group.name,
          description: group.description ?? "",
          isPublic: group.is_public,
        }}
      />

      {/* Delete section */}
      <div className="mt-8 rounded-2xl bg-red-50 dark:bg-red-900/10 ring-1 ring-red-200 dark:ring-red-900/30 p-4">
        <h2 className="text-sm font-semibold text-red-700 dark:text-red-400 mb-2">
          {t("dangerZone")}
        </h2>
        <p className="text-xs text-red-600 dark:text-red-400/80 mb-3">
          {t("deleteWarning")}
        </p>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="px-4 py-2 rounded-xl text-xs font-semibold bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 transition-colors"
        >
          {deleting ? t("deleting") : t("deleteGroup")}
        </button>
      </div>
    </div>
  );
}
