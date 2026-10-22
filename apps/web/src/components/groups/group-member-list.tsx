"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { MAX_MEMBERS } from "@/lib/groups";
import { MemberAvatar } from "./member-avatar";

export type GroupMember = {
  user_id: string;
  role: string;
  joined_at?: string;
  display_name: string;
  avatar_url: string | null;
};

const PREVIEW = 6;

function joinedDate(iso: string, locale: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString(locale, { month: "short", year: "numeric", timeZone: "America/Costa_Rica" });
}

/** Side-rail panel: members (creator first), with an expand toggle past the first few. */
export function GroupMemberList({ members }: { members: GroupMember[] }) {
  const t = useTranslations("groups");
  const locale = useLocale();
  const [expanded, setExpanded] = useState(false);
  const ordered = [...members].sort((a, b) => Number(b.role === "creator") - Number(a.role === "creator"));
  const shown = expanded ? ordered : ordered.slice(0, PREVIEW);

  return (
    <section className="rounded-[var(--r-card)] bg-surface p-5" aria-labelledby="group-members-title">
      <div className="mb-1.5 flex items-baseline gap-3">
        <h2 id="group-members-title" className="m-0 font-serif-display text-subhead font-bold">
          {t("members")}
        </h2>
        <span className="text-label text-muted tabular-nums">{t("membersOf", { count: members.length, max: MAX_MEMBERS })}</span>
      </div>
      <ul className="m-0 list-none p-0">
        {shown.map((m) => (
          <li key={m.user_id} className="border-t border-rule first:border-t-0">
            <Link
              href={`/profile/${m.user_id}`}
              className="-mx-2 grid grid-cols-[32px_minmax(0,1fr)_auto] items-center gap-2.5 rounded-[6px] px-2 py-2 hover:bg-ground active:bg-raised transition-[background-color] duration-[var(--t-ui)] motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-[-2px]"
            >
              <MemberAvatar member={m} />
              <span className="min-w-0">
                <b className="block truncate font-semibold">{m.display_name || t("anonymousAngler")}</b>
                {m.joined_at && (
                  <small className="block text-label text-muted">{t("joinedOn", { date: joinedDate(m.joined_at, locale) })}</small>
                )}
              </span>
              {m.role === "creator" ? (
                <span className="rounded-full bg-accent-soft px-2 py-px text-label font-semibold text-accent-ink">{t("creator")}</span>
              ) : (
                <span />
              )}
            </Link>
          </li>
        ))}
      </ul>
      {members.length > PREVIEW && (
        <button
          type="button"
          aria-expanded={expanded}
          onClick={() => setExpanded((v) => !v)}
          className="mt-2 text-small font-medium text-accent hover:text-accent-hi active:opacity-70 transition-[color,opacity] duration-[var(--t-ui)] motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          {expanded ? t("showLess") : t("viewAllMembers", { count: members.length })}
        </button>
      )}
    </section>
  );
}
