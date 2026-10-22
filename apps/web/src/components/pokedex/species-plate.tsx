"use client";

import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { FishMark } from "@/components/layout/fish-mark";
import { RegulationTag } from "@/components/species/regulation-tag";
import { speciesName } from "@/lib/fishydex-index";
import type { PokedexEntry } from "@/lib/pokedex";

type Props = { entry: PokedexEntry; locale: string };

const HABITAT_KEYS = ["saltwater", "freshwater", "brackish"] as const;

export function SpeciesPlate({ entry, locale }: Props) {
  const t = useTranslations("pokedex");
  const caught = entry.catch_count > 0;
  const name = speciesName(entry, locale);
  const description =
    locale === "en" ? entry.description_en : entry.description_es;
  // Once caught, the plate shows the angler's own best catch; the reference photo is the fallback.
  const catchPhoto = caught ? (entry.best_catch_photo ?? entry.first_catch_photo) : null;
  const photo = catchPhoto ?? entry.reference_photo_url;
  const habitatKey = HABITAT_KEYS.find((k) => k === entry.habitat);
  // Remote reference photos can fail (hotlink limits, dead URLs); fall back to the silhouette.
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  return (
    <aside
      className="p-6 lg:sticky lg:top-[80px]"
      style={{ background: "var(--surface)", borderRadius: "var(--r-card)" }}
    >
      <div
        className="relative mb-[18px] flex h-[260px] items-center justify-center overflow-hidden"
        style={{ background: "var(--ground)", borderRadius: 3 }}
      >
        {caught && photo && failedSrc !== photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photo}
            alt={name}
            className={`h-full w-full ${photo === catchPhoto ? "object-cover" : "object-contain"}`}
            onError={() => setFailedSrc(photo)}
          />
        ) : (
          <FishMark className="h-24 w-24 text-silhouette" />
        )}
        <RegulationTag regulation={entry.regulation ?? null} className="absolute top-3 left-3" />
        {caught && photo === catchPhoto && failedSrc !== photo && (
          <span className="absolute bottom-3 left-3 rounded-[var(--r-pill)] bg-surface px-3 py-1 text-[13px] font-semibold text-text">
            {t("yourBestCatch")}
          </span>
        )}
      </div>
      {/* Fixed-height text area: name and description are clamped and the facts + CTA are pinned to
          the bottom, so hovering species with longer copy never resizes the plate or moves the button. */}
      <div className="flex h-[320px] flex-col">
        <h2
          className="font-serif-display m-0 line-clamp-2"
          style={{
            fontSize: 40,
            fontWeight: 900,
            lineHeight: 1,
            color: "var(--text)",
          }}
          title={name}
        >
          {name}
        </h2>
        <p className="sci-name mt-1.5 mb-4 truncate" style={{ fontSize: 18 }}>
          {entry.scientific_name || "—"}
        </p>
        {description && (
          <p
            className="line-clamp-3"
            style={{ fontSize: 15, color: "var(--text)" }}
            title={description}
          >
            {description}
          </p>
        )}
        <div className="mt-auto pt-4">
          <dl className="mb-[18px] grid grid-cols-3 gap-3">
            <Fact
              value={
                entry.best_weight_kg != null
                  ? `${entry.best_weight_kg.toFixed(1)} kg`
                  : "—"
              }
              label={t("yourBest")}
            />
            <Fact
              value={
                caught ? t("timesCaught", { count: entry.catch_count }) : "—"
              }
              label={t("timesCaughtLabel")}
            />
            <Fact
              value={habitatKey ? t(habitatKey) : "—"}
              label={t("habitat")}
            />
          </dl>
          <Link
            href={caught ? `/pokedex/${entry.id}` : `/species/${entry.id}`}
            className="block w-full px-4 py-3 text-center text-[15px] font-semibold hover:brightness-95 active:scale-[0.98] focus-visible:outline-2 transition-[background-color,transform] duration-[var(--t-press)] ease-[var(--ease-out)] motion-reduce:transition-none motion-reduce:active:scale-100"
            style={{
              background: "var(--accent)",
              color: "var(--on-primary)",
              borderRadius: "var(--r-control)",
            }}
          >
            {caught ? t("viewMyCatches") : t("whereToFish")}
          </Link>
        </div>
      </div>
    </aside>
  );
}

function Fact({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <dd
        className="m-0 truncate text-[18px] font-semibold"
        style={{ color: "var(--text)" }}
        title={value}
      >
        {value}
      </dd>
      <dt className="text-xs" style={{ color: "var(--muted)" }}>
        {label}
      </dt>
    </div>
  );
}
