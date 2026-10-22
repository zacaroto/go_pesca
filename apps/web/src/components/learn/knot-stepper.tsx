"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import type { KnotStep } from "@/lib/learn.server";

type Props = {
  steps: KnotStep[];
  locale: string;
  imageUrl: string | null;
  imageAlt: string;
  imageCredit: string | null;
  imageSourceUrl: string | null;
};

const navButton =
  "rounded-[var(--r-pill)] px-4 py-2 text-small font-semibold active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-40 disabled:active:scale-100 transition-[background-color,transform] duration-[var(--t-press)] motion-reduce:transition-none motion-reduce:active:scale-100";

/** Knot diagram plus its steps; one step is highlighted and ←/→ buttons walk through them. */
export function KnotStepper({ steps, locale, imageUrl, imageAlt, imageCredit, imageSourceUrl }: Props) {
  const t = useTranslations("learn");
  const [current, setCurrent] = useState(0);
  const text = (s: KnotStep) => (locale === "en" ? s.text_en : s.text_es);
  if (steps.length === 0) return null;

  return (
    <div className="grid items-start gap-5 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      {imageUrl && (
        <figure className="m-0 overflow-hidden rounded-[var(--r-card)] bg-white">
          {/* Diagrams are drawn on white; keep it white in dark mode too so lines stay visible. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imageUrl} alt={imageAlt} className="mx-auto max-h-[420px] w-full object-contain p-3" />
          {imageCredit && (
            <figcaption className="bg-surface px-3 py-2 text-label text-muted">
              {imageSourceUrl ? (
                <a href={imageSourceUrl} target="_blank" rel="noopener noreferrer" className="underline-offset-2 hover:underline">
                  {imageCredit}
                </a>
              ) : (
                imageCredit
              )}
            </figcaption>
          )}
        </figure>
      )}
      <div className={imageUrl ? "" : "md:col-span-2"}>
        <ol className="m-0 flex list-none flex-col gap-1.5 p-0">
          {steps.map((s, i) => (
            <li key={i}>
              <button
                type="button"
                onClick={() => setCurrent(i)}
                aria-current={i === current ? "step" : undefined}
                className="flex w-full gap-3 rounded-[var(--r-control)] px-3 py-2.5 text-left text-small text-muted hover:bg-raised aria-[current=step]:bg-accent-soft aria-[current=step]:text-text focus-visible:outline-2 focus-visible:outline-offset-2 transition-[background-color,color] duration-[var(--t-ui)] motion-reduce:transition-none"
              >
                <span className="mt-px grid h-6 w-6 shrink-0 place-items-center rounded-full bg-raised text-label font-semibold tabular-nums">{i + 1}</span>
                <span>{text(s)}</span>
              </button>
            </li>
          ))}
        </ol>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <button type="button" onClick={() => setCurrent((c) => Math.max(0, c - 1))} disabled={current === 0} className={`${navButton} bg-raised text-text hover:bg-border`}>
            ← {t("prevStep")}
          </button>
          <button
            type="button"
            onClick={() => setCurrent((c) => Math.min(steps.length - 1, c + 1))}
            disabled={current === steps.length - 1}
            className={`${navButton} bg-accent text-on-primary hover:bg-accent-hi`}
          >
            {t("nextStep")} →
          </button>
          <span className="ml-auto text-label text-muted tabular-nums" aria-live="polite">
            {t("stepOf", { current: current + 1, total: steps.length })}
          </span>
        </div>
        <div className="mt-3 flex gap-1.5" aria-hidden="true">
          {steps.map((_, i) => (
            <i key={i} className={`h-1 w-6 rounded-sm ${i <= current ? "bg-progress" : "bg-raised"}`} />
          ))}
        </div>
      </div>
    </div>
  );
}
