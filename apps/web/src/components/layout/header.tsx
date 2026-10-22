"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { UserMenu } from "./user-menu";
import { LanguageSwitcher } from "./language-switcher";
import { ThemeButton } from "./theme-toggle";
import { FishMark } from "./fish-mark";

type Props = {
  user: { id: string; email?: string; display_name?: string; avatar_url?: string } | null;
};


export function Header({ user }: Props) {
  const t = useTranslations();

  return (
    <header className="sticky top-0 z-40 w-full" style={{ background: "var(--surface)" }}>
      <div className="mx-auto flex h-[60px] max-w-[1280px] items-center gap-2 px-3 sm:gap-3 sm:px-4 lg:gap-5 lg:px-8 xl:gap-7 xl:px-12">
        {/* Signed in, the sidebar carries the logo on desktop. */}
        <Link href="/" className={`flex shrink-0 items-center gap-2 whitespace-nowrap sm:gap-2.5 active:opacity-75 ${user ? "lg:hidden" : ""}`} style={{ color: "var(--text)" }}>
          <span style={{ color: "var(--accent)" }}><FishMark /></span>
          <span className="font-serif-display text-name font-bold sm:text-subhead">Go Pesca</span>
        </Link>

        <span className="flex-1" />

        <Link href="/species" aria-label={t("common.search")} className="hidden lg:block active:opacity-75" style={{ color: "var(--muted)" }}>
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" aria-hidden="true">
            <circle cx="11" cy="11" r="6.5" /><path d="m20 20-4.2-4.2" />
          </svg>
        </Link>

        {/* Signed-out: drop the language toggle on very narrow phones so the sign-up button never clips */}
        <span className={user ? "contents" : "contents max-[374px]:hidden"}>
          <LanguageSwitcher />
        </span>
        <ThemeButton />

        {user ? (
          <>
            <UserMenu displayName={user.display_name ?? user.email?.split("@")[0] ?? ""} avatarUrl={user.avatar_url} userId={user.id} />
          </>
        ) : (
          <div className="flex items-center gap-2.5 sm:gap-3">
            <Link href="/auth/login" className="whitespace-nowrap text-small font-medium text-muted hover:text-text active:text-text transition-colors duration-[var(--t-ui)] motion-reduce:transition-none">{t("common.login")}</Link>
            <Link href="/auth/register" className="inline-flex h-10 items-center whitespace-nowrap rounded-full bg-accent px-3.5 text-small font-semibold text-on-primary hover:bg-accent-hi active:bg-accent-hi active:scale-[0.97] transition-[background-color,transform] duration-[var(--t-press)] ease-[var(--ease-out)] motion-reduce:transition-none motion-reduce:active:scale-100 sm:px-5">{t("common.register")}</Link>
          </div>
        )}
      </div>
    </header>
  );
}
