"use client";

import { useTranslations } from "next-intl";
import { FishMark } from "@/components/layout/fish-mark";
import type { CatchInsight } from "@/lib/catch-insight";
import type { RankInfo } from "@/lib/rank";
import type { PickedSpecies } from "./species-picker";
import { RegulationTag } from "@/components/species/regulation-tag";

const ROMAN = { 1: "I", 2: "II", 3: "III" } as const;

type Props = {
  photoUrl: string | null;
  species: PickedSpecies | null;
  weightKg: string;
  lengthCm: string;
  locationName: string;
  catchDate: string;
  bait: string;
  insight: CatchInsight;
  rankUp?: RankInfo | null;
  locale: string;
};

/** Insight block, also rendered alone above the Next button on phones. */
export function CatchInsightBlock({ insight, rankUp = null }: { insight: CatchInsight; rankUp?: RankInfo | null }) {
  const t = useTranslations("catches");
  const tRank = useTranslations("rank");
  if (insight.kind === "none") return null;

  const accent = insight.kind === "new" || insight.kind === "record";
  const title =
    insight.kind === "new" ? t("insightNewTitle")
    : insight.kind === "record" ? t("insightRecordTitle")
    : t("insightKnownTitle");
  const body =
    insight.kind === "new" ? t("insightNewBody", { count: insight.caughtAfter })
    : insight.kind === "record" ? t("insightRecordBody", { kg: insight.previousBestKg })
    : insight.bestKg === null ? t("insightKnownNoWeight")
    : t("insightKnownBody", { kg: insight.bestKg });

  return (
    <div
      role="status"
      className={`rounded-[var(--r-control)] px-3.5 py-3 text-[13px] ${
        accent ? "bg-[var(--accent-soft)] text-[var(--accent-ink)]" : "bg-[var(--ground)] text-[var(--muted)]"
      }`}
    >
      <b className="block text-sm font-semibold">{title}</b>
      <span className="tabular-nums">{body}</span>
      {rankUp && (
        <span className="mt-1.5 block font-semibold motion-safe:animate-[rank-up_500ms_var(--ease-spring)]">
          {tRank("rankUp", { rank: `${tRank(rankUp.key)} ${ROMAN[rankUp.level]}` })}
        </span>
      )}
    </div>
  );
}

function formatDate(dateStr: string, locale: string): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return "";
  const d = new Date(`${dateStr}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString(locale, { day: "numeric", month: "long", timeZone: "UTC" });
}

export function CatchPreview({ photoUrl, species, weightKg, lengthCm, locationName, catchDate, bait, insight, rankUp = null, locale }: Props) {
  const t = useTranslations("catches");
  const dash = "—";
  const date = formatDate(catchDate, locale);
  const meta = [bait.trim(), date].filter(Boolean).join(" · ");

  return (
    <aside className="hidden lg:block lg:sticky lg:top-20 bg-[var(--surface)] rounded-[var(--r-card)] p-6">
      <p className="text-[13px] text-[var(--muted)] mb-3">{t("previewTitle")}</p>
      <div className="h-[220px] rounded-[3px] overflow-hidden mb-[18px] bg-[var(--ground)] flex items-center justify-center text-[var(--silhouette)]">
        {photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photoUrl} alt="" className="w-full h-full object-cover" />
        ) : (
          <FishMark className="w-16 h-16" />
        )}
      </div>
      <h2 className="font-serif-display font-display text-[40px] leading-none text-[var(--text)] break-words">
        {species?.name ?? dash}
      </h2>
      {species && <p className="sci-name text-sm mt-1.5">{species.scientific_name}</p>}
      {species?.regulation && <RegulationTag regulation={species.regulation} className="mt-3" />}

      <dl className="grid grid-cols-3 gap-3 mt-5 text-sm tabular-nums">
        <div>
          <dt className="text-xs text-[var(--muted)]">{t("weight")}</dt>
          <dd className="font-semibold text-[var(--text)]">{weightKg || dash}</dd>
        </div>
        <div>
          <dt className="text-xs text-[var(--muted)]">{t("length")}</dt>
          <dd className="font-semibold text-[var(--text)]">{lengthCm || dash}</dd>
        </div>
        <div className="min-w-0">
          <dt className="text-xs text-[var(--muted)]">{t("location")}</dt>
          <dd className="font-semibold text-[var(--text)] truncate">{locationName || dash}</dd>
        </div>
      </dl>
      {meta && <p className="mt-3 text-[13px] text-[var(--muted)]">{meta}</p>}

      {insight.kind !== "none" && (
        <div className="mt-4">
          <CatchInsightBlock insight={insight} rankUp={rankUp} />
        </div>
      )}
    </aside>
  );
}
