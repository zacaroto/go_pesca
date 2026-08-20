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
    <div className="rounded-2xl bg-surface dark:bg-surface-alt ring-1 ring-foreground/5 dark:ring-white/5 shadow-sm p-4">
      <h2 className="text-sm font-semibold text-foreground mb-3">
        {t("members")} ({members.length})
      </h2>
      <div className="flex flex-wrap gap-2">
        {members.map((m) => (
          <Link
            key={m.user_id}
            href={`/profile/${m.user_id}`}
            className="flex items-center gap-2 px-2 py-1.5 rounded-xl bg-foreground/5 hover:bg-foreground/10 transition-colors"
          >
            {m.avatar_url ? (
              <img src={m.avatar_url} alt="" className="w-6 h-6 rounded-full object-cover" />
            ) : (
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-white text-[10px] font-bold">
                {m.display_name?.charAt(0)?.toUpperCase() ?? "?"}
              </div>
            )}
            <span className="text-xs font-medium text-foreground truncate max-w-[80px]">
              {m.display_name || "Angler"}
            </span>
            {m.role === "creator" && (
              <span className="text-[10px] font-semibold text-coral">
                {t("creator")}
              </span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
