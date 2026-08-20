import { createClient } from "@/lib/supabase/server";
import { ProfilePage } from "./profile-page";
import type { Database } from "@/lib/database.types";

type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];

type Props = {
  params: Promise<{ locale: string; userId: string }>;
};

export default async function ProfileRoute({ params }: Props) {
  const { userId } = await params;
  const supabase = await createClient();

  // Fetch profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (!profile) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center text-muted">
        Profile not found.
      </div>
    );
  }

  // Check if viewer is owner
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isOwner = user?.id === userId;

  // Fetch stats in parallel
  const [{ count: catchCount }, { data: speciesRows }, { count: achievementCount }, { count: totalSpecies }] =
    await Promise.all([
      supabase
        .from("catches")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId),
      supabase
        .from("catches")
        .select("species_id")
        .eq("user_id", userId),
      supabase
        .from("user_achievements")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId),
      supabase
        .from("species")
        .select("*", { count: "exact", head: true }),
    ]);

  const distinctSpecies = new Set(
    (speciesRows ?? []).map((r: { species_id: number }) => r.species_id)
  );

  const stats = {
    totalCatches: catchCount ?? 0,
    speciesCaught: distinctSpecies.size,
    achievements: achievementCount ?? 0,
  };

  const rankData = {
    caught: distinctSpecies.size,
    total: totalSpecies ?? 0,
  };

  return (
    <ProfilePage
      profile={profile as ProfileRow}
      stats={stats}
      rankData={rankData}
      isOwner={isOwner}
    />
  );
}
