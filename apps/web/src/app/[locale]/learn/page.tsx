import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ChapterCard, GuideCard } from "@/components/learn/cards";
import { KnotStepper } from "@/components/learn/knot-stepper";
import { chapterProgress, crMonth, inSeason, knotOfTheWeek } from "@/lib/learn";
import { getGuides, getKnots, getLearnProgress, getSeasons } from "@/lib/learn.server";

type Props = { params: Promise<{ locale: string }> };

const HABITAT_PILL: Record<string, string> = { saltwater: "pill-salt", freshwater: "pill-fresh", brackish: "pill-brack" };
const IN_SEASON = 8;

/** Aprender hub ("Manual de campo"): three chapters, knot of the week, what's in season, short guides. */
export default async function LearnPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("learn");
  const tSpecies = await getTranslations("species");
  const en = locale === "en";

  const [guides, knots, seasons, { signedIn, done }] = await Promise.all([getGuides(), getKnots(), getSeasons(), getLearnProgress()]);
  const now = new Date();
  const month = crMonth(now);
  const monthName = new Intl.DateTimeFormat(en ? "en" : "es", { month: "long", timeZone: "UTC" }).format(new Date(Date.UTC(2026, month, 1)));
  const knot = knotOfTheWeek(knots, now);
  const technique = guides.filter((g) => g.chapter === "technique");
  const whereWhen = guides.filter((g) => g.chapter === "where_when");
  const bySpecies = new Map(seasons.map((s) => [s.species_id, s]));
  const peak = inSeason(seasons, month).slice(0, IN_SEASON);

  const techProgress = chapterProgress(technique.map((g) => `guide:${g.slug}`), done);
  const knotProgress = chapterProgress(knots.map((k) => `knot:${k.slug}`), done);
  const whereProgress = chapterProgress(whereWhen.map((g) => `guide:${g.slug}`), done);
  const status = (p: { done: number; total: number }, key: "statusGuides" | "statusKnots") =>
    signedIn ? t(`${key}Progress`, { done: p.done, total: p.total }) : t(key, { count: p.total });
  const bar = (p: { done: number; total: number }) => (signedIn && p.total > 0 ? p.done / p.total : null);
  const sectionTitle = "m-0 font-serif-display text-heading leading-tight";
  const moreLink = "text-small font-semibold text-accent underline-offset-2 hover:underline";

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 pb-24 sm:px-8">
      <header className="mb-8">
        <h1 className="m-0 font-serif-display text-[length:clamp(var(--text-heading),6vw,var(--text-title))] leading-none text-text">{t("title")}</h1>
        <p className="m-0 mt-3 max-w-[60ch] text-body text-muted">{t("intro")}</p>
      </header>

      <div className="grid gap-3 md:grid-cols-3">
        <ChapterCard href="/learn/techniques" icon="technique" title={t("chapterTechnique")} body={t("chapterTechniqueBody")} status={status(techProgress, "statusGuides")} progress={bar(techProgress)} />
        <ChapterCard href="/learn/knots" icon="knots" title={t("chapterKnots")} body={t("chapterKnotsBody")} status={status(knotProgress, "statusKnots")} progress={bar(knotProgress)} />
        <ChapterCard href="/learn/seasons" icon="where_when" title={t("chapterWhereWhen")} body={t("chapterWhereWhenBody")} status={t("statusSeasons", { count: new Set(seasons.map((s) => s.species_id)).size })} progress={bar(whereProgress)} />
      </div>

      {knot && (
        <section className="mt-12" aria-labelledby="knot-week">
          <div className="mb-4 flex flex-wrap items-baseline justify-between gap-3">
            <h2 id="knot-week" className={sectionTitle}>{t("knotOfTheWeek")}</h2>
            <Link href="/learn/knots" className={moreLink}>{t("allKnots")} →</Link>
          </div>
          <div className="rounded-[var(--r-card)] bg-surface p-5 sm:p-6">
            <Link href={`/learn/knots/${knot.slug}`} className="font-serif-display text-subhead font-bold text-text underline-offset-2 hover:underline">
              {en ? knot.name_en : knot.name_es}
            </Link>
            <p className="m-0 mb-5 mt-1 text-small text-muted">{en ? knot.summary_en : knot.summary_es}</p>
            <KnotStepper
              steps={knot.steps}
              locale={locale}
              imageUrl={knot.image_url}
              imageAlt={en ? knot.name_en : knot.name_es}
              imageCredit={knot.image_credit}
              imageSourceUrl={knot.image_source_url}
            />
          </div>
        </section>
      )}

      {peak.length > 0 && (
        <section className="mt-12" aria-labelledby="in-season">
          <div className="mb-4 flex flex-wrap items-baseline justify-between gap-3">
            <h2 id="in-season" className={sectionTitle}>{t("inSeasonTitle", { month: monthName })}</h2>
            <Link href="/learn/seasons" className={moreLink}>{t("fullCalendar")} →</Link>
          </div>
          <ul className="m-0 grid list-none grid-cols-2 gap-3 p-0 md:grid-cols-4">
            {peak.map((p) => {
              const entry = bySpecies.get(p.species_id);
              const sp = entry?.species;
              if (!sp) return null;
              const row = seasons.find((s) => s.species_id === p.species_id && s.region === p.region);
              return (
                <li key={p.species_id} className="min-w-0">
                  <Link
                    href={`/species/${sp.id}`}
                    className="flex h-full flex-col gap-1.5 rounded-[var(--r-card)] bg-surface p-4 hover:bg-raised active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-2 transition-[background-color,transform] duration-[var(--t-ui)] motion-reduce:transition-none motion-reduce:active:scale-100"
                  >
                    <span className="flex flex-wrap gap-1.5">
                      <span className={`rounded-[var(--r-pill)] px-2.5 py-0.5 text-label font-semibold ${HABITAT_PILL[sp.habitat] ?? "pill-brack"}`}>
                        {tSpecies(sp.habitat === "freshwater" || sp.habitat === "saltwater" ? sp.habitat : "brackish")}
                      </span>
                      {p.level === 3 && <span className="rounded-[var(--r-pill)] bg-progress px-2.5 py-0.5 text-label font-semibold text-[var(--ground)]">{t("peak")}</span>}
                    </span>
                    <span className="truncate font-serif-display text-name font-bold text-text">{en ? sp.name_en : sp.name_es}</span>
                    <span className="line-clamp-2 text-label text-muted">{(en ? row?.where_en : row?.where_es) ?? t(`region_${p.region}`)}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {guides.length > 0 && (
        <section className="mt-12" aria-labelledby="guides">
          <div className="mb-4 flex flex-wrap items-baseline justify-between gap-3">
            <h2 id="guides" className={sectionTitle}>{t("shortGuides")}</h2>
            <Link href="/learn/techniques" className={moreLink}>{t("allGuides")} →</Link>
          </div>
          <ul className="m-0 grid list-none gap-3 p-0 sm:grid-cols-2 lg:grid-cols-3">
            {guides.slice(0, 6).map((g) => (
              <li key={g.slug} className="min-w-0">
                <GuideCard guide={g} locale={locale} done={done.has(`guide:${g.slug}`)} />
              </li>
            ))}
          </ul>
        </section>
      )}

      {guides.length === 0 && knots.length === 0 && (
        <p className="mt-10 rounded-[var(--r-card)] bg-surface p-6 text-muted">{t("comingSoon")}</p>
      )}
    </div>
  );
}
