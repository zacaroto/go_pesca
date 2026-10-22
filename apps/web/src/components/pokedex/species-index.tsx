"use client";

import { useMemo, useRef, useState } from "react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import {
  buildSpeciesIndex,
  countByHabitat,
  speciesName,
  type Habitat,
  type HabitatFilter,
  type StatusFilter,
} from "@/lib/fishydex-index";
import type { PokedexEntry } from "@/lib/pokedex";
import { SpeciesPlate } from "./species-plate";

type Props = { entries: PokedexEntry[]; locale: string };

const HABITATS: Habitat[] = ["saltwater", "freshwater", "brackish"];

const ROW_BASE =
  "items-center gap-4 px-3 py-2.5 text-left w-full cursor-pointer border-t border-solid border-t-[var(--rule)] rounded-[6px] transition-[background-color,border-color] duration-[var(--t-ui)] ease-[var(--ease-out)] motion-reduce:transition-none hover:bg-[var(--surface)] hover:border-t-transparent data-[selected=true]:bg-[var(--surface)] data-[selected=true]:border-t-transparent active:bg-[var(--raised)] data-[selected=true]:active:bg-[var(--raised)] focus-visible:outline-2 focus-visible:outline-offset-[-2px]";

function initialSelection(entries: PokedexEntry[]): number {
  let best: PokedexEntry | null = null;
  for (const e of entries) {
    if (e.last_catch_date && (!best || e.last_catch_date > (best.last_catch_date ?? ""))) best = e;
  }
  return (best ?? entries[0])?.id ?? -1;
}

export function SpeciesIndex({ entries, locale }: Props) {
  const t = useTranslations("pokedex");
  const [habitat, setHabitat] = useState<HabitatFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [selectedId, setSelectedId] = useState<number>(() => initialSelection(entries));
  const listRef = useRef<HTMLDivElement>(null);

  const sections = useMemo(
    () => buildSpeciesIndex(entries, locale, habitat, statusFilter),
    [entries, locale, habitat, statusFilter],
  );
  const counts = useMemo(() => countByHabitat(entries), [entries]);
  const caughtTotal = useMemo(() => entries.filter((e) => e.catch_count > 0).length, [entries]);
  const visible = useMemo(() => sections.flatMap((s) => s.entries), [sections]);
  const selected = visible.find((e) => e.id === selectedId) ?? visible[0] ?? null;

  function onKeyDown(e: React.KeyboardEvent<HTMLElement>) {
    if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(e.key)) return;
    const rows = Array.from(listRef.current?.querySelectorAll<HTMLElement>("[data-row]") ?? []);
    const i = rows.indexOf(e.currentTarget);
    const next =
      e.key === "Home" ? rows[0] : e.key === "End" ? rows[rows.length - 1] : rows[i + (e.key === "ArrowDown" ? 1 : -1)];
    if (next) {
      e.preventDefault();
      next.focus();
    }
  }

  function status(entry: PokedexEntry) {
    if (entry.catch_count === 0)
      return <span style={{ color: "var(--muted)" }}>{t("undiscovered")}</span>;
    if (entry.best_weight_kg != null) return `${entry.best_weight_kg.toFixed(1)} kg`;
    return t("released");
  }

  // Status: one segmented track; the active segment is the white surface sitting in the raised track.
  const segment = (key: StatusFilter, label: string, count?: number) => (
    <button
      key={key}
      type="button"
      aria-pressed={statusFilter === key}
      data-active={statusFilter === key}
      onClick={() => setStatusFilter(key)}
      className="inline-flex h-8 items-center gap-1.5 rounded-full px-3.5 text-small text-muted hover:text-text active:scale-[0.97] data-[active=true]:bg-surface data-[active=true]:font-semibold data-[active=true]:text-text transition-[background-color,color,transform] duration-[var(--t-ui)] ease-[var(--ease-out)] motion-reduce:transition-none motion-reduce:active:scale-100 focus-visible:outline-2 focus-visible:outline-offset-1"
    >
      {label}
      {count !== undefined && <span className="tabular-nums text-faint">{count}</span>}
    </button>
  );

  // Habitat: quiet text tabs with an accent underline, so they read as a second, lighter filter.
  const habitatTab = (key: HabitatFilter, label: string, progress?: string) => (
    <button
      key={key}
      type="button"
      aria-pressed={habitat === key}
      data-active={habitat === key}
      onClick={() => setHabitat(key)}
      className="inline-flex h-8 items-center gap-1.5 border-b-2 border-transparent text-small text-muted hover:text-text active:opacity-70 data-[active=true]:border-accent data-[active=true]:font-semibold data-[active=true]:text-text transition-[color,border-color,opacity] duration-[var(--t-ui)] motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2"
    >
      {label}
      {progress && <span className="tabular-nums text-faint">{progress}</span>}
    </button>
  );

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center gap-x-8 gap-y-3">
        <div role="group" aria-label={t("statusFilterLabel")} className="inline-flex rounded-full bg-raised p-1">
          {segment("all", t("all"))}
          {segment("caught", t("caughtFilter"), caughtTotal)}
          {segment("undiscovered", t("undiscovered"), entries.length - caughtTotal)}
        </div>
        <div role="group" aria-label={t("habitatFilterLabel")} className="flex flex-wrap gap-x-5 gap-y-1">
          {habitatTab("all", t("allHabitats"))}
          {HABITATS.map((h) => habitatTab(h, t(h), `${counts[h].caught}/${counts[h].total}`))}
        </div>
      </div>
      <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
        <div ref={listRef}>
          {sections.length === 0 && (
            <p className="py-6" style={{ color: "var(--muted)" }}>
              {t("noMatches")}
            </p>
          )}
          {sections.map((s) => (
            <section key={s.letter} aria-label={s.letter}>
              <h3
                className="font-serif-display mt-[18px] mb-1"
                style={{ fontSize: "var(--text-subhead)", fontWeight: 700, color: "var(--accent)" }}
              >
                {s.letter}
              </h3>
              {s.entries.map((entry) => {
                const caught = entry.catch_count > 0;
                const selectedRow = entry.id === selected?.id;
                const name = speciesName(entry, locale);
                const habitatLabel = (HABITATS as string[]).includes(entry.habitat)
                  ? t(entry.habitat as Habitat)
                  : "—";
                const nameCell = (
                  <span className="font-serif-display" style={{ fontWeight: 700, fontSize: "var(--text-name)", color: "var(--text)" }}>
                    {name}
                  </span>
                );
                const statusCell = (
                  <span className="text-right text-label" style={{ color: "var(--text)" }}>
                    {status(entry)}
                  </span>
                );
                return (
                  <div key={entry.id}>
                    {/* Below lg: link row */}
                    <Link
                      href={caught ? `/pokedex/${entry.id}` : `/species/${entry.id}`}
                      className={`${ROW_BASE} flex justify-between lg:hidden`}
                    >
                      {nameCell}
                      {statusCell}
                    </Link>
                    {/* lg and up: selectable row */}
                    <button
                      type="button"
                      data-row
                      className={`${ROW_BASE} hidden lg:grid`}
                      data-selected={selectedRow}
                      tabIndex={selectedRow ? 0 : -1}
                      style={{
                        gridTemplateColumns: "minmax(0,1.3fr) minmax(0,1.3fr) 90px 110px",
                      }}
                      onMouseEnter={() => setSelectedId(entry.id)}
                      onFocus={() => setSelectedId(entry.id)}
                      onClick={() => setSelectedId(entry.id)}
                      onKeyDown={onKeyDown}
                    >
                      {nameCell}
                      <span className="sci-name truncate text-body">{entry.scientific_name || "—"}</span>
                      <span className="text-label" style={{ color: "var(--muted)" }}>
                        {habitatLabel}
                      </span>
                      {statusCell}
                    </button>
                  </div>
                );
              })}
            </section>
          ))}
        </div>
        <div className="hidden lg:block">
          {selected ? (
            <SpeciesPlate entry={selected} locale={locale} />
          ) : (
            <div
              className="h-[260px] lg:sticky lg:top-[80px]"
              style={{ background: "var(--surface)", borderRadius: "var(--r-card)" }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
