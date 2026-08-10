import { setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { fetchFeedCatches, fetchReactionsForCatches } from "@/lib/feed";
import { getUserGroupsServer } from "@/lib/groups";
import type { GroupWithMemberCount } from "@/lib/groups";
import { FeedList } from "@/components/feed/feed-list";
import { MyGroupsBar } from "@/components/groups/my-groups-bar";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function CommunityPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  let userId: string;
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) redirect(`/${locale}/auth/login`);
    userId = user.id;
  } catch {
    redirect(`/${locale}/auth/login`);
  }

  const [catches, groups] = await Promise.all([
    fetchFeedCatches(locale),
    getUserGroupsServer(userId!),
  ]);
  const reactions = await fetchReactionsForCatches(catches.map((c) => c.id));

  return <CommunityContent catches={catches} reactions={reactions} groups={groups} locale={locale} />;
}

function CommunityContent({
  catches,
  reactions,
  groups,
  locale,
}: {
  catches: Awaited<ReturnType<typeof fetchFeedCatches>>;
  reactions: Awaited<ReturnType<typeof fetchReactionsForCatches>>;
  groups: GroupWithMemberCount[];
  locale: string;
}) {
  const t = useTranslations("feed");

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-extrabold mb-6 text-gradient-ocean" style={{ fontFamily: "var(--font-fredoka)" }}>
        {t("title")}
      </h1>
      <MyGroupsBar groups={groups} />
      <FeedList initialCatches={catches} initialReactions={reactions} locale={locale} />
    </div>
  );
}
