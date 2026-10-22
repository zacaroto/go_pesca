"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { FishMark } from "./fish-mark";
import { NAV_ICONS, NAV_SECTIONS, isNavActive } from "./nav-items";

/** Desktop (lg+) navigation for signed-in anglers: fixed left rail grouped by section, log-catch at the bottom. */
export function Sidebar() {
  const t = useTranslations("nav");
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 flex-col border-r border-rule bg-surface px-3 py-4 lg:flex">
      <Link href="/" className="mb-5 flex items-center gap-2.5 rounded-[var(--r-control)] px-3 py-1.5 text-text active:opacity-75">
        <span className="text-accent">
          <FishMark />
        </span>
        <span className="font-serif-display text-subhead font-bold">Go Pesca</span>
      </Link>

      <nav aria-label={t("main")} className="flex flex-1 flex-col gap-0.5 overflow-y-auto">
        {NAV_SECTIONS.map((section) => (
          <div key={section.key ?? "top"} className="flex flex-col gap-0.5">
            {section.key && <p className="m-0 mt-4 mb-1 px-3 text-label font-semibold text-faint">{t(`sections.${section.key}`)}</p>}
            {section.items.map((item) => {
              const active = isNavActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className="flex items-center gap-3 rounded-[var(--r-control)] px-3 py-2 text-small font-medium text-muted hover:bg-raised hover:text-text active:scale-[0.98] aria-[current=page]:bg-accent-soft aria-[current=page]:font-semibold aria-[current=page]:text-accent-ink focus-visible:outline-2 focus-visible:outline-offset-2 transition-[background-color,color,transform] duration-[var(--t-ui)] motion-reduce:transition-none motion-reduce:active:scale-100"
                >
                  {item.icon}
                  {t(item.key)}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <Link
        href="/catches/new"
        className="mt-4 flex items-center justify-center gap-2 rounded-[var(--r-control)] bg-accent px-3 py-2.5 text-small font-semibold text-on-primary hover:bg-accent-hi active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 transition-[background-color,transform] duration-[var(--t-press)] motion-reduce:transition-none motion-reduce:active:scale-100"
      >
        {NAV_ICONS.plus}
        {t("logCatch")}
      </Link>
    </aside>
  );
}
