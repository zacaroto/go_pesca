import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { ProfilePage } from "./profile-page";
import { PersonalRecords } from "@/components/profile/personal-records";
import { ProfileCatches } from "@/components/profile/profile-catches";
import { isTrophy, personalRecords, type RecordCatch, type RecordSpecies } from "@/lib/profile-records";
import type { Database } from "@/lib/database.types";

type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];

type Props = {
  params: Promise<{ locale: string; userId: string }>;
};

type CatchRow = RecordCatch & { photo_url: string | null; location_name: string | null };

const RECENT_CATCHES = 12;

export default async function ProfileRoute({ params }: Props) {
  const { locale, userId } = await params;
  const supabase = await createClient();

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", userId).single();

  if (!profile) {
    const t = await getTranslations("profile");
    return <div className="max-w-lg mx-auto px-4 py-20 text-center text-muted">{t("notFound")}</div>;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isOwner = user?.id === userId;
  const nameCol = locale === "en" ? "name_en" : "name_es";

  // Never select latitude/longitude here: this page is public.
  const [{ data: catchRows }, { data: speciesRows }, achievementsRes] = await Promise.all([
    supabase
      .from("catches")
      .select("id, species_id, photo_url, weight_kg, length_cm, catch_date, location_name")
      .eq("user_id", userId)
      .order("catch_date", { ascending: false })
      .order("created_at", { ascending: false }),
    supabase.from("species").select(`id, ${nameCol}, trophy_weight_kg, trophy_length_cm`),
    isOwner
      ? supabase.from("user_achievements").select("*", { count: "exact", head: true }).eq("user_id", userId)
      : Promise.resolve({ count: null }),
  ]);

  const catches = (catchRows ?? []) as CatchRow[];
  const species: RecordSpecies[] = ((speciesRows ?? []) as Record<string, unknown>[]).map((r) => ({
    id: r.id as number,
    name: (r[nameCol] as string) ?? "",
    trophy_weight_kg: (r.trophy_weight_kg as number | null) ?? null,
    trophy_length_cm: (r.trophy_length_cm as number | null) ?? null,
  }));
  const speciesById = new Map(species.map((s) => [s.id, s]));

  const trophyIds = new Set(catches.filter((c) => isTrophy(c, speciesById.get(c.species_id))).map((c) => c.id));
  const speciesCaught = new Set(catches.map((c) => c.species_id)).size;

  const stats = {
    totalCatches: catches.length,
    speciesCaught,
    trophies: trophyIds.size,
    achievements: isOwner ? (achievementsRes.count ?? 0) : null,
  };

  const recent = catches.slice(0, RECENT_CATCHES).map((c) => ({
    id: c.id,
    speciesName: speciesById.get(c.species_id)?.name ?? "—",
    photoUrl: c.photo_url,
    weightKg: c.weight_kg,
    locationName: c.location_name,
    trophy: trophyIds.has(c.id),
  }));

  return (
    <ProfilePage
      profile={profile as ProfileRow}
      stats={stats}
      rankData={{ caught: speciesCaught, total: species.length }}
      isOwner={isOwner}
    >
      <PersonalRecords records={personalRecords(catches, species)} locale={locale} />
      <ProfileCatches catches={recent} isOwner={isOwner} locale={locale} />
    </ProfilePage>
  );
}
