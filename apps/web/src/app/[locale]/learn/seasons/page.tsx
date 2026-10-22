import { getTranslations, setRequestLocale } from "next-intl/server";
import { GuideCard } from "@/components/learn/cards";
import { LearnHeader } from "@/components/learn/learn-header";
import { SeasonCalendar } from "@/components/learn/season-calendar";
import { crMonth } from "@/lib/learn";
import { getGuides, getLearnProgress, getSeasons } from "@/lib/learn.server";

type Props = { params: Promise<{ locale: string }> };

/** "Dónde y cuándo": the season calendar first, then the where/when guides (tides, moon, reading water). */
export default async function SeasonsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("learn");
  const [seasons, guides, { done }] = await Promise.all([getSeasons(), getGuides(), getLearnProgress()]);
  const whereWhen = guides.filter((g) => g.chapter === "where_when");

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 pb-24 sm:px-8">
      <LearnHeader back={{ href: "/learn", label: t("title") }} title={t("seasonsTitle")} intro={t("seasonsIntro")} />
      <SeasonCalendar seasons={seasons} month={crMonth(new Date())} locale={locale} />
      <p className="m-0 mt-3 text-label text-muted">{t("seasonsDisclaimer")}</p>

      {whereWhen.length > 0 && (
        <section className="mt-12" aria-labelledby="where-when-guides">
          <h2 id="where-when-guides" className="m-0 mb-4 font-serif-display text-heading leading-tight">{t("chapterWhereWhen")}</h2>
          <ul className="m-0 grid list-none gap-3 p-0 sm:grid-cols-2 lg:grid-cols-3">
            {whereWhen.map((g) => (
              <li key={g.slug} className="min-w-0">
                <GuideCard guide={g} locale={locale} done={done.has(`guide:${g.slug}`)} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
