import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { PersonalRecord } from "@/lib/profile-records";

type Props = { records: PersonalRecord[]; locale: string };

export function TrophyPill({ className = "" }: { className?: string }) {
  const t = useTranslations("profile");
  return (
    <span className={`inline-flex items-center rounded-[var(--r-pill)] px-2.5 py-0.5 text-[13px] font-semibold pill-brack ${className}`}>
      {t("trophy")}
    </span>
  );
}

/** Best catch per species, as a field-guide table. */
export function PersonalRecords({ records, locale }: Props) {
  const t = useTranslations("profile");
  const num = new Intl.NumberFormat(locale === "en" ? "en" : "es-CR", { maximumFractionDigits: 1 });
  const date = (d: string) =>
    new Date(`${d}T00:00:00Z`).toLocaleDateString(locale, { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
  const th = "px-2 py-2 text-left text-[13px] font-medium text-muted";
  const td = "px-2 py-3";

  return (
    <section className="rounded-[var(--r-card)] bg-surface p-5 sm:p-6">
      <h2 className="m-0 mb-2 font-serif-display text-2xl font-bold">{t("records")}</h2>
      {records.length === 0 ? (
        <p className="m-0 text-muted">{t("recordsEmpty")}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[480px] border-collapse text-sm tabular-nums">
            <thead>
              <tr className="border-b border-rule">
                <th className={th}>{t("colSpecies")}</th>
                <th className={th}>{t("colWeight")}</th>
                <th className={th}>{t("colLength")}</th>
                <th className={th}>{t("colDate")}</th>
                <th className={th}><span className="sr-only">{t("trophy")}</span></th>
              </tr>
            </thead>
            <tbody>
              {records.map((r) => (
                <tr key={r.speciesId} className="border-b border-rule last:border-0">
                  <td className={td}>
                    <Link
                      href={`/species/${r.speciesId}`}
                      className="font-serif-display text-base font-bold text-text underline-offset-2 hover:underline active:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-2"
                    >
                      {r.speciesName}
                    </Link>
                  </td>
                  <td className={td}>{r.weightKg != null ? `${num.format(r.weightKg)} kg` : "—"}</td>
                  <td className={td}>{r.lengthCm != null ? `${num.format(r.lengthCm)} cm` : "—"}</td>
                  <td className={`${td} text-muted`}>{date(r.catchDate)}</td>
                  <td className={`${td} text-right`}>{r.trophy && <TrophyPill />}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
