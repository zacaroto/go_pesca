import { getTranslations, setRequestLocale } from "next-intl/server";
import { KnotCard } from "@/components/learn/cards";
import { LearnHeader } from "@/components/learn/learn-header";
import { getKnots, getLearnProgress } from "@/lib/learn.server";

type Props = { params: Promise<{ locale: string }> };

export default async function KnotsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("learn");
  const [knots, { done }] = await Promise.all([getKnots(), getLearnProgress()]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 pb-24 sm:px-8">
      <LearnHeader back={{ href: "/learn", label: t("title") }} title={t("chapterKnots")} intro={t("chapterKnotsBody")} />
      {knots.length === 0 ? (
        <p className="rounded-[var(--r-card)] bg-surface p-6 text-muted">{t("comingSoon")}</p>
      ) : (
        <ul className="m-0 grid list-none gap-3 p-0 sm:grid-cols-2 lg:grid-cols-3">
          {knots.map((k) => (
            <li key={k.slug} className="min-w-0">
              <KnotCard knot={k} locale={locale} done={done.has(`knot:${k.slug}`)} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
