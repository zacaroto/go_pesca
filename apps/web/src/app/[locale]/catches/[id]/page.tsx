import { getTranslations, setRequestLocale } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { CatchDetail } from "@/components/catches/catch-detail";
import type { Database } from "@/lib/database.types";

type CatchRow = Database["public"]["Tables"]["catches"]["Row"];
type SpeciesRow = Database["public"]["Tables"]["species"]["Row"];

type Props = {
  params: Promise<{ locale: string; id: string }>;
};

export default async function CatchDetailPage({ params }: Props) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  let user = null as { id: string } | null;
  let catchData = null as CatchRow | null;
  let speciesData = null as Pick<SpeciesRow, "name_es" | "name_en"> | null;
  try {
    const supabase = await createClient();
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();
    user = authUser;
    if (user) {
      const { data } = await supabase
        .from("catches")
        .select("*")
        .eq("id", id)
        .eq("user_id", user.id)
        .single();
      catchData = (data as CatchRow | null) ?? null;
      if (catchData) {
        const { data: sp } = await supabase
          .from("species")
          .select("name_es, name_en")
          .eq("id", catchData.species_id)
          .single();
        speciesData = sp as typeof speciesData;
      }
    }
  } catch {
    // auth or data failure: treat as signed out
    user = null;
  }

  // Control-flow calls live outside try/catch so Next can handle them.
  if (!user) redirect(`/${locale}/auth/login`);
  if (!catchData) notFound();
  const c = catchData;
  const t = await getTranslations("catches");
  const s = speciesData;
  const speciesName = s
    ? locale === "es"
      ? s.name_es
      : s.name_en
    : "";

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Link
        href="/catches"
        className="text-small font-medium text-accent-ink hover:underline active:underline underline-offset-2 mb-4 inline-block"
      >
        &larr; {t("backToCatches")}
      </Link>
      <CatchDetail
        locale={locale}
        catch_data={{
          id: c.id,
          photo_url: c.photo_url,
          catch_date: c.catch_date,
          latitude: c.latitude,
          longitude: c.longitude,
          location_name: c.location_name,
          weight_kg: c.weight_kg,
          length_cm: c.length_cm,
          bait_lure: c.bait_lure,
          weather: c.weather,
          tide: c.tide,
          time_of_day: c.time_of_day,
          notes: c.notes,
          species_name: speciesName,
          species_id: c.species_id,
          is_public: c.is_public,
        }}
      />
    </div>
  );
}
