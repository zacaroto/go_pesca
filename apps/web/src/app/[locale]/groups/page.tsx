import { setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getUserGroupsServer } from "@/lib/groups.server";
import type { GroupWithMemberCount } from "@/lib/groups";
import { Link } from "@/i18n/navigation";

type Props = {
  params: Promise<{ locale: string }>;
};

const BTN =
  "inline-flex h-10 items-center gap-2 rounded-full bg-accent px-5 text-sm font-semibold text-on-primary hover:bg-accent-hi active:bg-accent-hi active:scale-[0.97] transition-[background-color,transform] duration-[var(--t-press)] ease-[var(--ease-out)] motion-reduce:transition-none motion-reduce:active:scale-100 focus-visible:outline-2 focus-visible:outline-offset-2";

export default async function GroupsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  let userId: string | null = null;
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    userId = user?.id ?? null;
  } catch {
    userId = null;
  }
  if (!userId) redirect(`/${locale}/auth/login`);

  let groups: GroupWithMemberCount[] = [];
  let loadFailed = false;
  try {
    groups = await getUserGroupsServer(userId);
  } catch (error) {
    console.error("Failed to load groups", error);
    loadFailed = true;
  }

  return <GroupsContent groups={groups} loadFailed={loadFailed} />;
}

function GroupsContent({ groups, loadFailed }: { groups: GroupWithMemberCount[]; loadFailed: boolean }) {
  const t = useTranslations("groups");

  return (
    <div className="mx-auto w-full max-w-[1280px] px-4 py-10 sm:px-12">
      <div className="mb-8 flex flex-wrap items-end gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="font-serif-display text-4xl font-black leading-none sm:text-[52px]">{t("title")}</h1>
          {groups.length > 0 && (
            <p className="mt-2 text-muted">{t("groupCount", { count: groups.length })}</p>
          )}
        </div>
        <Link href="/groups/new" className={BTN}>
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>
          {t("createGroup")}
        </Link>
      </div>

      {loadFailed ? (
        <p role="alert" className="rounded-[var(--r-card)] bg-surface p-6 text-negative">{t("loadError")}</p>
      ) : groups.length === 0 ? (
        <div className="rounded-[var(--r-card)] bg-surface p-8">
          <h2 className="font-serif-display text-2xl font-bold">{t("noGroups")}</h2>
          <p className="mt-2 max-w-[52ch] text-muted">{t("createFirst")}</p>
        </div>
      ) : (
        <ul className="grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3">
          {groups.map((group) => (
            <li key={group.id}>
              <Link
                href={`/groups/${group.id}`}
                className="flex h-full gap-4 rounded-[var(--r-card)] bg-surface p-5 hover:bg-raised active:opacity-80 transition-[background-color,opacity] duration-[var(--t-ui)] motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                {group.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={group.avatar_url} alt="" className="h-14 w-14 shrink-0 rounded-[var(--r-card)] object-cover" />
                ) : (
                  <span aria-hidden="true" className="grid h-14 w-14 shrink-0 place-items-center rounded-[var(--r-card)] bg-accent-soft text-xl font-bold text-accent-ink">
                    {group.name.charAt(0).toUpperCase()}
                  </span>
                )}
                <span className="min-w-0">
                  <span className="block truncate font-serif-display text-xl font-bold">{group.name}</span>
                  {group.description && (
                    <span className="mt-1 line-clamp-2 block text-sm text-muted">{group.description}</span>
                  )}
                  <span className="mt-2 block text-[13px] text-muted tabular-nums">
                    {t("memberCount", { count: group.member_count })}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
