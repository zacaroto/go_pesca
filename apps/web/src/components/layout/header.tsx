"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { UserMenu } from "./user-menu";
import { LanguageSwitcher } from "./language-switcher";
import { FishMark } from "./fish-mark";

type Props = {
  user: { id: string; email?: string; display_name?: string } | null;
  rankData?: { caught: number; total: number };
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
      <div className="mx-auto flex h-[60px] max-w-[1280px] items-center gap-3 px-4 sm:gap-7 sm:px-12">
        <Link href="/" className="flex shrink-0 items-center gap-2.5 whitespace-nowrap active:opacity-75" style={{ color: "var(--text)" }}>
          <span style={{ color: "var(--accent)" }}><FishMark /></span>
          <span className="font-serif-display" style={{ fontWeight: 700, fontSize: 20 }}>Go Pesca</span>
        </Link>

        {user && (
          <nav className="hidden gap-1 sm:flex" aria-label={t("nav.home")}>
            {NAV.map(({ href, key }) => {
              const active = isActive(href);
              return (
                <Link key={href} href={href}
                  className="rounded-full px-3 py-2 text-sm hover:bg-[var(--raised)] active:opacity-75"
                  style={{
                    color: active ? "var(--text)" : "var(--muted)",
                    fontWeight: active ? 600 : 400,
                    transition: "color var(--t-ui), background-color var(--t-ui)",
                  }}
                  aria-current={active ? "page" : undefined}>
                  {t(`nav.${key}`)}
                </Link>
              );
            })}
          </nav>
        )}

        <span className="flex-1" />

        <Link href="/species" aria-label={t("common.search")} className="hidden sm:block active:opacity-75" style={{ color: "var(--muted)" }}>
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" aria-hidden="true">
            <circle cx="11" cy="11" r="6.5" /><path d="m20 20-4.2-4.2" />
          </svg>
        </Link>

        <LanguageSwitcher />

        {user ? (
          <>
            <Link href="/catches/new"
              className="hidden h-10 items-center gap-2 rounded-full px-5 text-sm font-semibold active:scale-[0.97] sm:inline-flex"
              style={{ background: "var(--accent)", color: "var(--on-primary)", transition: "background-color var(--t-ui), transform var(--t-press)" }}>
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>
              {t("nav.logCatch")}
            </Link>
            <UserMenu displayName={user.display_name ?? user.email ?? ""} userId={user.id} />
          </>
        ) : (
          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/auth/login" className="whitespace-nowrap text-sm font-medium active:opacity-75" style={{ color: "var(--muted)" }}>{t("common.login")}</Link>
            <Link href="/auth/register" className="inline-flex h-10 items-center whitespace-nowrap rounded-full px-4 text-sm font-semibold active:scale-[0.97] sm:px-5"
              style={{ background: "var(--accent)", color: "var(--on-primary)" }}>{t("common.register")}</Link>
          </div>
        )}
      </div>
    </header>
  );
}
