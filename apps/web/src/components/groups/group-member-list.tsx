"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

type Member = {
  user_id: string;
  role: string;
  display_name: string;
  avatar_url: string | null;
};

type Props = {
  members: Member[];
};

export function GroupMemberList({ members }: Props) {
  const t = useTranslations("groups");

  return (
    <div className="rounded-[var(--r-card)] bg-surface border border-border p-4">
      <h2 className="text-sm font-semibold text-foreground mb-3">
        {t("members")} ({members.length})
      </h2>
      <div className="flex flex-wrap gap-2">
        {members.map((m) => (
          <Link
            key={m.user_id}
            href={`/profile/${m.user_id}`}
            className="flex items-center gap-2 px-2 py-1.5 rounded-[var(--r-control)] bg-raised hover:bg-border active:bg-border transition-colors duration-[var(--t-press)] motion-reduce:transition-none"
          >
            {m.avatar_url ? (
              <img src={m.avatar_url} alt="" className="w-6 h-6 rounded-full object-cover" />
            ) : (
              <div className="w-6 h-6 rounded-full bg-accent-soft text-accent-ink flex items-center justify-center text-[13px] font-bold">
                {m.display_name?.charAt(0)?.toUpperCase() ?? "?"}
              </div>
            )}
            <span className="text-[13px] font-medium text-text truncate max-w-[80px]">
              {m.display_name || "Angler"}
            </span>
            {m.role === "creator" && (
              <span className="text-[13px] font-semibold text-accent-ink">
                {t("creator")}
              </span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
