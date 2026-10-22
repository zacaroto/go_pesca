import { getTranslations, setRequestLocale } from "next-intl/server";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getGroupsOverviewData, getUserGroupsServer } from "@/lib/groups.server";
import { summarizeGroup } from "@/lib/group-overview";
import { relativeDate } from "@/lib/community-mosaic";
import type { GroupWithMemberCount } from "@/lib/groups";
import { Link } from "@/i18n/navigation";
import { GroupCard } from "@/components/groups/group-card";
import { JoinByCode } from "@/components/groups/join-by-code";

type Props = {
  params: Promise<{ locale: string }>;
};

const BTN =
  "inline-flex h-10 items-center gap-2 rounded-full bg-accent px-5 text-small font-semibold text-on-primary hover:bg-accent-hi active:bg-accent-hi active:scale-[0.97] transition-[background-color,transform] duration-[var(--t-press)] ease-[var(--ease-out)] motion-reduce:transition-none motion-reduce:active:scale-100 focus-visible:outline-2 focus-visible:outline-offset-2";

/** Groups index ("Tarjetas con fotos"): one card per group with its newest shared catches and members. */
export default async function GroupsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("groups");
  const tFeed = await getTranslations("feed");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/auth/login`);

  let groups: GroupWithMemberCount[] = [];
  let overview: Awaited<ReturnType<typeof getGroupsOverviewData>> = { members: new Map(), catches: [] };
  let loadFailed = false;
  try {
    groups = await getUserGroupsServer(user.id);
    overview = await getGroupsOverviewData(groups.map((g) => g.id), locale);
  } catch (error) {
    console.error("Failed to load groups", error);
    loadFailed = groups.length === 0;
  }

  const now = new Date();
  const cards = groups.map((group) => {
    const members = overview.members.get(group.id) ?? [];
    const summary = summarizeGroup(new Set(members.map((m) => m.user_id)), overview.catches, now);
    const latestWhen = summary.latest ? relativeDate(summary.latest.catch_date, now, locale, (k, v) => tFeed(k as Parameters<typeof tFeed>[0], v)) : null;
    return { group, members, summary, latestWhen };
  });
  // overview.catches only holds members' shared catches, so this is the week's activity across all groups.
  const weekTotal = overview.catches.filter((x) => now.getTime() - Date.parse(x.created_at) <= 7 * 86_400_000).length;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 pb-24 sm:px-8">
      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <h1 className="m-0 font-serif-display text-[length:clamp(var(--text-heading),6vw,var(--text-title))] leading-none text-text">{t("title")}</h1>
          {groups.length > 0 && (
            <p className="m-0 mt-2 text-small text-muted">
              {t("groupCount", { count: groups.length })}
              {weekTotal > 0 && ` · ${t("weekActivity", { count: weekTotal })}`}
            </p>
          )}
        </div>
        <Link href="/groups/new" className={BTN}>
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden="true">
            <path d="M12 5v14M5 12h14" />
          </svg>
          {t("createGroup")}
        </Link>
      </header>

      <div className="mb-6">
        <JoinByCode />
      </div>

      {loadFailed ? (
        <p role="alert" className="rounded-[var(--r-card)] bg-surface p-6 text-negative">{t("loadError")}</p>
      ) : groups.length === 0 ? (
        <section className="rounded-[var(--r-card)] bg-surface p-8">
          <h2 className="m-0 font-serif-display text-subhead font-bold">{t("noGroups")}</h2>
          <p className="m-0 mt-2 max-w-[52ch] text-muted">{t("createFirst")}</p>
        </section>
      ) : (
        <ul className="m-0 grid list-none gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((c) => (
            <li key={c.group.id} className="min-w-0">
              <GroupCard group={c.group} members={c.members} summary={c.summary} latestWhen={c.latestWhen} locale={locale} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
