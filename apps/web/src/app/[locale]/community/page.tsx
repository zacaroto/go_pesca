import { getTranslations, setRequestLocale } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { fetchFeedCatches, fetchReactionsForCatches } from "@/lib/feed";
import { fetchAllGroupsFeedCatches } from "@/lib/group-feed";
import { getUserGroupsServer } from "@/lib/groups.server";
import { CommunityTabs } from "@/components/feed/magazine-grid";
import { computeRecords } from "@/lib/community-mosaic";
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
  const t = await getTranslations("feed");
  const tGroups = await getTranslations("groups");
  const hasGroups = groups.length > 0;
  const weekCount = computeRecords(catches, new Date()).weekCount;

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <h1 className="font-serif-display text-[40px] sm:text-[52px] font-black leading-none text-[var(--text)]">
        {t("title")}
      </h1>
      <p className="mt-3 mb-8 text-base text-[var(--muted)]">{t("subtitle", { count: weekCount })}</p>

      {hasGroups && <MyGroupsBar groups={groups} />}

      <CommunityTabs
        catches={catches}
        groupFeedCatches={groupFeedCatches}
        reactions={reactions}
        locale={locale}
        hasGroups={hasGroups}
      />

      {!hasGroups && (
        <section className="mt-10 rounded-[var(--r-card)] bg-[var(--surface)] p-6 text-center">
          <h2 className="font-serif-display text-2xl font-bold text-[var(--text)]">{t("noGroupsTitle")}</h2>
          <p className="mt-1 mb-5 text-sm text-[var(--muted)]">{t("noGroupsDescription")}</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/groups/new"
              className="px-5 py-2.5 rounded-[var(--r-pill)] text-sm font-semibold text-[var(--on-primary)] bg-[var(--accent)] transition-[background-color,transform] duration-[var(--t-ui)] ease-[var(--ease-out)] motion-reduce:transition-none hover:bg-[var(--accent-hi)] active:scale-[0.97] motion-reduce:active:scale-100 focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              {tGroups("createGroup")}
            </Link>
            <Link
              href="/groups/join"
              className="px-5 py-2.5 rounded-[var(--r-pill)] text-sm font-semibold text-[var(--text)] bg-[var(--raised)] transition-[background-color,transform] duration-[var(--t-ui)] ease-[var(--ease-out)] motion-reduce:transition-none hover:bg-[var(--border)] active:scale-[0.97] motion-reduce:active:scale-100 focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              {t("joinWithCode")}
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
