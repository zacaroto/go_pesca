"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { GroupHeader } from "@/components/groups/group-header";
import { GroupMemberList, type GroupMember } from "@/components/groups/group-member-list";
import { InvitePanel } from "@/components/groups/invite-panel";
import { MagazineGrid } from "@/components/feed/magazine-grid";
import { createGroupFeedFetcher } from "@/lib/group-feed-client";
import type { FeedCatch, FeedReactions } from "@/lib/feed";
import type { GroupWithMemberCount } from "@/lib/groups";

type Props = {
  group: GroupWithMemberCount;
  members: GroupMember[];
  catches: FeedCatch[];
  reactions: Record<string, FeedReactions>;
  userId: string;
  locale: string;
};

/** "Bitácora del grupo": the group's catches as a magazine, with members and invite in a side rail. */
export function GroupDetailContent({ group, members, catches, reactions, userId, locale }: Props) {
  const t = useTranslations("groups");
  const isCreator = group.created_by === userId;
  const fetchMore = useMemo(() => createGroupFeedFetcher(group.id), [group.id]);

  return (
    <div className="mx-auto w-full max-w-[1280px] px-4 py-10 sm:px-12">
      <GroupHeader group={group} members={members} isCreator={isCreator} locale={locale} />
      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <section aria-labelledby="group-catches-title" className="min-w-0">
          <h2 id="group-catches-title" className="m-0 mb-3.5 font-serif-display text-heading font-bold">
            {t("groupFeed")}
          </h2>
          <MagazineGrid
            initialCatches={catches}
            initialReactions={reactions}
            locale={locale}
            fetchMoreFn={fetchMore}
            columns={3}
            emptyMessage={t("emptyFeed")}
          />
        </section>
        <aside className="grid gap-4">
          <GroupMemberList members={members} />
          <InvitePanel inviteCode={group.invite_code} locale={locale} memberCount={group.member_count} />
        </aside>
      </div>
    </div>
  );
}
