import { setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { CatchList } from "@/components/catches/catch-list";
import type { Database } from "@/lib/database.types";

type CatchRow = Database["public"]["Tables"]["catches"]["Row"];
type SpeciesRow = Database["public"]["Tables"]["species"]["Row"];

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function CatchesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  let catches: { id: string; photo_url: string; catch_date: string; location_name: string | null; species_id: number; species_name: string }[] = [];
  let speciesList: { id: number; name: string }[] = [];

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) redirect(`/${locale}/auth/login`);

    const { data: catchData } = await supabase
      .from("catches")
      .select("*")
      .eq("user_id", user.id)
      .order("catch_date", { ascending: false });

    const { data: speciesData } = await supabase
      .from("species")
      .select("id, name_es, name_en")
      .order("name_es");

    const speciesMap = new Map<number, string>();
    if (speciesData) {
      for (const s of speciesData as Pick<SpeciesRow, "id" | "name_es" | "name_en">[]) {
        speciesMap.set(s.id, locale === "es" ? s.name_es : s.name_en);
      }
      speciesList = (speciesData as Pick<SpeciesRow, "id" | "name_es" | "name_en">[]).map((s) => ({
        id: s.id,
        name: locale === "es" ? s.name_es : s.name_en,
      }));
    }

    if (catchData) {
      catches = (catchData as CatchRow[]).map((c) => ({
        id: c.id,
        photo_url: c.photo_url,
        catch_date: c.catch_date,
        location_name: c.location_name,
        species_id: c.species_id,
        species_name: speciesMap.get(c.species_id) ?? "",
      }));
    }
  } catch {
    redirect(`/${locale}/auth/login`);
  }

  return (
    <CatchesContent
      catches={catches}
      species={speciesList}
      locale={locale}
    />
  );
}

function CatchesContent({
  catches,
  species,
  locale,
}: {
  catches: { id: string; photo_url: string; catch_date: string; location_name: string | null; species_id: number; species_name: string }[];
  species: { id: number; name: string }[];
  locale: string;
}) {
  const t = useTranslations("catches");

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        <Link
          href={`/${locale}/catches/new`}
          className="inline-flex items-center gap-1.5 bg-cyan-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-cyan-700 active:scale-[0.98] shadow-sm shadow-cyan-600/25 transition-all duration-200"
        >
          <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path fillRule="evenodd" d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
          </svg>
          {t("newCatch")}
        </Link>
      </div>
      <CatchList catches={catches} species={species} />
    </div>
  );
}
