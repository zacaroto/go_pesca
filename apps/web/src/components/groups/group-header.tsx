"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { leaveGroup } from "@/lib/groups";
import { useInviteLink } from "./use-invite-link";
import { MemberAvatar } from "./member-avatar";
import type { GroupMember } from "./group-member-list";

type Props = {
  group: {
    id: string;
    name: string;
    description: string | null;
    avatar_url: string | null;
    is_public: boolean;
    invite_code: string;
    member_count: number;
  };
  members: GroupMember[];
  isCreator: boolean;
  locale: string;
};

const FACES = 5;

const ICON_BTN =
  "grid h-10 w-10 shrink-0 place-items-center rounded-full bg-raised text-text hover:bg-border active:scale-95 transition-[background-color,transform] duration-[var(--t-ui)] motion-reduce:transition-none motion-reduce:active:scale-100 focus-visible:outline-2 focus-visible:outline-offset-2";

export function GroupHeader({ group, members, isCreator, locale }: Props) {
  const t = useTranslations("groups");
  const router = useRouter();
  const { copy, copied } = useInviteLink(group.invite_code, locale);
  const [leaving, setLeaving] = useState(false);
  const [leaveError, setLeaveError] = useState(false);

  async function handleLeave() {
    if (!confirm(t("confirmLeave"))) return;
    setLeaving(true);
    setLeaveError(false);
    try {
      await leaveGroup(group.id);
      router.push("/groups");
    } catch (err) {
      console.error("Failed to leave group:", err);
      setLeaveError(true);
      setLeaving(false);
    }
  }

  const extra = group.member_count - Math.min(members.length, FACES);

  return (
    <header className="mb-8 flex flex-wrap items-center gap-x-5 gap-y-4">
      {group.avatar_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={group.avatar_url} alt="" className="h-[72px] w-[72px] shrink-0 rounded-[var(--r-card)] object-cover" />
      ) : (
        <span
          aria-hidden="true"
          className="grid h-[72px] w-[72px] shrink-0 place-items-center rounded-[var(--r-card)] bg-accent-soft font-serif-display text-heading font-black text-accent-ink"
        >
          {group.name.charAt(0).toUpperCase()}
        </span>
      )}

      <div className="min-w-0 flex-1 basis-64">
        <h1 className="m-0 font-serif-display text-heading font-black leading-none tracking-[-0.03em] sm:text-title [overflow-wrap:anywhere]">
          {group.name}
        </h1>
        <p className="mt-2 mb-0 text-muted">
          {[group.description, group.is_public ? t("public") : t("private"), t("memberCount", { count: group.member_count })]
            .filter(Boolean)
            .join(" · ")}
        </p>
      </div>

      <div className="flex items-center" aria-hidden="true">
        {members.slice(0, FACES).map((m, i) => (
          <MemberAvatar key={m.user_id} member={m} className={`h-[30px] w-[30px] text-label ring-2 ring-ground ${i ? "-ml-2" : ""}`} />
        ))}
        {extra > 0 && (
          <span className="-ml-2 grid h-[30px] w-[30px] place-items-center rounded-full bg-raised text-label font-semibold text-muted ring-2 ring-ground">
            +{extra}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2 rounded-full bg-surface py-1 pr-1 pl-3.5">
        <code className="text-label font-semibold tracking-[0.04em]">{group.invite_code}</code>
        <button
          type="button"
          onClick={copy}
          className="inline-flex h-8 items-center gap-1.5 rounded-full bg-accent px-3 text-small font-semibold text-on-primary hover:bg-accent-hi active:scale-[0.97] transition-[background-color,transform] duration-[var(--t-press)] motion-reduce:transition-none motion-reduce:active:scale-100 focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="8" y="8" width="12" height="12" rx="2" />
            <path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3" />
          </svg>
          <span aria-live="polite">{copied ? t("copied") : t("invite")}</span>
        </button>
      </div>

      {isCreator ? (
        <Link href={`/groups/${group.id}/settings`} aria-label={t("settings")} className={ICON_BTN}>
          <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="3" />
            <path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" />
          </svg>
        </Link>
      ) : (
        <button
          type="button"
          onClick={handleLeave}
          disabled={leaving}
          className="h-10 rounded-full bg-raised px-4 text-small font-semibold text-text hover:bg-border active:scale-[0.97] disabled:opacity-60 transition-[background-color,transform] duration-[var(--t-ui)] motion-reduce:transition-none motion-reduce:active:scale-100 focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          {t("leave")}
        </button>
      )}
      {leaveError && (
        <p role="alert" className="m-0 basis-full text-label text-negative">
          {t("leaveError")}
        </p>
      )}
    </header>
  );
}
