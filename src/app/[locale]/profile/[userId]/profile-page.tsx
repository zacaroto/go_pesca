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
    achievements: number;
  };
  rankData: { caught: number; total: number };
  isOwner: boolean;
};

export function ProfilePage({ profile, stats, rankData, isOwner }: Props) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-4">
      <ProfileHeader
        profile={profile}
        isOwner={isOwner}
        onEdit={() => setDrawerOpen(true)}
      />
      <ProfileStats
        stats={stats}
        memberSince={profile.created_at}
        rankData={rankData}
      />
      {isOwner && (
        <ProfileEditDrawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          profile={profile}
        />
      )}
    </div>
  );
}
