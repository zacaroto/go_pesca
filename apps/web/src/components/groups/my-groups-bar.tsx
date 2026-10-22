"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { GroupWithMemberCount } from "@/lib/groups";

type Props = {
  groups: GroupWithMemberCount[];
};

export function MyGroupsBar({ groups }: Props) {
  const t = useTranslations("groups");

  return (
    <div className="mb-6">
      <h2 className="text-small font-semibold text-foreground mb-3 flex items-center gap-2">
        <svg className="w-4 h-4 text-muted" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path fillRule="evenodd" d="M8.25 6.75a3.75 3.75 0 1 1 7.5 0 3.75 3.75 0 0 1-7.5 0ZM15.75 9.75a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM2.25 9.75a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM6.31 17.084a11.116 11.116 0 0 1 3.727-1.482 3 3 0 0 1 3.926 0 11.12 11.12 0 0 1 3.727 1.482 4.5 4.5 0 0 0-11.38 0Z" clipRule="evenodd" />
        </svg>
        {t("myGroups")}
      </h2>
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
        {groups.map((group) => {
          const letter = group.name.charAt(0).toUpperCase();
          return (
            <Link
              key={group.id}
              href={`/groups/${group.id}`}
              className="flex-shrink-0 w-28 text-center group rounded-[var(--r-card)] active:opacity-80"
            >
              <div className="relative">
                {group.avatar_url ? (
                  <img
                    src={group.avatar_url}
                    alt=""
                    className="w-16 h-16 rounded-[var(--r-card)] object-cover mx-auto border border-border group-hover:border-faint transition-colors duration-[var(--t-ui)] motion-reduce:transition-none"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-[var(--r-card)] bg-accent-soft text-accent-ink flex items-center justify-center text-subhead font-bold mx-auto border border-border group-hover:border-faint transition-colors duration-[var(--t-ui)] motion-reduce:transition-none">
                    {letter}
                  </div>
                )}
              </div>
              <span className="block text-label font-semibold text-text group-hover:text-accent mt-2 line-clamp-1 transition-colors motion-reduce:transition-none">
                {group.name}
              </span>
              <span className="block text-label text-muted mt-0.5">
                {t("memberCount", { count: group.member_count })}
              </span>
            </Link>
          );
        })}

        {/* Create Group CTA */}
        <Link
          href="/groups/new"
          className="flex-shrink-0 w-28 text-center group rounded-[var(--r-card)] active:opacity-80"
        >
          <div className="w-16 h-16 rounded-[var(--r-card)] border border-dashed border-faint group-hover:border-accent flex items-center justify-center mx-auto transition-colors duration-[var(--t-ui)] motion-reduce:transition-none">
            <svg className="w-6 h-6 text-muted group-hover:text-accent transition-colors motion-reduce:transition-none" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </div>
          <span className="block text-label font-semibold text-muted group-hover:text-accent mt-2 transition-colors motion-reduce:transition-none">
            {t("createGroup")}
          </span>
        </Link>
      </div>
    </div>
  );
}
