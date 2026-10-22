"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { SeasonRegion } from "@/lib/learn";
import type { SeasonEntry } from "@/lib/learn.server";

type Props = { seasons: SeasonEntry[]; month: number; locale: string };

const REGIONS: SeasonRegion[] = ["pacific", "caribbean", "freshwater"];
const HEAT = ["bg-[var(--heat-0)]", "bg-[var(--heat-1)]", "bg-[var(--heat-2)]", "bg-[var(--heat-3)]"];

/** 12-month × species heatmap per region, current month outlined; rows link to the species page. */
export function SeasonCalendar({ seasons, month, locale }: Props) {
  const t = useTranslations("learn");
  const [region, setRegion] = useState<SeasonRegion>("pacific");
  const monthFmt = new Intl.DateTimeFormat(locale === "en" ? "en" : "es", { month: "narrow", timeZone: "UTC" });
  const monthLong = new Intl.DateTimeFormat(locale === "en" ? "en" : "es", { month: "long", timeZone: "UTC" });
  const months = Array.from({ length: 12 }, (_, i) => new Date(Date.UTC(2026, i, 1)));
  const name = (e: SeasonEntry) => (locale === "en" ? e.species?.name_en : e.species?.name_es) ?? "—";
  const rows = seasons
    .filter((s) => s.region === region && s.species)
    .sort((a, b) => (b.months[month] ?? 0) - (a.months[month] ?? 0) || name(a).localeCompare(name(b), locale));
  const levels = [t("level0"), t("level1"), t("level2"), t("level3")];

  return (
    <div className="flex flex-col gap-4">
      <div role="group" aria-label={t("regionLabel")} className="flex flex-wrap gap-2">
        {REGIONS.map((r) => (
          <button
            key={r}
            type="button"
            aria-pressed={region === r}
            onClick={() => setRegion(r)}
            className="rounded-[var(--r-pill)] bg-surface px-3.5 py-2 text-small font-medium text-text hover:bg-raised aria-pressed:bg-accent aria-pressed:text-on-primary active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 transition-[background-color,color,transform] duration-[var(--t-ui)] motion-reduce:transition-none motion-reduce:active:scale-100"
          >
            {t(`region_${r}`)}
            <span className="ml-1.5 tabular-nums opacity-70">{seasons.filter((s) => s.region === r).length}</span>
          </button>
        ))}
      </div>

      {rows.length === 0 ? (
        <p className="m-0 rounded-[var(--r-card)] bg-surface p-5 text-muted">{t("seasonsEmpty")}</p>
      ) : (
        <div className="overflow-x-auto rounded-[var(--r-card)] bg-surface p-3 sm:p-4">
          <table className="w-full min-w-[640px] border-separate border-spacing-[3px]">
            <caption className="sr-only">{t("calendarCaption")}</caption>
            <thead>
              <tr>
                <th scope="col" className="sr-only">{t("speciesCol")}</th>
                {months.map((d, i) => (
                  <th key={i} scope="col" className={`px-0.5 text-center text-label font-medium ${i === month ? "text-text" : "text-muted"}`} title={monthLong.format(d)}>
                    {monthFmt.format(d)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((e) => (
                <tr key={`${e.species_id}-${e.region}`}>
                  <th scope="row" className="pr-3 text-left font-normal">
                    <Link href={`/species/${e.species_id}`} className="whitespace-nowrap font-serif-display text-small font-bold text-text underline-offset-2 hover:underline">
                      {name(e)}
                    </Link>
                  </th>
                  {e.months.map((level, i) => (
                    <td
                      key={i}
                      title={`${name(e)} · ${monthLong.format(months[i])}: ${levels[level] ?? levels[0]}`}
                      className={`h-6 rounded-[3px] ${HEAT[level] ?? HEAT[0]} ${i === month ? "shadow-[inset_0_0_0_2px_var(--text)]" : ""}`}
                    >
                      <span className="sr-only">{levels[level] ?? levels[0]}</span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-label text-muted">
            {[1, 2, 3].map((l) => (
              <span key={l} className="inline-flex items-center gap-1.5">
                <i className={`inline-block h-3.5 w-3.5 rounded-[3px] ${HEAT[l]}`} />
                {levels[l]}
              </span>
            ))}
            <span className="inline-flex items-center gap-1.5">
              <i className="inline-block h-3.5 w-3.5 rounded-[3px] shadow-[inset_0_0_0_2px_var(--text)]" />
              {t("thisMonth")}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
