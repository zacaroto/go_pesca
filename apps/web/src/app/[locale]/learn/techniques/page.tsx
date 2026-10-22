import { getTranslations, setRequestLocale } from "next-intl/server";
import { GuideCard } from "@/components/learn/cards";
import { LearnHeader } from "@/components/learn/learn-header";
import { getGuides, getLearnProgress } from "@/lib/learn.server";

type Props = { params: Promise<{ locale: string }> };

export default async function TechniquesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("learn");
  const [guides, { done }] = await Promise.all([getGuides(), getLearnProgress()]);
  const technique = guides.filter((g) => g.chapter === "technique");

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 pb-24 sm:px-8">
      <LearnHeader back={{ href: "/learn", label: t("title") }} title={t("chapterTechnique")} intro={t("chapterTechniqueBody")} />
      {technique.length === 0 ? (
        <p className="rounded-[var(--r-card)] bg-surface p-6 text-muted">{t("comingSoon")}</p>
      ) : (
        <ul className="m-0 grid list-none gap-3 p-0 sm:grid-cols-2 lg:grid-cols-3">
          {technique.map((g) => (
            <li key={g.slug} className="min-w-0">
              <GuideCard guide={g} locale={locale} done={done.has(`guide:${g.slug}`)} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
