import Link from "next/link";
import type { PokedexEntry } from "@/lib/pokedex";

type Props = {
  entry: PokedexEntry;
  locale: string;
};

function HabitatPill({ habitat }: { habitat: string | null | undefined }) {
  const map: Record<string, { cls: string; label: string }> = {
    saltwater:  { cls: "pill-salt",  label: "Salada" },
    freshwater: { cls: "pill-fresh", label: "Dulce" },
    brackish:   { cls: "pill-brack", label: "Salobre" },
  };
  const p = map[habitat ?? ""] ?? { cls: "pill-brack", label: "Salobre" };
  return (
    <span
      className={p.cls}
      style={{
        fontSize: "9px",
        fontWeight: 600,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        padding: "2px 7px",
        borderRadius: "999px",
        whiteSpace: "nowrap",
        flexShrink: 0,
      }}
    >
      {p.label}
    </span>
  );
}

export function PokedexCard({ entry, locale }: Props) {
  const name = locale === "es" ? entry.name_es : entry.name_en;
  const caught = entry.catch_count > 0;

  if (!caught) {
    return (
      <div
        style={{
          background: "var(--surface)",
          borderRadius: "var(--r-card)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          padding: "8px",
        }}
      >
        {/* Desaturated photo */}
        <div
          style={{
            aspectRatio: "4/5",
            borderRadius: "10px",
            overflow: "hidden",
            background: "var(--raised)",
            position: "relative",
          }}
        >
          {entry.reference_photo_url ? (
            <img
              src={entry.reference_photo_url}
              alt="Sin capturar"
              className="w-full h-full object-cover"
              style={{ filter: "saturate(0) brightness(0.4)" }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--faint)" strokeWidth="1.5">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </div>
          )}
        </div>

        {/* Name row */}
        <div style={{ padding: "0 4px 4px", minWidth: 0 }}>
          <p
            style={{
              fontFamily: "var(--font-playfair), Georgia, serif",
              fontWeight: 700,
              fontSize: "13px",
              color: "var(--faint)",
              fontStyle: "italic",
              margin: 0,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            Sin capturar
          </p>
        </div>
      </div>
    );
  }

  return (
    <Link
      href={`/pokedex/${entry.id}`}
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--r-card)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        padding: "8px",
        cursor: "pointer",
        textDecoration: "none",
        transition: `transform var(--t-press) var(--ease-out)`,
      }}
      onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.97)")}
      onMouseUp={(e)   => (e.currentTarget.style.transform = "scale(1)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      {/* Photo */}
      <div
        style={{
          aspectRatio: "4/5",
          borderRadius: "10px",
          overflow: "hidden",
          background: "var(--raised)",
          position: "relative",
        }}
      >
        <img
          src={entry.first_catch_photo || entry.reference_photo_url || ""}
          alt={name}
          className="w-full h-full object-cover"
        />

        {/* Cobalt caught badge — badge-pop spring animation */}
        <div
          style={{
            position: "absolute",
            top: "8px",
            right: "8px",
            width: "22px",
            height: "22px",
            background: "var(--accent)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            animation: "badge-pop 400ms var(--ease-spring) forwards",
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        {/* Habitat pill bottom-left */}
        <div style={{ position: "absolute", bottom: "8px", left: "8px" }}>
          <HabitatPill habitat={entry.habitat} />
        </div>
      </div>

      {/* Name + catch count */}
      <div style={{ padding: "0 4px 4px", minWidth: 0 }}>
        <p
          style={{
            fontFamily: "var(--font-playfair), Georgia, serif",
            fontWeight: 700,
            fontSize: "13px",
            color: "var(--text)",
            margin: 0,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {name}
        </p>
        <p
          style={{
            fontSize: "10px",
            fontWeight: 500,
            color: "var(--faint)",
            margin: "2px 0 0",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {entry.catch_count}× capturado
        </p>
      </div>
    </Link>
  );
}
