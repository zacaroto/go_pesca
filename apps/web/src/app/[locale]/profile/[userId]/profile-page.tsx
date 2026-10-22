"use client";

import { useState } from "react";
import { ProfileHeader } from "@/components/profile/profile-header";
import { ProfileStats } from "@/components/profile/profile-stats";
import { ProfileEditDrawer } from "@/components/profile/profile-edit-drawer";
import type { Database } from "@/lib/database.types";

type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];

type Props = {
  profile: ProfileRow;
  stats: {
    totalCatches: number;
    speciesCaught: number;
    trophies: number;
    achievements: number | null;
  };
  rankData: { caught: number; total: number };
  isOwner: boolean;
  /** Records table and catches grid, rendered on the server. */
  children: React.ReactNode;
};

/** "Ficha del pescador": identity column on the left; rank, numbers, records and catches on the right. */
export function ProfilePage({ profile, stats, rankData, isOwner, children }: Props) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 pb-24 md:px-10">
      <div className="grid items-start gap-5 lg:grid-cols-[300px_minmax(0,1fr)]">
        <div className="lg:sticky lg:top-20">
          <ProfileHeader profile={profile} isOwner={isOwner} onEdit={() => setDrawerOpen(true)} />
        </div>
        <div className="flex min-w-0 flex-col gap-5">
          <ProfileStats stats={stats} rankData={rankData} />
          {children}
        </div>
      </div>
      {isOwner && (
        <ProfileEditDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} profile={profile} />
      )}
    </div>
  );
}
