import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { KnotStepper } from "@/components/learn/knot-stepper";
import { LearnHeader } from "@/components/learn/learn-header";
import { MarkDoneButton } from "@/components/learn/mark-done-button";
import { getKnots, getLearnProgress } from "@/lib/learn.server";

type Props = { params: Promise<{ locale: string; slug: string }> };

export default async function KnotPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("learn");
  const [knots, { signedIn, done }] = await Promise.all([getKnots(), getLearnProgress()]);
  const knot = knots.find((k) => k.slug === slug);
  if (!knot) notFound();
  const en = locale === "en";
  const name = en ? knot.name_en : knot.name_es;

  return (
    <article className="mx-auto max-w-5xl px-4 py-10 pb-24 sm:px-8">
      <LearnHeader
        back={{ href: "/learn/knots", label: t("chapterKnots") }}
        title={name}
        intro={en ? knot.summary_en : knot.summary_es}
        meta={`${t(`difficulty${knot.difficulty}`)} · ${t("stepsCount", { count: knot.steps.length })}`}
      />
      <p className="m-0 mb-6 rounded-[var(--r-card)] bg-surface p-4 text-small">
        <strong className="font-semibold">{t("bestFor")}</strong> {en ? knot.best_for_en : knot.best_for_es}
      </p>
      <KnotStepper
        steps={knot.steps}
        locale={locale}
        imageUrl={knot.image_url}
        imageAlt={name}
        imageCredit={knot.image_credit}
        imageSourceUrl={knot.image_source_url}
      />
      <div className="mt-10 border-t border-rule pt-6">
        <MarkDoneButton itemType="knot" slug={knot.slug} initiallyDone={done.has(`knot:${knot.slug}`)} signedIn={signedIn} />
      </div>
      {knot.sources.length > 0 && (
        <section className="mt-8" aria-labelledby="sources">
          <h2 id="sources" className="m-0 mb-2 text-small font-semibold text-muted">{t("sources")}</h2>
          <ul className="m-0 flex flex-col gap-1 pl-5 text-label text-muted">
            {knot.sources.map((url) => (
              <li key={url} className="break-all">
                <a href={url} target="_blank" rel="noopener noreferrer" className="underline-offset-2 hover:underline">{url}</a>
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}
