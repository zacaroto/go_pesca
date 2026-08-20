"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { leaveGroup } from "@/lib/groups";

type Props = {
  group: {
    id: string;
    name: string;
    description: string | null;
    avatar_url: string | null;
    is_public: boolean;
    invite_code: string;
    created_by: string;
    member_count: number;
  };
  isCreator: boolean;
  locale: string;
};

export function GroupHeader({ group, isCreator, locale }: Props) {
  const t = useTranslations("groups");
  const [copied, setCopied] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const router = useRouter();

  const inviteUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/${locale}/groups/join/${group.invite_code}`;

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: do nothing
    }
  }

  async function handleLeave() {
    if (!confirm(t("confirmLeave"))) return;
    setLeaving(true);
    try {
      await leaveGroup(group.id);
      router.push(`/${locale}/community`);
    } catch {
      setLeaving(false);
    }
  }

  const letter = group.name.charAt(0).toUpperCase();

  return (
    <div className="overflow-hidden rounded-2xl bg-surface dark:bg-surface-alt ring-1 ring-foreground/5 dark:ring-white/5 shadow-sm">
      {/* Banner */}
      <div className="h-20 bg-gradient-to-r from-primary via-primary-light to-accent relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 400 80">
            <path d="M0 60 C100 30, 200 70, 400 40 L400 80 L0 80Z" fill="rgba(255,255,255,0.15)" />
            <path d="M0 70 C150 50, 250 80, 400 55 L400 80 L0 80Z" fill="rgba(255,255,255,0.1)" />
          </svg>
        </div>
      </div>

      {/* Avatar + info */}
      <div className="px-4 -mt-10 relative">
        <div className="flex items-end gap-3">
          {group.avatar_url ? (
            <img
              src={group.avatar_url}
              alt=""
              className="w-20 h-20 rounded-2xl object-cover ring-[3px] ring-surface dark:ring-surface-alt shadow-md flex-shrink-0"
            />
          ) : (
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-white text-xl font-bold ring-[3px] ring-surface dark:ring-surface-alt shadow-md flex-shrink-0">
              {letter}
            </div>
          )}

          <div className="flex-1 min-w-0 pb-1">
            <h1 className="text-lg font-extrabold text-foreground truncate" style={{ fontFamily: "var(--font-fredoka)" }}>
              {group.name}
            </h1>
            <span className="inline-flex items-center gap-1 text-xs text-muted mt-0.5">
              <svg className="w-3 h-3 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path fillRule="evenodd" d="M8.25 6.75a3.75 3.75 0 1 1 7.5 0 3.75 3.75 0 0 1-7.5 0ZM15.75 9.75a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM2.25 9.75a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM6.31 17.084a11.116 11.116 0 0 1 3.727-1.482 3 3 0 0 1 3.926 0 11.12 11.12 0 0 1 3.727 1.482 4.5 4.5 0 0 0-11.38 0Z" clipRule="evenodd" />
              </svg>
              {t("memberCount", { count: group.member_count })} · {group.is_public ? t("public") : t("private")}
            </span>
          </div>

          {isCreator && (
            <Link
              href={`/groups/${group.id}/settings`}
              className="flex-shrink-0 mb-1 p-2 rounded-xl bg-foreground/5 hover:bg-foreground/10 text-muted hover:text-foreground transition-colors"
            >
              <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              </svg>
            </Link>
          )}
        </div>
      </div>

      {/* Description + actions */}
      <div className="px-4 pt-3 pb-4 space-y-3">
        {group.description && (
          <p className="text-sm text-muted leading-relaxed">{group.description}</p>
        )}

        <div className="flex gap-2">
          <button
            onClick={handleCopyLink}
            className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold bg-primary/10 text-primary hover:bg-primary/15 transition-colors"
          >
            <svg className="w-3.5 h-3.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m9.86-2.54a4.5 4.5 0 0 0-1.242-7.244l-4.5-4.5a4.5 4.5 0 0 0-6.364 6.364L5.25 9.818" />
            </svg>
            {copied ? t("copied") : t("copyLink")}
          </button>

          {!isCreator && (
            <button
              onClick={handleLeave}
              disabled={leaving}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-red-50 dark:bg-red-900/20 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 disabled:opacity-50 transition-colors"
            >
              {t("leave")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
