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
        className="text-sm text-cyan-600 dark:text-cyan-400 hover:underline mb-4 inline-flex items-center gap-1"
      >
        <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
        </svg>
        {t("title")}
      </Link>
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
        <div className="h-56 bg-gradient-to-br from-cyan-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center">
          {species.reference_photo_url ? (
            <img
              src={species.reference_photo_url}
              alt={name}
              className="w-full h-full object-cover"
            />
          ) : (
            <svg className="w-20 h-20 text-cyan-300 dark:text-cyan-700" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-1 14.5c-2 0-4-1.5-4-4s2-5 4-5c1 0 2 .5 2.5 1l2-1.5c.5-.3 1 0 .8.5l-1 3h2c.5 0 .7.5.4.8l-4 4c-.3.3-.7.1-.7-.3v-2h-1c-.5 0-1-.3-1-.5z"/>
            </svg>
          )}
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
