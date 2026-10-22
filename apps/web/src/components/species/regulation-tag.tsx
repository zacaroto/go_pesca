import { useTranslations } from "next-intl";
import type { Regulation } from "@/lib/regulation";

const ICON = {
  // Hook with a return arrow: the fish goes back.
  release: (
    <>
      <path d="M9 4v9a4 4 0 0 0 8 0v-2" />
      <path d="M15 13l2-2 2 2" />
      <path d="M5 20h8" />
    </>
  ),
  // Shield: protected by a rule.
  regulated: <path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6z" />,
};

type TagProps = { regulation: Regulation | null; className?: string };

/** Pill that tells anglers a species must be released or is under legal limits. Renders nothing without a rule. */
export function RegulationTag({ regulation, className = "" }: TagProps) {
  const t = useTranslations("regulation");
  if (!regulation) return null;
  return (
    <span
      data-regulation={regulation}
      className={`pill-regulation inline-flex items-center gap-1.5 rounded-[var(--r-pill)] px-3 py-1 text-label font-semibold ${className}`}
    >
      <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {ICON[regulation]}
      </svg>
      {t(regulation)}
    </span>
  );
}

type CardProps = { regulation: Regulation | null; note: string | null; sourceUrl: string | null };

/** Species-page panel with the legal rule and its source. */
export function RegulationCard({ regulation, note, sourceUrl }: CardProps) {
  const t = useTranslations("regulation");
  if (!regulation) return null;
  return (
    <section
      aria-labelledby="regulation-title"
      data-regulation={regulation}
      className="pill-regulation mb-6 rounded-[var(--r-card)] p-5 sm:p-6"
    >
      <h2 id="regulation-title" className="m-0 flex items-center gap-2 font-serif-display text-subhead font-bold">
        <svg className="h-6 w-6 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          {ICON[regulation]}
        </svg>
        {t(regulation === "release" ? "releaseTitle" : "regulatedTitle")}
      </h2>
      {regulation === "release" && <p className="mt-2 mb-0 font-semibold text-text">{t("releaseHint")}</p>}
      {note && <p className="mt-2 mb-0 text-body text-text">{note}</p>}
      {sourceUrl && (
        <a
          href={sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-block text-label font-medium underline-offset-2 hover:underline active:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          {t("source")}
        </a>
      )}
    </section>
  );
}
