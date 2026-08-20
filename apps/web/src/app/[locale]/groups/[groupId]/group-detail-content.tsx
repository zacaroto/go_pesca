"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { GroupHeader } from "@/components/groups/group-header";
import { GroupMemberList } from "@/components/groups/group-member-list";
import { FeedList } from "@/components/feed/feed-list";
import { createGroupFeedFetcher } from "@/lib/group-feed-client";
import type { FeedCatch, FeedReactions } from "@/lib/feed";
import type { GroupWithMemberCount } from "@/lib/groups";

type Props = {
  group: GroupWithMemberCount;
  members: {
    user_id: string;
    role: string;
    display_name: string;
    avatar_url: string | null;
  }[];
  catches: FeedCatch[];
  reactions: Record<string, FeedReactions>;
  userId: string;
  locale: string;
};

export function GroupDetailContent({ group, members, catches, reactions, userId, locale }: Props) {
  const t = useTranslations("groups");
  const isCreator = group.created_by === userId;
  const fetchMore = useMemo(() => createGroupFeedFetcher(group.id), [group.id]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-4">
      <GroupHeader group={group} isCreator={isCreator} locale={locale} />
      <GroupMemberList members={members} />
      <h2 className="text-lg font-bold text-foreground pt-2" style={{ fontFamily: "var(--font-fredoka)" }}>
        {t("groupFeed")}
      </h2>
      <FeedList
        initialCatches={catches}
        initialReactions={reactions}
        locale={locale}
        fetchMoreFn={fetchMore}
        emptyMessage={t("emptyFeed")}
      />
    </div>
  );
}
