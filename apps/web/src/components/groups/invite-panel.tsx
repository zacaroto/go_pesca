"use client";

import { useTranslations } from "next-intl";
import { MAX_MEMBERS } from "@/lib/groups";
import { useInviteLink } from "./use-invite-link";

export function InvitePanel({ inviteCode, locale, memberCount }: { inviteCode: string; locale: string; memberCount: number }) {
  const t = useTranslations("groups");
  const { copy, copied, failed } = useInviteLink(inviteCode, locale);
  const full = memberCount >= MAX_MEMBERS;

  return (
    <section className="rounded-[var(--r-card)] bg-surface p-5" aria-labelledby="group-invite-title">
      <h2 id="group-invite-title" className="m-0 mb-1.5 font-serif-display text-subhead font-bold">
        {t("inviteTitle")}
      </h2>
      <p className="m-0 mb-3 text-label text-muted">{full ? t("groupFull") : t("inviteHelp", { max: MAX_MEMBERS })}</p>
      {!full && (
        <button
          type="button"
          onClick={copy}
          className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-full bg-accent text-small font-semibold text-on-primary hover:bg-accent-hi active:scale-[0.98] transition-[background-color,transform] duration-[var(--t-press)] motion-reduce:transition-none motion-reduce:active:scale-100 focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          <span aria-live="polite">{copied ? t("copied") : t("copyLink")}</span>
        </button>
      )}
      {failed && (
        <p role="alert" className="mt-2 mb-0 text-label text-negative">
          {t("copyError", { code: inviteCode })}
        </p>
      )}
    </section>
  );
}
