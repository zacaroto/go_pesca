import { setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import { SuggestionForm } from "@/components/species/suggestion-form";
import Link from "next/link";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function SuggestSpeciesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <SuggestContent locale={locale} />;
}

function SuggestContent({ locale }: { locale: string }) {
  const t = useTranslations("species");

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <Link
        href="/species"
        className="text-sm font-medium text-accent-ink hover:underline active:underline underline-offset-2 mb-4 inline-block"
      >
        &larr; {t("title")}
      </Link>
      <h1 className="font-serif-display text-3xl font-bold mb-6">{t("suggestionTitle")}</h1>
      <SuggestionForm locale={locale} />
    </div>
  );
}
