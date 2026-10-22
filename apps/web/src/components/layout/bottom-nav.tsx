"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";

const TABS = [
  {
    href: "/",
    labelKey: "nav.home",
    icon: (active: boolean) => (
      <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" />
        <path d="M9 21V12h6v9" />
      </svg>
    ),
  },
  {
    href: "/pokedex",
    labelKey: "nav.pokedex",
    icon: (active: boolean) => (
      <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    href: "/community",
    labelKey: "nav.community",
    icon: (active: boolean) => (
      <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    href: "/profile",
    labelKey: "nav.profile",
    icon: (active: boolean) => (
      <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
      </svg>
    ),
  },
];

export function BottomNav() {
  const t = useTranslations();
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
  }

  function renderTab(tab: (typeof TABS)[number]) {
    const active = isActive(tab.href);
    return (
      <Link
        key={tab.href}
        href={tab.href}
        aria-current={active ? "page" : undefined}
        className={`flex flex-col items-center justify-center flex-1 gap-1 hover:text-text active:opacity-75 transition-[color,opacity] duration-[var(--t-ui)] motion-reduce:transition-none ${
          active ? "font-semibold text-text" : "font-normal text-muted"
        }`}
      >
        {tab.icon(active)}
        <span
          style={{
            fontSize: "11px",
            fontWeight: "inherit",
            lineHeight: 1,
          }}
        >
          {t(tab.labelKey)}
        </span>
      </Link>
    );
  }

  return (
    <nav
      className="fixed bottom-0 left-0 w-full flex justify-around items-stretch z-50 md:hidden"
      style={{
        background: "var(--surface)",
        minHeight: "64px",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}
    >
      {TABS.slice(0, 2).map(renderTab)}
      <Link href="/catches/new" aria-label={t("nav.logCatch")} className="flex flex-1 items-center justify-center active:scale-95"
        style={{ transition: "transform var(--t-press)" }}>
        <span className="grid h-12 w-12 place-items-center rounded-full" style={{ background: "var(--accent)", color: "var(--on-primary)" }}>
          <svg className="h-[22px] w-[22px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>
        </span>
      </Link>
      {TABS.slice(2).map(renderTab)}
    </nav>
  );
}
