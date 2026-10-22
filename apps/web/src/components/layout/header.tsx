"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { UserMenu } from "./user-menu";
import { LanguageSwitcher } from "./language-switcher";
import { FishMark } from "./fish-mark";

type Props = {
  user: { id: string; email?: string; display_name?: string; avatar_url?: string } | null;
};

const NAV = [
  { href: "/", key: "home" },
  { href: "/pokedex", key: "pokedex" },
  { href: "/community", key: "community" },
  { href: "/groups", key: "groups" },
  { href: "/species", key: "species" },
] as const;

export function Header({ user }: Props) {
  const t = useTranslations();
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");

  return (
    <header className="sticky top-0 z-40 w-full" style={{ background: "var(--surface)" }}>
      <div className="mx-auto flex h-[60px] max-w-[1280px] items-center gap-2 px-3 sm:gap-3 sm:px-4 lg:gap-5 lg:px-8 xl:gap-7 xl:px-12">
        <Link href="/" className="flex shrink-0 items-center gap-2 whitespace-nowrap sm:gap-2.5 active:opacity-75" style={{ color: "var(--text)" }}>
          <span style={{ color: "var(--accent)" }}><FishMark /></span>
          <span className="font-serif-display text-name font-bold sm:text-subhead">Go Pesca</span>
        </Link>

        {user && (
          <nav className="hidden gap-1 md:flex" aria-label={t("nav.main")}>
            {NAV.map(({ href, key }) => {
              const active = isActive(href);
              return (
                <Link key={href} href={href}
                  className={`rounded-full px-2 py-2 text-small lg:px-3 hover:bg-raised hover:text-text active:bg-raised transition-[color,background-color] duration-[var(--t-ui)] motion-reduce:transition-none ${
                    active ? "font-semibold text-text" : "font-normal text-muted"
                  }`}
                  aria-current={active ? "page" : undefined}>
                  {t(`nav.${key}`)}
                </Link>
              );
            })}
          </nav>
        )}

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

        {user ? (
          <>
            <Link href="/catches/new" aria-label={t("nav.logCatch")}
              className="hidden h-10 w-10 items-center justify-center gap-2 rounded-full bg-accent px-0 lg:w-auto lg:px-5 text-small font-semibold text-on-primary hover:bg-accent-hi active:bg-accent-hi active:scale-[0.97] transition-[background-color,transform] duration-[var(--t-press)] ease-[var(--ease-out)] motion-reduce:transition-none motion-reduce:active:scale-100 focus-visible:outline-2 focus-visible:outline-offset-2 sm:inline-flex">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>
              <span className="hidden lg:inline">{t("nav.logCatch")}</span>
            </Link>
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
