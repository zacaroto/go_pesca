"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { useRouter, Link } from "@/i18n/navigation";

type Props = {
  displayName: string;
  userId: string;
};

export function UserMenu({ displayName, userId }: Props) {
  const t = useTranslations();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        aria-label={displayName}
        aria-expanded={open}
        className="flex items-center gap-2 rounded-full text-sm hover:opacity-80 active:opacity-75 focus-visible:outline-2 focus-visible:outline-offset-2"
        style={{ color: "var(--text)", transition: "opacity var(--t-ui)" }}
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full font-semibold"
          style={{ background: "var(--accent-soft)", color: "var(--accent-ink)" }}>
          {displayName.charAt(0).toUpperCase()}
        </span>
        <span className="hidden max-w-[12ch] truncate xl:inline">{displayName}</span>
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full z-20 mt-1 w-48 overflow-hidden border shadow-lg"
            style={{ background: "var(--surface)", borderColor: "var(--border)", borderRadius: "var(--r-card)", color: "var(--text)" }}>
            <Link
              href={`/profile/${userId}` as "/profile/[userId]"}
              className="block px-4 py-2 text-sm hover:bg-[var(--raised)]"
              onClick={() => setOpen(false)}
            >
              {t("profile.myProfile")}
            </Link>
            <Link
              href="/catches/new"
              className="block px-4 py-2 text-sm hover:bg-[var(--raised)]"
              onClick={() => setOpen(false)}
            >
              {t("catches.newCatch")}
            </Link>
            <hr style={{ borderColor: "var(--rule)" }} />
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-sm hover:bg-[var(--raised)]"
              style={{ color: "var(--negative)" }}
            >
              {t("common.logout")}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
