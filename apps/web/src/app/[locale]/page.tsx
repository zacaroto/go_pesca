import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import { getHomeData } from "@/lib/home";
import type { HomeCatch } from "@/lib/home-data";
import { FishMark } from "@/components/layout/fish-mark";

type Props = {
  params: Promise<{ locale: string }>;
};

const btnClass =
  "inline-flex items-center justify-center h-10 px-5 rounded-[var(--r-pill)] font-semibold " +
  "bg-[var(--accent)] text-[var(--on-primary)] hover:bg-[var(--accent-hi)] active:scale-[0.97] " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] " +
  "transition-[background-color,transform] duration-[var(--t-ui)] ease-[var(--ease-out)] " +
  "motion-reduce:transition-none motion-reduce:active:scale-100";

const linkClass =
  "font-medium text-[var(--accent)] hover:text-[var(--accent-hi)] focus-visible:outline-2 " +
  "focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] rounded-sm " +
  "transition-colors duration-[var(--t-ui)]";

function Photo({ src, alt, className }: { src: string | null; alt: string; className: string }) {
  if (!src) {
    return (
      <div className={`${className} flex items-center justify-center`} style={{ color: "var(--silhouette)" }}>
        <FishMark className="w-1/2 h-1/2 max-w-16 max-h-16" />
      </div>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} loading="lazy" className={className} />
  );
}

export default async function Home({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");
  const ta = await getTranslations("auth");
  const dateLocale = locale === "en" ? "en" : "es-CR";
  const fmtDate = (iso: string) =>
    new Date(iso).toLocaleDateString(dateLocale, { day: "numeric", month: "short", timeZone: "UTC" });
  const fmtKg = (n: number) => `${n.toFixed(1)} kg`;

  let data: Awaited<ReturnType<typeof getHomeData>> | null = null;
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) data = await getHomeData(user.id, locale);
  } catch {
    data = null;
  }

  if (!data) {
    return (
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <h1
          className="font-serif-display font-black"
          style={{ fontSize: "clamp(40px,6vw,64px)", lineHeight: 1, color: "var(--text)" }}
        >
          {t("hero")}
        </h1>
        <p className="mt-4 text-lg max-w-[44ch]" style={{ color: "var(--muted)" }}>
          {t("subtitle")}
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-6">
          <Link href="/auth/register" className={btnClass}>
            {t("register")}
          </Link>
          <Link href="/auth/login" className={linkClass}>
            {ta("loginTitle")}
          </Link>
        </div>
      </main>
    );
  }

  const { catches, latestNew, caught, total } = data;

  if (catches.length === 0 || !latestNew) {
    return (
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <h1
          className="font-serif-display font-black"
          style={{ fontSize: "clamp(40px,6vw,64px)", lineHeight: 1, color: "var(--text)" }}
        >
          {t("emptyTitle")}
        </h1>
        <p className="mt-4 text-lg max-w-[44ch]" style={{ color: "var(--muted)" }}>
          {t("emptyBody")}
        </p>
        <div className="mt-8">
          <Link href="/catches/new" className={btnClass}>
            {t("logCatch")}
          </Link>
        </div>
      </main>
    );
  }

  // Catches arrive newest first, so the first sighting of each species is the most recent one.
  const seen = new Set<number>();
  const dexCards: HomeCatch[] = [];
  for (const c of catches) {
    if (seen.has(c.species_id)) continue;
    seen.add(c.species_id);
    dexCards.push(c);
    if (dexCards.length === 6) break;
  }
  const recent = catches.slice(0, 4);
  const pct = total > 0 ? Math.min(100, (caught / total) * 100) : 0;

  const measure = latestNew.length_cm != null
    ? { value: `${latestNew.length_cm} cm`, label: t("length") }
    : { value: latestNew.weight_kg != null ? fmtKg(latestNew.weight_kg) : "—", label: t("weight") };

  const facts = [
    measure,
    { value: latestNew.location_name ?? "—", label: t("place") },
    { value: fmtDate(latestNew.catch_date), label: t("date") },
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 pt-8 lg:pt-10 pb-14 overflow-x-hidden">
      {/* Hero */}
      <section className="grid lg:grid-cols-[5fr_7fr] gap-8 lg:gap-12 items-center mb-14">
        <div className="min-w-0">
          <p className="m-0 mb-2" style={{ color: "var(--muted)" }}>
            {t("latestSpecies")}
          </p>
          <h1
            className="font-serif-display font-black m-0 mb-1.5 break-words"
            style={{ fontSize: "clamp(40px,6vw,64px)", lineHeight: 0.98, letterSpacing: "-0.03em", color: "var(--text)" }}
          >
            {latestNew.species_name}
          </h1>
          <p className="sci-name m-0 mb-5 text-xl">{latestNew.scientific_name}</p>
          <dl className="grid grid-cols-3 gap-4 m-0 mb-6">
            {facts.map((f) => (
              <div key={f.label} className="min-w-0">
                <dd className="m-0 text-lg sm:text-[22px] font-semibold truncate tabular-nums" style={{ color: "var(--text)" }}>
                  {f.value}
                </dd>
                <dt className="text-[13px] font-normal" style={{ color: "var(--muted)" }}>
                  {f.label}
                </dt>
              </div>
            ))}
          </dl>
          {latestNew.description && (
            <p className="m-0 mb-5 max-w-[44ch] text-base" style={{ color: "var(--text)" }}>
              {latestNew.description}
            </p>
          )}
          <Link href={`/pokedex/${latestNew.species_id}`} className={btnClass}>
            {t("viewSpecies")}
          </Link>
        </div>
        <div
          className="h-[220px] lg:h-[400px] overflow-hidden"
          style={{ background: "var(--surface)", borderRadius: "var(--r-card)" }}
        >
          <Photo
            src={latestNew.reference_photo_url ?? latestNew.photo_url}
            alt={latestNew.species_name}
            className="w-full h-full object-contain p-6"
          />
        </div>
      </section>

      {/* FishyDex band */}
      <section
        className="p-5 sm:p-7 mb-14"
        style={{ background: "var(--surface)", borderRadius: "var(--r-card)" }}
      >
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 mb-4">
          <h2 className="font-serif-display font-bold m-0 text-[30px]" style={{ color: "var(--text)" }}>
            {t("yourFishyDex")}
          </h2>
          <p className="m-0 tabular-nums" style={{ color: "var(--muted)" }}>
            {t("fishyDexProgress", { caught, total })}
          </p>
          <Link href="/pokedex" className={linkClass}>
            {t("openCollection")}
          </Link>
        </div>
        <ul className="list-none p-0 m-0 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {dexCards.map((c) => (
            <li key={c.species_id} className="min-w-0">
              <Link
                href={`/pokedex/${c.species_id}`}
                className="block group rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] hover:-translate-y-[3px] active:translate-y-0 transition-transform duration-[var(--t-ui)] ease-[var(--ease-out)] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
              >
                <div className="h-24 overflow-hidden" style={{ background: "var(--ground)", borderRadius: "3px" }}>
                  <Photo
                    src={c.reference_photo_url ?? c.photo_url}
                    alt={c.species_name}
                    className="w-full h-full object-contain p-1.5"
                  />
                </div>
                <p className="font-serif-display font-bold m-0 mt-2 text-base truncate" style={{ color: "var(--text)" }}>
                  {c.species_name}
                </p>
              </Link>
            </li>
          ))}
        </ul>
        <div
          className="h-2 overflow-hidden mt-5"
          style={{ background: "var(--raised)", borderRadius: "var(--r-pill)" }}
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={total}
          aria-valuenow={caught}
          aria-label={t("yourFishyDex")}
        >
          <div className="h-full" style={{ width: `${pct}%`, background: "var(--accent)" }} />
        </div>
      </section>

      {/* Recent catches */}
      <section>
        <div className="flex items-baseline justify-between gap-4 mb-4">
          <h2 className="font-serif-display font-bold m-0 text-[30px]" style={{ color: "var(--text)" }}>
            {t("recentCatches")}
          </h2>
          <Link href="/catches" className={linkClass}>
            {t("viewAll", { count: catches.length })}
          </Link>
        </div>
        <ul className="list-none p-0 m-0">
          {recent.map((c) => {
            const meta = [c.location_name, c.bait_lure, fmtDate(c.catch_date)].filter(Boolean).join(" · ");
            return (
              <li key={c.id} className="py-3.5" style={{ borderTop: "1px solid var(--rule)" }}>
                <Link
                  href={`/catches/${c.id}`}
                  className="grid grid-cols-[96px_minmax(0,1fr)_auto] sm:grid-cols-[120px_minmax(0,1fr)_auto] gap-4 sm:gap-[18px] items-center rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] active:opacity-80 transition-opacity duration-[var(--t-press)]"
                >
                  <div className="h-16 sm:h-20 overflow-hidden" style={{ background: "var(--surface)", borderRadius: "3px" }}>
                    <Photo src={c.photo_url || null} alt={c.species_name} className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-serif-display font-bold m-0 text-[19px] truncate" style={{ color: "var(--text)" }}>
                      {c.species_name}
                    </p>
                    <p className="m-0 text-[13px] truncate" style={{ color: "var(--muted)" }}>
                      {meta}
                    </p>
                  </div>
                  <p className="m-0 text-xl font-semibold text-right tabular-nums" style={{ color: "var(--text)" }}>
                    {c.weight_kg != null ? fmtKg(c.weight_kg) : "—"}
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
    </main>
  );
}
