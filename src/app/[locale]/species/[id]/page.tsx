import { setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";

type Props = {
  params: Promise<{ locale: string; id: string }>;
};

export default async function SpeciesDetailPage({ params }: Props) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  let species = null;
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("species")
      .select("*")
      .eq("id", parseInt(id))
      .single();
    species = data;
  } catch {
    // Supabase not configured
  }

  if (!species) {
    notFound();
  }

  return <SpeciesDetail species={species} locale={locale} />;
}

function SpeciesDetail({
  species,
  locale,
}: {
  species: {
    id: number;
    name_es: string;
    name_en: string;
    scientific_name: string;
    habitat: string;
    description_es: string | null;
    description_en: string | null;
    reference_photo_url: string | null;
  };
  locale: string;
}) {
  const t = useTranslations("species");
  const name = locale === "es" ? species.name_es : species.name_en;
  const description =
    locale === "es" ? species.description_es : species.description_en;

  const habitatLabel =
    species.habitat === "freshwater"
      ? t("freshwater")
      : species.habitat === "saltwater"
        ? t("saltwater")
        : t("brackish");

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Link
        href="/species"
        className="text-sm text-blue-600 hover:underline mb-4 inline-block"
      >
        &larr; {t("title")}
      </Link>
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="h-56 bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-6xl">
          🐟
        </div>
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-1">{name}</h1>
          <p className="text-gray-500 italic mb-1">{species.scientific_name}</p>
          <p className="text-sm mb-4">
            <span className="font-medium">{t("habitat")}:</span> {habitatLabel}
          </p>
          {locale === "es" && species.name_en && (
            <p className="text-sm text-gray-500 mb-2">
              English: {species.name_en}
            </p>
          )}
          {locale === "en" && species.name_es && (
            <p className="text-sm text-gray-500 mb-2">
              Español: {species.name_es}
            </p>
          )}
          {description && (
            <div className="mt-4">
              <h2 className="font-semibold mb-1">{t("description")}</h2>
              <p className="text-gray-700 dark:text-gray-300">{description}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
