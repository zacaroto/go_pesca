import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Guide, Knot } from "@/lib/learn.server";

const cardLink =
  "group flex h-full flex-col rounded-[var(--r-card)] bg-surface hover:bg-raised active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-2 transition-[background-color,transform] duration-[var(--t-ui)] ease-[var(--ease-out)] motion-reduce:transition-none motion-reduce:active:scale-100";

export const CHAPTER_ICONS = {
  technique: (
    <>
      <path d="M4 20 18 6M18 6l2-2M14 4l6 6" />
      <circle cx="6" cy="18" r="2" />
    </>
  ),
  knots: <path d="M6 4c0 6 12 6 12 12a4 4 0 0 1-8 0c0-3 4-4 4-8" />,
  where_when: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="1.5" />
      <path d="M3 10h18M8 3v4M16 3v4" />
    </>
  ),
};

function Check() {
  return (
    <svg className="h-4 w-4 shrink-0 text-progress" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m5 12 5 5 9-10" />
    </svg>
  );
}

export function GuideCard({ guide, locale, done }: { guide: Guide; locale: string; done: boolean }) {
  const t = useTranslations("learn");
  const en = locale === "en";
  return (
    <Link href={`/learn/guides/${guide.slug}`} className={`${cardLink} gap-2 p-5`}>
      <span className="flex items-center gap-2 text-label text-muted">
        {t(guide.chapter === "technique" ? "chapterTechnique" : "chapterWhereWhen")} · {t("minutes", { count: guide.read_minutes })}
        {done && (
          <span className="ml-auto inline-flex items-center gap-1 text-text">
            <Check />
            {t("learned")}
          </span>
        )}
      </span>
      <h3 className="m-0 font-serif-display text-name font-bold leading-tight text-text">{en ? guide.title_en : guide.title_es}</h3>
      <p className="m-0 text-small text-muted">{en ? guide.summary_en : guide.summary_es}</p>
    </Link>
  );
}

export function KnotCard({ knot, locale, done }: { knot: Knot; locale: string; done: boolean }) {
  const t = useTranslations("learn");
  const en = locale === "en";
  return (
    <Link href={`/learn/knots/${knot.slug}`} className={`${cardLink} gap-2 p-5`}>
      <span className="flex items-center gap-2 text-label text-muted">
        {t(`difficulty${knot.difficulty}`)} · {t("stepsCount", { count: knot.steps.length })}
        {done && (
          <span className="ml-auto inline-flex items-center gap-1 text-text">
            <Check />
            {t("learned")}
          </span>
        )}
      </span>
      <h3 className="m-0 font-serif-display text-name font-bold leading-tight text-text">{en ? knot.name_en : knot.name_es}</h3>
      <p className="m-0 text-small text-muted">{en ? knot.best_for_en : knot.best_for_es}</p>
    </Link>
  );
}

type ChapterProps = {
  href: string;
  icon: keyof typeof CHAPTER_ICONS;
  title: string;
  body: string;
  status: string;
  /** 0..1, or null to hide the bar (signed out or nothing to track). */
  progress: number | null;
};

export function ChapterCard({ href, icon, title, body, status, progress }: ChapterProps) {
  return (
    <Link href={href} className={`${cardLink} min-h-[200px] gap-2.5 p-6`}>
      <svg className="h-8 w-8 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {CHAPTER_ICONS[icon]}
      </svg>
      <h2 className="m-0 font-serif-display text-subhead font-bold leading-tight text-text">{title}</h2>
      <p className="m-0 text-small text-muted">{body}</p>
      <span className="mt-auto text-label text-muted">{status}</span>
      {progress !== null && (
        <span className="block h-1.5 overflow-hidden rounded-full bg-raised" aria-hidden="true">
          <span className="block h-full rounded-full bg-progress" style={{ width: `${Math.round(progress * 100)}%` }} />
        </span>
      )}
    </Link>
  );
}
