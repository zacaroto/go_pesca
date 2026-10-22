"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { getNextRank, getRank } from "@/lib/rank";

const ROMAN = { 1: "I", 2: "II", 3: "III" } as const;
const RADIUS = 42;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

type Props = { caught: number; total: number };

/** Collection ring (% of the catalog caught) next to the angler's rank, level pips and next goal. */
export function RankRing({ caught, total }: Props) {
  const t = useTranslations("rank");
  const rank = getRank(caught);
  const next = getNextRank(caught);
  const share = total > 0 ? Math.min(caught / total, 1) : 0;
  const percent = Math.round(share * 100);

  // Start empty and fill on mount so the ring draws in; reduced motion skips the transition via CSS.
  const [drawn, setDrawn] = useState(0);
  useEffect(() => {
    const frame = requestAnimationFrame(() => setDrawn(share));
    return () => cancelAnimationFrame(frame);
  }, [share]);

  const rankName = `${t(rank.key)} ${ROMAN[rank.level]}`;
  const nextText = next
    ? t("nextStep", { count: next.speciesNeeded, rank: `${t(next.key)} ${ROMAN[next.level]}` })
    : t("maxRank");

  return (
    <div className="flex items-center gap-4" role="group" aria-label={`${t("title")}: ${rankName}. ${nextText}`}>
      <svg viewBox="0 0 100 100" className="h-[84px] w-[84px] shrink-0" aria-hidden="true">
        <circle cx="50" cy="50" r={RADIUS} fill="none" strokeWidth="8" className="stroke-raised" />
        <circle
          cx="50"
          cy="50"
          r={RADIUS}
          fill="none"
          strokeWidth="8"
          strokeLinecap="round"
          className="stroke-progress origin-center -rotate-90 transition-[stroke-dashoffset] duration-700 ease-[var(--ease-out)] motion-reduce:transition-none"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE * (1 - drawn)}
        />
        <text x="50" y="57" textAnchor="middle" className="fill-text font-serif-display" style={{ fontSize: 22, fontWeight: 700 }}>
          {percent}%
        </text>
      </svg>
      <div className="min-w-0">
        <p className="m-0 font-serif-display text-subhead font-bold leading-tight text-text">
          {t(rank.key)} <span className="text-name text-faint">{ROMAN[rank.level]}</span>
        </p>
        <div className="my-2 flex gap-1" aria-hidden="true">
          {([1, 2, 3] as const).map((level) => (
            <span
              key={level}
              className={`h-1 w-4 rounded-sm ${level <= rank.level ? "bg-progress" : "bg-raised"}`}
            />
          ))}
        </div>
        <p className="m-0 text-label text-muted tabular-nums">{nextText}</p>
      </div>
    </div>
  );
}
