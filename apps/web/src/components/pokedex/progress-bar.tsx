"use client";

import { useEffect, useRef } from "react";
import { getRank } from "@/lib/rank";

type Props = {
  caught: number;
  total: number;
};

const NEXT_RANK_THRESHOLDS = [7, 13, 20, 27, 33, 40, 47, 53, 60, 67, 73, 80, 87, 93, 100];

export function ProgressBar({ caught, total }: Props) {
  const pct = total > 0 ? Math.round((caught / total) * 100) : 0;
  const { key: rankKey } = getRank(caught, total);
  const barRef = useRef<HTMLDivElement>(null);

  const nextThreshold = NEXT_RANK_THRESHOLDS.find((th) => th > pct);
  const speciesNeeded = nextThreshold
    ? Math.ceil((nextThreshold / 100) * total) - caught
    : 0;

  // Progress bar animates from 0 to actual on mount (400ms ease-out)
  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;
    bar.style.width = "0%";
    const raf = requestAnimationFrame(() => {
      bar.style.transition = "width 400ms var(--ease-out)";
      bar.style.width = `${Math.max(pct, 2)}%`;
    });
    return () => cancelAnimationFrame(raf);
  }, [pct]);

  return (
    <section style={{ marginBottom: "24px" }}>
      {/* KPI strip — 3 cells */}
      <div
        className="grid grid-cols-3"
        style={{
          background: "var(--surface)",
          borderRadius: "var(--r-card)",
          border: "1px solid var(--border)",
          overflow: "hidden",
          marginBottom: "12px",
        }}
      >
        {[
          { label: "Capturadas", value: caught,     accent: true  },
          { label: "Total",       value: total,      accent: false },
          { label: "Completado",  value: `${pct}%`,  accent: false },
        ].map((cell, i) => (
          <div
            key={cell.label}
            style={{
              padding: "16px 12px",
              textAlign: "center",
              borderLeft: i > 0 ? "1px solid var(--border)" : "none",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-inter), system-ui, sans-serif",
                fontWeight: 700,
                fontSize: "26px",
                color: cell.accent ? "var(--accent-hi)" : "var(--text)",
                fontVariantNumeric: "tabular-nums",
                letterSpacing: "-0.02em",
                lineHeight: 1,
              }}
            >
              {cell.value}
            </div>
            <div
              style={{
                fontSize: "10px",
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--faint)",
                marginTop: "4px",
              }}
            >
              {cell.label}
            </div>
          </div>
        ))}
      </div>

      {/* Rank card */}
      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "var(--r-card)",
          padding: "var(--pad)",
        }}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {/* Star emblem */}
            <div
              style={{
                width: "32px",
                height: "32px",
                border: "1.5px solid var(--accent)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </div>
            <span
              style={{
                fontFamily: "var(--font-playfair), Georgia, serif",
                fontWeight: 700,
                fontSize: "16px",
                color: "var(--text)",
              }}
            >
              {rankKey}
            </span>
          </div>
          {nextThreshold && speciesNeeded > 0 && (
            <span
              style={{
                fontSize: "11px",
                fontWeight: 500,
                color: "var(--faint)",
              }}
            >
              +{speciesNeeded} para el siguiente
            </span>
          )}
        </div>

        {/* Progress bar — animated from 0 on mount */}
        <div
          style={{
            background: "var(--raised)",
            borderRadius: "var(--r-pill)",
            height: "6px",
            overflow: "hidden",
          }}
        >
          <div
            ref={barRef}
            style={{
              height: "100%",
              background: "var(--accent)",
              borderRadius: "var(--r-pill)",
              width: "0%",
            }}
          />
        </div>
      </div>
    </section>
  );
}
