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
      <h1 className="font-serif-display text-3xl font-bold mb-6">{t("settings")}</h1>

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
      <div className="mt-8 rounded-[var(--r-card)] border border-negative p-4">
        <h2 className="text-sm font-semibold text-negative mb-2">
          {t("dangerZone")}
        </h2>
        <p className="text-[13px] text-muted mb-3">
          {t("deleteWarning")}
        </p>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="btn-danger px-4 py-2 text-[13px]"
        >
          {deleting ? t("deleting") : t("deleteGroup")}
        </button>
      </div>
    </div>
  );
}
