import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { FishMark } from "@/components/layout/fish-mark";
import { MemberAvatar } from "./member-avatar";
import type { GroupWithMemberCount } from "@/lib/groups";
import type { GroupSummary } from "@/lib/group-overview";
import type { GroupOverviewMember } from "@/lib/groups.server";

type Props = {
  group: GroupWithMemberCount;
  members: GroupOverviewMember[];
  summary: GroupSummary;
  /** Already-translated "hace 2 días" for the latest catch, or null when the group is quiet. */
  latestWhen: string | null;
  locale: string;
};

const AVATARS = 4;

function Tile({ src, className }: { src: string | undefined; className: string }) {
  return (
    <div className={`relative overflow-hidden bg-raised ${className}`}>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-500 ease-[var(--ease-out)] group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100" />
      ) : (
        <FishMark className="absolute inset-0 m-auto h-10 w-10 text-silhouette" />
      )}
    </div>
  );
}

/** Groups index card: mosaic of the newest shared catches, what happened last, and who's in it. */
export function GroupCard({ group, members, summary, latestWhen, locale }: Props) {
  const t = useTranslations("groups");
  const num = new Intl.NumberFormat(locale === "en" ? "en" : "es-CR", { maximumFractionDigits: 1 });
  const { photos, latest, newThisWeek } = summary;
  const shown = members.slice(0, AVATARS);
  const extra = group.member_count - shown.length;
  const firstName = (name: string) => name.trim().split(/\s+/)[0] || t("anonymousAngler");

  return (
    <Link
      href={`/groups/${group.id}`}
      className="group flex h-full flex-col overflow-hidden rounded-[var(--r-card)] bg-surface hover:bg-raised active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-2 transition-[background-color,transform] duration-[var(--t-ui)] ease-[var(--ease-out)] motion-reduce:transition-none motion-reduce:active:scale-100"
    >
      <div className="grid h-[170px] grid-cols-[2fr_1fr] grid-rows-2 gap-0.5" aria-hidden="true">
        <Tile src={photos[0]} className="row-span-2" />
        <Tile src={photos[1]} className="" />
        <Tile src={photos[2]} className="" />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <h2 className="m-0 min-w-0 truncate font-serif-display text-subhead font-bold leading-tight text-text">{group.name}</h2>
          {newThisWeek > 0 && (
            <span className="shrink-0 rounded-[var(--r-pill)] bg-accent-soft px-2.5 py-0.5 text-label font-semibold text-accent-ink">
              {t("newThisWeek", { count: newThisWeek })}
            </span>
          )}
        </div>
        <p className="m-0 line-clamp-2 text-small text-muted">
          {latest ? (
            <>
              <span className="font-semibold text-text">
                {latest.weight_kg != null
                  ? t("latestCatchWeight", { name: firstName(latest.display_name), species: latest.species_name, weight: `${num.format(latest.weight_kg)} kg` })
                  : t("latestCatch", { name: firstName(latest.display_name), species: latest.species_name })}
              </span>
              {latestWhen && ` · ${latestWhen}`}
            </>
          ) : (
            group.description || t("quietGroup")
          )}
        </p>
        <div className="mt-auto flex items-center justify-between gap-3 pt-2">
          <span className="flex">
            {shown.map((m) => (
              <MemberAvatar key={m.user_id} member={{ ...m, role: "", joined_at: "" }} className="-ml-2 h-8 w-8 text-label ring-2 ring-surface first:ml-0" />
            ))}
            {extra > 0 && (
              <span className="-ml-2 grid h-8 w-8 place-items-center rounded-full bg-raised text-label font-semibold text-muted ring-2 ring-surface">+{extra}</span>
            )}
          </span>
          <span className="text-label text-muted tabular-nums">{t("memberCount", { count: group.member_count })}</span>
        </div>
      </div>
    </Link>
  );
}
