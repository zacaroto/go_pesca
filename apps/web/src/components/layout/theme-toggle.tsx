"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { THEME_KEY, applyTheme, parseTheme, type ThemeChoice } from "@/lib/theme";

const ICONS: Record<ThemeChoice, React.ReactNode> = {
  system: (
    <>
      <rect x="3" y="4" width="18" height="12" rx="1.5" />
      <path d="M8 20h8M12 16v4" />
    </>
  ),
  light: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </>
  ),
  dark: <path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z" />,
};

function Icon({ choice }: { choice: ThemeChoice }) {
  return (
    <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {ICONS[choice]}
    </svg>
  );
}

/** The stored choice; null until mounted so server and client render the same markup. */
function useThemeChoice(): [ThemeChoice | null, (c: ThemeChoice) => void] {
  const [choice, setChoice] = useState<ThemeChoice | null>(null);
  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = localStorage.getItem(THEME_KEY);
    } catch {
      // Storage blocked: treat as "system".
    }
    // Reading browser-only state after mount is the point of this effect.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setChoice(parseTheme(stored));
  }, []);
  return [
    choice,
    (c) => {
      applyTheme(c);
      setChoice(c);
    },
  ];
}

/** Three-way System / Light / Dark switch for the footer. */
export function ThemeSwitch() {
  const t = useTranslations("theme");
  const [choice, setChoice] = useThemeChoice();
  const options: ThemeChoice[] = ["system", "light", "dark"];
  return (
    <div role="group" aria-label={t("label")} className="inline-flex rounded-[var(--r-pill)] bg-[rgb(255_255_255/0.08)] p-1">
      {options.map((o) => (
        <button
          key={o}
          type="button"
          aria-pressed={choice === o}
          onClick={() => setChoice(o)}
          className="inline-flex items-center gap-1.5 rounded-[var(--r-pill)] px-3 py-1.5 text-label font-medium text-[var(--footer-muted)] hover:text-[var(--footer-text)] aria-pressed:bg-[var(--footer-text)] aria-pressed:text-[var(--footer-bg)] active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 transition-[background-color,color,transform] duration-[var(--t-ui)] motion-reduce:transition-none motion-reduce:active:scale-100"
        >
          <Icon choice={o} />
          {t(o)}
        </button>
      ))}
    </div>
  );
}

/** Header button: flips between light and dark (from "system" it flips away from what the OS shows). */
export function ThemeButton() {
  const t = useTranslations("theme");
  const [choice, setChoice] = useThemeChoice();

  function toggle() {
    const showingDark =
      choice === "dark" || (choice !== "light" && window.matchMedia("(prefers-color-scheme: dark)").matches);
    setChoice(showingDark ? "light" : "dark");
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={t("toggle")}
      title={t("toggle")}
      className="hidden h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border text-muted hover:bg-raised hover:text-text active:bg-raised active:scale-[0.95] focus-visible:outline-2 focus-visible:outline-offset-2 transition-[background-color,color,transform] duration-[var(--t-ui)] motion-reduce:transition-none motion-reduce:active:scale-100 sm:inline-flex"
    >
      {/* Moon in light, sun in dark; CSS picks so the first paint is right before hydration. */}
      <span className="theme-icon-moon"><Icon choice="dark" /></span>
      <span className="theme-icon-sun"><Icon choice="light" /></span>
    </button>
  );
}
