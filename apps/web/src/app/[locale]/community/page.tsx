import { setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { fetchFeedCatches, fetchReactionsForCatches } from "@/lib/feed";
import { fetchAllGroupsFeedCatches } from "@/lib/group-feed";
import { getUserGroupsServer } from "@/lib/groups.server";
import type { GroupWithMemberCount } from "@/lib/groups";
import type { FeedCatch, FeedReactions } from "@/lib/feed";
import { FeedList } from "@/components/feed/feed-list";
import { MyGroupsBar } from "@/components/groups/my-groups-bar";
import { Link } from "@/i18n/navigation";

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

  const [catches, groups, groupFeedCatches] = await Promise.all([
    fetchFeedCatches(locale),
    getUserGroupsServer(userId!),
    fetchAllGroupsFeedCatches(userId!, locale),
  ]);

  const allCatchIds = [
    ...groupFeedCatches.map((c) => c.id),
    ...catches.map((c) => c.id),
  ];
  const uniqueCatchIds = [...new Set(allCatchIds)];
  const reactions = await fetchReactionsForCatches(uniqueCatchIds);

  return (
    <CommunityContent
      catches={catches}
      groupFeedCatches={groupFeedCatches}
      reactions={reactions}
      groups={groups}
      locale={locale}
    />
  );
}

function CommunityContent({
  catches,
  groupFeedCatches,
  reactions,
  groups,
  locale,
}: {
  catches: FeedCatch[];
  groupFeedCatches: FeedCatch[];
  reactions: Record<string, FeedReactions>;
  groups: GroupWithMemberCount[];
  locale: string;
}) {
  const t = useTranslations("feed");
  const tGroups = useTranslations("groups");
  const hasGroups = groups.length > 0;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-extrabold mb-6 text-gradient-ocean" style={{ fontFamily: "var(--font-fredoka)" }}>
        {t("title")}
      </h1>

      {/* My Groups Bar — always show if user has groups */}
      {hasGroups && <MyGroupsBar groups={groups} />}

      {/* Group Activity Section */}
      {hasGroups ? (
        <section className="mb-8">
          <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path fillRule="evenodd" d="M8.25 6.75a3.75 3.75 0 1 1 7.5 0 3.75 3.75 0 0 1-7.5 0ZM15.75 9.75a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM2.25 9.75a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM6.31 17.084a11.116 11.116 0 0 1 3.727-1.482 3 3 0 0 1 3.926 0 11.12 11.12 0 0 1 3.727 1.482 4.5 4.5 0 0 0-11.38 0Z" clipRule="evenodd" />
            </svg>
            {t("groupActivity")}
          </h2>
          <FeedList
            initialCatches={groupFeedCatches}
            initialReactions={reactions}
            locale={locale}
            feedType="allGroups"
            emptyMessage={t("noGroupActivity")}
          />
        </section>
      ) : (
        <NoGroupsCard t={t} tGroups={tGroups} />
      )}

      {/* Divider */}
      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-foreground/10" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-background px-4 text-sm font-semibold text-muted">
            {t("discover")}
          </span>
        </div>
      </div>

      {/* Global Feed */}
      <FeedList initialCatches={catches} initialReactions={reactions} locale={locale} />
    </div>
  );
}

function NoGroupsCard({
  t,
  tGroups,
}: {
  t: ReturnType<typeof useTranslations<"feed">>;
  tGroups: ReturnType<typeof useTranslations<"groups">>;
}) {
  return (
    <div className="rounded-2xl bg-surface dark:bg-surface-alt ring-1 ring-foreground/5 dark:ring-white/5 p-6 mb-4 text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-primary/10 mb-4">
        <svg className="w-8 h-8 text-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path fillRule="evenodd" d="M8.25 6.75a3.75 3.75 0 1 1 7.5 0 3.75 3.75 0 0 1-7.5 0ZM15.75 9.75a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM2.25 9.75a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM6.31 17.084a11.116 11.116 0 0 1 3.727-1.482 3 3 0 0 1 3.926 0 11.12 11.12 0 0 1 3.727 1.482 4.5 4.5 0 0 0-11.38 0Z" clipRule="evenodd" />
        </svg>
      </div>
      <h3 className="text-base font-bold text-foreground mb-1">{t("noGroupsTitle")}</h3>
      <p className="text-sm text-muted mb-5">{t("noGroupsDescription")}</p>
      <div className="flex items-center justify-center gap-3">
        <Link
          href="/groups/new"
          className="px-4 py-2.5 rounded-xl text-sm font-bold text-white bg-primary hover:bg-primary-dark active:scale-[0.97] transition-all"
        >
          {tGroups("createGroup")}
        </Link>
        <Link
          href="/groups/join"
          className="px-4 py-2.5 rounded-xl text-sm font-bold text-primary bg-primary/10 hover:bg-primary/15 active:scale-[0.97] transition-all"
        >
          {t("joinWithCode")}
        </Link>
      </div>
    </div>
  );
}
