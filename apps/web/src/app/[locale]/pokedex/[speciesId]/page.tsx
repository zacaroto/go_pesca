import { setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import { getSpeciesCatches } from "@/lib/pokedex";
import { SpeciesCatches } from "@/components/pokedex/species-catches";
import Link from "next/link";

type Props = {
  params: Promise<{ locale: string; speciesId: string }>;
};

export default async function PokedexSpeciesPage({ params }: Props) {
  const { locale, speciesId } = await params;
  setRequestLocale(locale);

  let species = null;
  let catches: Awaited<ReturnType<typeof getSpeciesCatches>>["catches"] = [];

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) redirect(`/${locale}/auth/login`);

    const result = await getSpeciesCatches(user.id, parseInt(speciesId));
    species = result.species;
    catches = result.catches;
  } catch {
    redirect(`/${locale}/auth/login`);
  }

  if (!species) notFound();

  return (
    <PokedexSpeciesContent
      species={species}
      catches={catches}
      locale={locale}
    />
  );
}

function PokedexSpeciesContent({
  species,
  catches,
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
  catches: Awaited<ReturnType<typeof getSpeciesCatches>>["catches"];
  locale: string;
}) {
  const t = useTranslations("pokedex");
  const tSpecies = useTranslations("species");
  const name = locale === "es" ? species.name_es : species.name_en;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Link
        href="/pokedex"
        className="text-sm text-blue-600 hover:underline mb-4 inline-block"
      >
        &larr; {t("title")}
      </Link>

      <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <h1 className="text-2xl font-bold mb-1">{name}</h1>
        <p className="text-gray-500 italic mb-1">{species.scientific_name}</p>
        <p className="text-sm text-gray-500">{tSpecies("habitat")}: {
          species.habitat === "freshwater"
            ? tSpecies("freshwater")
            : species.habitat === "saltwater"
              ? tSpecies("saltwater")
              : tSpecies("brackish")
        }</p>
      </div>

      <h2 className="text-lg font-semibold mb-4">{t("totalCatches")}</h2>
      <SpeciesCatches catches={catches} locale={locale} />
    </div>
  );
}
