import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { LearnHeader } from "@/components/learn/learn-header";
import { MarkdownBody } from "@/components/learn/markdown-body";
import { MarkDoneButton } from "@/components/learn/mark-done-button";
import { getGuide, getLearnProgress } from "@/lib/learn.server";

type Props = { params: Promise<{ locale: string; slug: string }> };

export default async function GuidePage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("learn");
  const [guide, { signedIn, done }] = await Promise.all([getGuide(slug), getLearnProgress()]);
  if (!guide) notFound();
  const en = locale === "en";
  const chapterHref = guide.chapter === "technique" ? "/learn/techniques" : "/learn/seasons";
  const chapterLabel = t(guide.chapter === "technique" ? "chapterTechnique" : "chapterWhereWhen");

  return (
    <article className="mx-auto max-w-3xl px-4 py-10 pb-24 sm:px-8">
      <LearnHeader
        back={{ href: chapterHref, label: chapterLabel }}
        title={en ? guide.title_en : guide.title_es}
        intro={en ? guide.summary_en : guide.summary_es}
        meta={t("minutesRead", { count: guide.read_minutes })}
      />
      <MarkdownBody source={en ? guide.body_en : guide.body_es} />
      <div className="mt-10 border-t border-rule pt-6">
        <MarkDoneButton itemType="guide" slug={guide.slug} initiallyDone={done.has(`guide:${guide.slug}`)} signedIn={signedIn} />
      </div>
      {guide.sources.length > 0 && (
        <section className="mt-8" aria-labelledby="sources">
          <h2 id="sources" className="m-0 mb-2 text-small font-semibold text-muted">{t("sources")}</h2>
          <ul className="m-0 flex flex-col gap-1 pl-5 text-label text-muted">
            {guide.sources.map((url) => (
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
