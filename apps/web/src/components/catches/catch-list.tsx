"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { CatchCard } from "./catch-card";
import { CatchFilters } from "./catch-filters";

type CatchEntry = {
  id: string;
  photo_url: string;
  catch_date: string;
  location_name: string | null;
  species_id: number;
  species_name: string;
  weight_kg?: number | null;
  length_cm?: number | null;
  habitat?: string | null;
};

type Species = {
  id: number;
  name: string;
};

type Props = {
  catches: CatchEntry[];
  species: Species[];
};

export function CatchList({ catches, species }: Props) {
  const t = useTranslations("catches");
  const tCommon = useTranslations("common");
  const [search, setSearch] = useState("");
  const [selectedSpecies, setSelectedSpecies] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const filtered = catches.filter((c) => {
    if (search) {
      const q = search.toLowerCase();
      const matchesSpecies = c.species_name.toLowerCase().includes(q);
      const matchesLocation = c.location_name?.toLowerCase().includes(q);
      if (!matchesSpecies && !matchesLocation) return false;
    }
    if (selectedSpecies && c.species_id !== parseInt(selectedSpecies))
      return false;
    if (dateFrom && c.catch_date < dateFrom) return false;
    if (dateTo && c.catch_date > dateTo) return false;
    return true;
  });

  return (
    <div style={{ maxWidth: "640px", margin: "0 auto", paddingBottom: "80px" }}>
      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1
            style={{
              fontFamily: "var(--font-playfair), Georgia, serif",
              fontWeight: 900,
              fontSize: "22px",
              color: "var(--text)",
              margin: 0,
              letterSpacing: "-0.01em",
            }}
          >
            {t("title")}
          </h1>
          <p style={{ fontSize: "13px", color: "var(--faint)", margin: "4px 0 0" }}>
            {filtered.length} capturas registradas
          </p>
        </div>
      </div>

      {/* Search input */}
      <div style={{ position: "relative", marginBottom: "16px" }}>
        <svg
          width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke="var(--faint)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)" }}
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={`${tCommon("search")}...`}
          style={{
            width: "100%",
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "var(--r-card)",
            color: "var(--text)",
            fontSize: "14px",
            padding: "10px 14px 10px 40px",
            outline: "none",
            boxSizing: "border-box",
            transition: `border-color var(--t-ui)`,
          }}
          onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
          onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
        />
      </div>

      {/* Existing CatchFilters — keep as-is */}
      <CatchFilters
        species={species}
        selectedSpecies={selectedSpecies}
        onSpeciesChange={setSelectedSpecies}
        dateFrom={dateFrom}
        dateTo={dateTo}
        onDateFromChange={setDateFrom}
        onDateToChange={setDateTo}
      />

      {/* Results */}
      {filtered.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "48px 24px",
            background: "var(--surface)",
            borderRadius: "var(--r-card)",
            border: "1px solid var(--border)",
            marginTop: "16px",
          }}
        >
          <p style={{ color: "var(--muted)", fontSize: "14px", margin: 0 }}>
            No hay capturas que coincidan con tu búsqueda.
          </p>
        </div>
      ) : (
        <div
          style={{
            background: "var(--surface)",
            borderRadius: "var(--r-card)",
            border: "1px solid var(--border)",
            padding: "0 16px",
            marginTop: "16px",
          }}
        >
          {filtered.map((c, index) => (
            <CatchCard key={c.id} catch_entry={c} index={index} />
          ))}
        </div>
      )}

      {/* Add-catch FAB (phone) */}
      <Link
        href="/catches/new"
        aria-label={t("newCatch")}
        className="fixed bottom-20 right-[18px] z-40 flex h-[50px] w-[50px] items-center justify-center rounded-full bg-accent text-on-primary hover:bg-accent-hi active:bg-accent-hi active:scale-[0.92] transition-[background-color,transform] duration-[var(--t-press)] ease-[var(--ease-out)] motion-reduce:transition-none motion-reduce:active:scale-100 sm:hidden"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <path d="M12 5v14M5 12h14" />
        </svg>
      </Link>
    </div>
  );
}
