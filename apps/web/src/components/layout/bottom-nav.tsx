"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { NAV_ICONS, NAV_SECTIONS, isNavActive } from "./nav-items";

const TABS = [
  { href: "/", key: "home", icon: NAV_ICONS.home },
  { href: "/pokedex", key: "pokedex", icon: NAV_ICONS.pokedex },
  { href: "/community", key: "community", icon: NAV_ICONS.community },
] as const;

/** Everything the tab bar doesn't show directly lives in the "Más" sheet. */
const SHEET_ITEMS = [
  ...NAV_SECTIONS.flatMap((s) => s.items).filter((i) => !TABS.some((tab) => tab.href === i.href)),
  { href: "/profile", key: "profile", icon: NAV_ICONS.profile },
];

const tabClass =
  "relative flex flex-1 flex-col items-center justify-center gap-1 text-label font-medium text-muted hover:text-text active:opacity-75 aria-[current=page]:font-semibold aria-[current=page]:text-accent-ink transition-[color,opacity] duration-[var(--t-ui)] motion-reduce:transition-none";

/** Phone and tablet (below lg) tab bar: Inicio, Pescadex, +, Comunidad, Más (bottom sheet). */
export function BottomNav() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);
  const moreActive = SHEET_ITEMS.some((i) => isNavActive(pathname, i.href));

  // Close on route change (a sheet link was followed) and on Escape; focus the sheet when it opens.
  useEffect(() => {
    // Closing the sheet when the route changes is the point of this effect.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpen(false);
  }, [pathname]);
  useEffect(() => {
    if (!open) return;
    sheetRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const activeBar = <span aria-hidden="true" className="absolute top-0 h-[3px] w-6 rounded-b bg-accent" />;

  return (
    <>
      <nav
        aria-label={t("main")}
        className="fixed bottom-0 left-0 z-50 flex min-h-16 w-full items-stretch border-t border-rule bg-surface pb-[env(safe-area-inset-bottom,0px)] lg:hidden"
      >
        {TABS.slice(0, 2).map((tab) => {
          const active = isNavActive(pathname, tab.href);
          return (
            <Link key={tab.href} href={tab.href} aria-current={active ? "page" : undefined} className={tabClass}>
              {active && activeBar}
              {tab.icon}
              {t(tab.key)}
            </Link>
          );
        })}
        <Link
          href="/catches/new"
          aria-label={t("logCatch")}
          className="flex flex-1 items-center justify-center active:scale-95 transition-transform duration-[var(--t-press)] motion-reduce:transition-none"
        >
          <span className="-mt-5 grid h-12 w-12 place-items-center rounded-full bg-accent text-on-primary shadow-[0_0_0_5px_var(--surface)]">{NAV_ICONS.plus}</span>
        </Link>
        {TABS.slice(2).map((tab) => {
          const active = isNavActive(pathname, tab.href);
          return (
            <Link key={tab.href} href={tab.href} aria-current={active ? "page" : undefined} className={tabClass}>
              {active && activeBar}
              {tab.icon}
              {t(tab.key)}
            </Link>
          );
        })}
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-expanded={open}
          aria-haspopup="dialog"
          aria-current={moreActive ? "page" : undefined}
          className={tabClass}
        >
          {moreActive && activeBar}
          {NAV_ICONS.more}
          {t("more")}
        </button>
      </nav>

      {open && (
        <div className="fixed inset-0 z-[60] flex items-end bg-[rgb(14_20_36/0.45)] lg:hidden" onClick={() => setOpen(false)}>
          <div
            ref={sheetRef}
            role="dialog"
            aria-modal="true"
            aria-label={t("moreTitle")}
            tabIndex={-1}
            onClick={(e) => e.stopPropagation()}
            className="w-full rounded-t-[18px] bg-surface px-4 pt-2.5 pb-[calc(1.25rem+env(safe-area-inset-bottom,0px))] outline-none motion-safe:animate-[card-in_220ms_var(--ease-out)]"
          >
            <span aria-hidden="true" className="mx-auto mb-3 block h-1 w-10 rounded-full bg-rule" />
            <ul className="m-0 grid list-none grid-cols-3 gap-2 p-0">
              {SHEET_ITEMS.map((item) => {
                const active = isNavActive(pathname, item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className="flex flex-col items-center gap-1.5 rounded-[10px] bg-ground px-1 py-3.5 text-label font-medium text-text hover:bg-raised active:scale-[0.97] aria-[current=page]:bg-accent-soft aria-[current=page]:text-accent-ink focus-visible:outline-2 focus-visible:outline-offset-2 transition-[background-color,transform] duration-[var(--t-ui)] motion-reduce:transition-none motion-reduce:active:scale-100"
                    >
                      <span className="text-accent">{item.icon}</span>
                      {t(item.key)}
                    </Link>
                  </li>
                );
              })}
            </ul>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="mt-3 w-full rounded-[var(--r-control)] bg-raised py-2.5 text-small font-semibold text-text hover:bg-border active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 transition-[background-color,transform] duration-[var(--t-press)] motion-reduce:transition-none motion-reduce:active:scale-100"
            >
              {t("close")}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
