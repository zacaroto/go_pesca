import { setRequestLocale } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getGroupById, isGroupMember, getGroupMembers } from "@/lib/groups";
import { fetchGroupFeedCatches } from "@/lib/group-feed";
import { fetchReactionsForCatches } from "@/lib/feed";
import { GroupDetailContent } from "./group-detail-content";

type Props = {
  params: Promise<{ locale: string; groupId: string }>;
};

export default async function GroupDetailPage({ params }: Props) {
  const { locale, groupId } = await params;
  setRequestLocale(locale);

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/auth/login`);

  const group = await getGroupById(groupId);
  if (!group) redirect(`/${locale}/community`);

  const isMember = await isGroupMember(groupId, user.id);
  if (!isMember) redirect(`/${locale}/community`);

  const [members, catches] = await Promise.all([
    getGroupMembers(groupId),
    fetchGroupFeedCatches(groupId, locale),
  ]);

  const reactions = await fetchReactionsForCatches(catches.map((c) => c.id));

  return (
    <GroupDetailContent
      group={group}
      members={members}
      catches={catches}
      reactions={reactions}
      userId={user.id}
      locale={locale}
    />
  );
}
