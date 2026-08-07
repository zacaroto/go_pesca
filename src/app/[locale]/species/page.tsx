import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { SpeciesGrid } from "@/components/species/species-grid";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function SpeciesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  let species: Array<{
    id: number;
    name_es: string;
    name_en: string;
    scientific_name: string;
    habitat: string;
    description_es: string | null;
    description_en: string | null;
    reference_photo_url: string | null;
  }> = [];

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("species")
      .select("*")
      .order("name_es");
    if (data) species = data;
  } catch {
    // Supabase not configured
  }

  return <SpeciesPageContent species={species} locale={locale} />;
}

function SpeciesPageContent({
  species,
  locale,
}: {
  species: Array<{
    id: number;
    name_es: string;
    name_en: string;
    scientific_name: string;
    habitat: string;
    description_es: string | null;
    description_en: string | null;
    reference_photo_url: string | null;
  }>;
  locale: string;
}) {
  const t = useTranslations("species");

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{t("title")}</h1>
      <SpeciesGrid species={species} locale={locale} />
    </div>
  );
}
