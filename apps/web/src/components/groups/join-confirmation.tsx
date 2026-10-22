"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { joinGroup } from "@/lib/groups";
import { UsersIcon } from "@/components/icons";

type Props = {
  locale: string;
  error?: "notFound" | "full";
  group?: {
    id: string;
    name: string;
    description: string | null;
    avatar_url: string | null;
    member_count: number;
  };
  inviteCode?: string;
};

export function JoinConfirmation({ locale, error, group, inviteCode }: Props) {
  const t = useTranslations("groups");
  const router = useRouter();
  const [joining, setJoining] = useState(false);
  const [joinError, setJoinError] = useState<string | null>(null);

  async function handleJoin() {
    if (!inviteCode) return;
    setJoining(true);
    setJoinError(null);
    try {
      const result = (await joinGroup(inviteCode)) as { id: string };
      router.push(`/${locale}/groups/${result.id}`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "";
      if (msg === "Already a member") {
        router.push(`/${locale}/groups/${group?.id}`);
      } else {
        setJoinError(t("joinError"));
      }
      setJoining(false);
    }
  }

  if (error === "notFound") {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="inline-flex items-center justify-center mb-4">
          <svg className="w-10 h-10 text-negative" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clipRule="evenodd" />
          </svg>
        </div>
        <h1 className="font-serif-display text-xl font-bold text-text mb-2">{t("groupNotFound")}</h1>
        <p className="text-sm text-muted">{t("groupNotFoundHelp")}</p>
      </div>
    );
  }

  if (error === "full") {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="inline-flex items-center justify-center mb-4">
          <UsersIcon className="h-10 w-10 text-muted" />
        </div>
        <h1 className="font-serif-display text-xl font-bold text-text mb-2">{group?.name}</h1>
        <p className="text-sm text-muted">{t("groupFull")}</p>
      </div>
    );
  }

  if (!group) return null;

  const letter = group.name.charAt(0).toUpperCase();

  return (
    <div className="max-w-md mx-auto px-4 py-20">
      <div className="rounded-[var(--r-card)] bg-surface border border-border p-6 text-center">
        {/* Group avatar */}
        {group.avatar_url ? (
          <img src={group.avatar_url} alt="" className="w-16 h-16 rounded-[var(--r-card)] object-cover mx-auto mb-4" />
        ) : (
          <div className="w-16 h-16 rounded-[var(--r-card)] bg-accent-soft text-accent-ink flex items-center justify-center text-xl font-bold mx-auto mb-4">
            {letter}
          </div>
        )}

        <h1 className="font-serif-display text-xl font-bold text-text mb-1">{group.name}</h1>
        {group.description && (
          <p className="text-sm text-muted mb-2">{group.description}</p>
        )}
        <p className="text-[13px] text-muted mb-6">
          {t("memberCount", { count: group.member_count })}
        </p>

        {joinError && (
          <div role="alert" className="text-negative text-sm border border-negative rounded-[var(--r-control)] px-4 py-3 mb-4">
            {joinError}
          </div>
        )}

        <button
          onClick={handleJoin}
          disabled={joining}
          className="btn-primary w-full"
        >
          {joining ? t("joining") : t("joinGroup")}
        </button>
      </div>
    </div>
  );
}
