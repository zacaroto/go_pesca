import Link from "next/link";

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

function habitatPillCls(habitat: string | null | undefined) {
  if (habitat === "saltwater")  return "pill-salt";
  if (habitat === "freshwater") return "pill-fresh";
  return "pill-brack";
}

function habitatLabel(habitat: string | null | undefined) {
  if (habitat === "saltwater")  return "Salada";
  if (habitat === "freshwater") return "Dulce";
  return "Salobre";
}

function relativeTime(dateStr: string) {
  const date = new Date(dateStr + "T00:00:00");
  const diffDays = Math.floor((Date.now() - date.getTime()) / 86_400_000);
  if (diffDays === 0) return "hoy";
  if (diffDays === 1) return "ayer";
  if (diffDays < 7)  return `hace ${diffDays}d`;
  return date.toLocaleDateString("es", { day: "numeric", month: "short" });
}

export function CatchCard({ catch_entry, index = 0 }: Props) {
  return (
    <Link
      href={`/catches/${catch_entry.id}`}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "11px 0",
        borderBottom: "1px solid var(--rule)",
        textDecoration: "none",
        minWidth: 0,
        transition: `background var(--t-press)`,
      }}
      onMouseDown={(e) => (e.currentTarget.style.background = "var(--raised)")}
      onMouseUp={(e) => (e.currentTarget.style.background = "transparent")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
    >
      {/* 42px habitat-gradient thumb */}
      <div
        style={{
          width: "42px",
          height: "42px",
          borderRadius: "8px",
          overflow: "hidden",
          flexShrink: 0,
          background: "var(--raised)",
        }}
      >
        <img
          src={catch_entry.photo_url}
          alt={catch_entry.species_name}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>

      {/* Text column */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontFamily: "var(--font-playfair), Georgia, serif",
            fontWeight: 700,
            fontSize: "13px",
            color: "var(--text)",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {catch_entry.species_name}
        </div>
        <div
          className="flex items-center gap-1.5 mt-0.5"
          style={{ minWidth: 0 }}
        >
          {catch_entry.location_name && (
            <span
              style={{
                fontSize: "11px",
                color: "var(--faint)",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                minWidth: 0,
                overflowWrap: "anywhere",
              }}
            >
              {catch_entry.location_name}
            </span>
          )}
          <span
            className={habitatPillCls(catch_entry.habitat)}
            style={{
              fontSize: "9px",
              fontWeight: 600,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              padding: "2px 6px",
              borderRadius: "999px",
              flexShrink: 0,
              whiteSpace: "nowrap",
            }}
          >
            {habitatLabel(catch_entry.habitat)}
          </span>
        </div>
      </div>

      {/* Weight + relative time */}
      <div style={{ flexShrink: 0, textAlign: "right" }}>
        {catch_entry.weight_kg && (
          <div
            style={{
              fontSize: "14px",
              fontWeight: 700,
              color: "var(--text)",
              fontVariantNumeric: "tabular-nums",
              letterSpacing: "-0.01em",
            }}
          >
            {catch_entry.weight_kg} kg
          </div>
        )}
        <div
          style={{
            fontSize: "11px",
            color: "var(--faint)",
            marginTop: "2px",
          }}
        >
          {relativeTime(catch_entry.catch_date)}
        </div>
      </div>
    </Link>
  );
}
