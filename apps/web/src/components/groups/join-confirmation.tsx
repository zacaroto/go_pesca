"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { joinGroup } from "@/lib/groups";

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
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-900/20 mb-4">
          <svg className="w-8 h-8 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clipRule="evenodd" />
          </svg>
        </div>
        <h1 className="text-lg font-bold text-foreground mb-2">{t("groupNotFound")}</h1>
        <p className="text-sm text-muted">{t("groupNotFoundHelp")}</p>
      </div>
    );
  }

  if (error === "full") {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-900/20 mb-4">
          <span className="text-3xl">👥</span>
        </div>
        <h1 className="text-lg font-bold text-foreground mb-2">{group?.name}</h1>
        <p className="text-sm text-muted">{t("groupFull")}</p>
      </div>
    );
  }

  if (!group) return null;

  const letter = group.name.charAt(0).toUpperCase();

  return (
    <div className="max-w-md mx-auto px-4 py-20">
      <div className="rounded-2xl bg-surface dark:bg-surface-alt ring-1 ring-foreground/5 dark:ring-white/5 shadow-sm p-6 text-center">
        {/* Group avatar */}
        {group.avatar_url ? (
          <img src={group.avatar_url} alt="" className="w-16 h-16 rounded-2xl object-cover mx-auto mb-4 shadow-md" />
        ) : (
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-white text-xl font-bold mx-auto mb-4 shadow-md">
            {letter}
          </div>
        )}

        <h1 className="text-lg font-bold text-foreground mb-1">{group.name}</h1>
        {group.description && (
          <p className="text-sm text-muted mb-2">{group.description}</p>
        )}
        <p className="text-xs text-muted mb-6">
          {t("memberCount", { count: group.member_count })}
        </p>

        {joinError && (
          <div className="text-red-600 text-sm bg-red-50 dark:bg-red-900/20 rounded-xl px-4 py-3 mb-4">
            {joinError}
          </div>
        )}

        <button
          onClick={handleJoin}
          disabled={joining}
          className="w-full bg-cyan-600 text-white py-3 rounded-2xl font-semibold hover:bg-cyan-700 active:scale-[0.98] disabled:opacity-50 transition-all duration-200 shadow-lg shadow-cyan-600/25"
        >
          {joining ? t("joining") : t("joinGroup")}
        </button>
      </div>
    </div>
  );
}
