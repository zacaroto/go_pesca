"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import type { SpeciesLink } from "@/lib/species-neighbors";

type Props = { prev: SpeciesLink; next: SpeciesLink };

const CHEVRON_L = <path d="M15 5l-7 7 7 7" />;
const CHEVRON_R = <path d="M9 5l7 7-7 7" />;

function Chevron({ children }: { children: React.ReactNode }) {
  return (
    <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {children}
    </svg>
  );
}

const PILL =
  "inline-flex h-9 max-w-[14rem] items-center gap-1.5 rounded-full bg-surface px-3 text-small font-medium text-text hover:bg-raised active:scale-[0.97] transition-[background-color,transform] duration-[var(--t-ui)] motion-reduce:transition-none motion-reduce:active:scale-100 focus-visible:outline-2 focus-visible:outline-offset-2";

/** Compact prev/next pills for the top bar; ←/→ keys navigate too (ignored while typing). */
export function SpeciesPagerTop({ prev, next }: Props) {
  const t = useTranslations("species");
  const router = useRouter();

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
      const el = e.target as HTMLElement | null;
      if (el && (el.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(el.tagName))) return;
      if (e.key === "ArrowLeft") router.push(`/species/${prev.id}`);
      if (e.key === "ArrowRight") router.push(`/species/${next.id}`);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [router, prev.id, next.id]);

  return (
    <nav aria-label={t("pagerLabel")} className="flex items-center gap-2">
      <Link href={`/species/${prev.id}`} className={PILL} aria-label={t("prevSpecies", { name: prev.name })}>
        <Chevron>{CHEVRON_L}</Chevron>
        <span className="hidden truncate sm:inline">{prev.name}</span>
      </Link>
      <Link href={`/species/${next.id}`} className={PILL} aria-label={t("nextSpecies", { name: next.name })}>
        <span className="hidden truncate sm:inline">{next.name}</span>
        <Chevron>{CHEVRON_R}</Chevron>
      </Link>
    </nav>
  );
}

const CARD =
  "group flex min-w-0 flex-col gap-1 rounded-[var(--r-card)] bg-surface p-5 hover:bg-raised active:scale-[0.99] transition-[background-color,transform] duration-[var(--t-ui)] motion-reduce:transition-none motion-reduce:active:scale-100 focus-visible:outline-2 focus-visible:outline-offset-2";

/** Larger prev/next cards for the end of the page. */
export function SpeciesPagerBottom({ prev, next }: Props) {
  const t = useTranslations("species");
  return (
    <nav aria-label={t("pagerLabel")} className="grid grid-cols-2 gap-4">
      <Link href={`/species/${prev.id}`} className={CARD}>
        <span className="flex items-center gap-1.5 text-label text-muted">
          <Chevron>{CHEVRON_L}</Chevron>
          {t("previous")}
        </span>
        <span className="truncate font-serif-display text-subhead font-bold">{prev.name}</span>
      </Link>
      <Link href={`/species/${next.id}`} className={`${CARD} items-end text-right`}>
        <span className="flex items-center gap-1.5 text-label text-muted">
          {t("next")}
          <Chevron>{CHEVRON_R}</Chevron>
        </span>
        <span className="max-w-full truncate font-serif-display text-subhead font-bold">{next.name}</span>
      </Link>
    </nav>
  );
}
