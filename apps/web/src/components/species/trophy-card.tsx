import { useTranslations } from "next-intl";

type Props = {
  weightKg: number | null;
  lengthCm: number | null;
  note: string | null;
  sourceUrl: string | null;
  locale: string;
};

/** "When is it a trophy?" panel on the species page. Renders nothing without a threshold or note. */
export function TrophyCard({ weightKg, lengthCm, note, sourceUrl, locale }: Props) {
  const t = useTranslations("species");
  if (weightKg == null && lengthCm == null && !note) return null;

  const fmt = new Intl.NumberFormat(locale === "en" ? "en" : "es-CR", { maximumFractionDigits: 1 });
  const thresholds = [
    weightKg != null ? `${fmt.format(weightKg)} kg` : null,
    lengthCm != null ? `${fmt.format(lengthCm)} cm` : null,
  ].filter(Boolean) as string[];

  return (
    <section aria-labelledby="trophy-title" className="mb-6 rounded-[var(--r-card)] bg-accent-soft p-5 text-accent-ink sm:p-6">
      <div className="flex items-start gap-4">
        <svg className="mt-1 h-7 w-7 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M7 4h10v5a5 5 0 0 1-10 0z" />
          <path d="M7 6H4a3 3 0 0 0 3 4M17 6h3a3 3 0 0 1-3 4M12 14v3M8.5 20h7l-1-3h-5z" />
        </svg>
        <div className="min-w-0">
          <h2 id="trophy-title" className="m-0 font-serif-display text-xl font-bold">
            {t("trophyTitle")}
          </h2>
          {thresholds.length > 0 ? (
            <p className="mt-1 mb-0 font-serif-display text-3xl font-black tabular-nums text-text">
              {t("trophyFrom", { value: thresholds.join(t("trophyOr")) })}
            </p>
          ) : (
            <p className="mt-1 mb-0 font-semibold text-text">{t("trophyNone")}</p>
          )}
          {note && <p className="mt-2 mb-0 text-[15px] text-text">{note}</p>}
          {sourceUrl && (
            <a
              href={sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-[13px] font-medium underline-offset-2 hover:underline active:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              {t("trophySource")}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
