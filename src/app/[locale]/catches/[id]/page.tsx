import { setRequestLocale } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
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

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) redirect(`/${locale}/auth/login`);

    const { data: catchData } = await supabase
      .from("catches")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (!catchData) notFound();
    const c = catchData as CatchRow;

    const { data: speciesData } = await supabase
      .from("species")
      .select("name_es, name_en")
      .eq("id", c.species_id)
      .single();

    const s = speciesData as Pick<SpeciesRow, "name_es" | "name_en"> | null;
    const speciesName = s
      ? locale === "es"
        ? s.name_es
        : s.name_en
      : "";

    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Link
          href={`/${locale}/catches`}
          className="text-sm text-blue-600 hover:underline mb-4 inline-block"
        >
          &larr; Back
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
          }}
        />
      </div>
    );
  } catch {
    redirect(`/${locale}/auth/login`);
  }
}
