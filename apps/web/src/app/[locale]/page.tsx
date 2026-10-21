import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { CatchCard } from "@/components/catches/catch-card";
import { HomeFAB } from "@/components/layout/home-fab";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function Home({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  // No auth or Supabase queries exist in the current file.
  // Using fallback values (0 / empty) per task brief instructions.
  const totalCatches = 0;
  const uniqueSpecies = 0;
  const thisWeek = 0;
  const recentCatches: {
    id: string;
    photo_url: string;
    catch_date: string;
    location_name: string | null;
    species_name: string;
    weight_kg?: number | null;
    length_cm?: number | null;
    habitat?: string | null;
  }[] = [];
  const rankData = null;

  return (
    <main style={{ maxWidth: "640px", margin: "0 auto", padding: "24px 18px 96px" }}>

      {/* Greeting */}
      <div style={{ marginBottom: "28px" }}>
        <p
          style={{
            fontSize: "11px",
            fontWeight: 600,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "var(--faint)",
            margin: "0 0 6px",
          }}
        >
          Temporada · Costa Rica
        </p>
        <h1
          style={{
            fontFamily: "var(--font-playfair), Georgia, serif",
            fontWeight: 900,
            fontSize: "28px",
            color: "var(--text)",
            margin: 0,
            letterSpacing: "-0.02em",
            lineHeight: 1.1,
          }}
        >
          Hola,{" "}
          <em style={{ color: "var(--accent-hi)", fontStyle: "italic" }}>
            Pescador.
          </em>
        </h1>
      </div>

      {/* KPI strip */}
      <div
        className="grid grid-cols-3"
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "var(--r-card)",
          overflow: "hidden",
          marginBottom: "24px",
        }}
      >
        {[
          { label: "Capturas",    value: totalCatches },
          { label: "Especies",    value: uniqueSpecies },
          { label: "Esta semana", value: thisWeek },
        ].map((kpi, i) => (
          <div
            key={kpi.label}
            style={{
              padding: "16px 12px",
              textAlign: "center",
              borderLeft: i > 0 ? "1px solid var(--border)" : "none",
            }}
          >
            <div
              style={{
                fontWeight: 700,
                fontSize: "26px",
                color: "var(--text)",
                fontVariantNumeric: "tabular-nums",
                letterSpacing: "-0.02em",
                lineHeight: 1,
              }}
            >
              {kpi.value}
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
              {kpi.label}
            </div>
          </div>
        ))}
      </div>

      {/* Recent catches section */}
      <div style={{ marginBottom: "24px" }}>
        <div className="flex items-center justify-between mb-3">
          <span
            style={{
              fontSize: "10px",
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--faint)",
            }}
          >
            Últimas capturas
          </span>
          <Link
            href="/catches"
            style={{
              fontSize: "12px",
              fontWeight: 500,
              color: "var(--accent-hi)",
              textDecoration: "none",
            }}
          >
            Ver todas →
          </Link>
        </div>

        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "var(--r-card)",
            padding: "0 16px",
          }}
        >
          {recentCatches.length === 0 ? (
            <p style={{ color: "var(--faint)", fontSize: "13px", padding: "16px 0", margin: 0 }}>
              Aún no tienes capturas. ¡Registra tu primera!
            </p>
          ) : (
            recentCatches.map((c, i) => (
              <CatchCard key={c.id} catch_entry={c} index={i} />
            ))
          )}
        </div>
      </div>

      <HomeFAB />
    </main>
  );
}
