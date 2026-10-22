"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { relativeDate } from "@/lib/community-mosaic";

type CatchEntry = {
  id: string;
  photo_url: string;
  catch_date: string;
  location_name: string | null;
  species_name: string;
  weight_kg?: number | null;
  length_cm?: number | null;
  habitat?: string | null;
};

type Props = {
  catch_entry: CatchEntry;
  index?: number;
};

function habitatKey(habitat: string | null | undefined) {
  if (habitat === "saltwater") return "saltwater" as const;
  if (habitat === "freshwater") return "freshwater" as const;
  return "brackish" as const;
}

const PILL = {
  saltwater: "pill-salt",
  freshwater: "pill-fresh",
  brackish: "pill-brack",
} as const;

export function CatchCard({ catch_entry }: Props) {
  const locale = useLocale();
  const tFeed = useTranslations("feed");
  const tCommon = useTranslations("common");
  const key = habitatKey(catch_entry.habitat);

  return (
    <Link
      href={`/catches/${catch_entry.id}`}
      className="flex min-w-0 items-center gap-3 border-b border-rule py-[11px] hover:bg-raised active:bg-raised transition-colors duration-[var(--t-press)] motion-reduce:transition-none"
    >
      <div className="h-[42px] w-[42px] flex-shrink-0 overflow-hidden rounded-[var(--r-control)] bg-raised">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={catch_entry.photo_url}
          alt={catch_entry.species_name}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="min-w-0 flex-1">
        <div className="font-serif-display truncate text-[15px] font-bold text-text">
          {catch_entry.species_name}
        </div>
        <div className="mt-0.5 flex min-w-0 items-center gap-1.5">
          {catch_entry.location_name && (
            <span className="min-w-0 truncate text-[13px] text-muted [overflow-wrap:anywhere]">
              {catch_entry.location_name}
            </span>
          )}
          <span
            className={`${PILL[key]} flex-shrink-0 whitespace-nowrap rounded-[var(--r-pill)] px-2 py-0.5 text-[13px] font-medium`}
          >
            {tCommon(`habitat.${key}`)}
          </span>
        </div>
      </div>

      <div className="flex-shrink-0 text-right">
        {catch_entry.weight_kg != null ? (
          <div className="text-sm font-bold tabular-nums text-text">
            {catch_entry.weight_kg} kg
          </div>
        ) : null}
        <div className="mt-0.5 text-[13px] text-muted">
          {relativeDate(catch_entry.catch_date, new Date(), locale, tFeed)}
        </div>
      </div>
    </Link>
  );
}
