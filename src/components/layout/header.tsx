import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { UserMenu } from "./user-menu";
import { LanguageSwitcher } from "./language-switcher";
import { RankBadge } from "@/components/rank/rank-badge";
import { Logo } from "@/components/logo";
import { VersionBadge } from "@/components/version-badge";

type Props = {
  user: { id: string; email?: string; display_name?: string } | null;
  rankData?: { caught: number; total: number };
};

export function Header({ user, rankData }: Props) {
  const t = useTranslations();

  return (
    <header className="glass border-b border-white/10 dark:border-white/5 shadow-ocean sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold text-primary dark:text-primary-light" style={{ fontFamily: "var(--font-fredoka)" }}>
            <Logo size={28} />
            <span className="hidden sm:inline">{t("common.appName")}</span>
            <VersionBadge />
          </Link>
          {user && (
            <nav className="hidden sm:flex items-center gap-1 text-sm font-semibold">
              <Link href="/pokedex" className="px-3 py-1.5 rounded-xl hover:text-primary hover:bg-primary/10 transition-all duration-200">
                {t("nav.pokedex")}
              </Link>
              <Link href="/catches" className="px-3 py-1.5 rounded-xl hover:text-primary hover:bg-primary/10 transition-all duration-200">
                {t("nav.catches")}
              </Link>
              <Link href="/species" className="px-3 py-1.5 rounded-xl hover:text-primary hover:bg-primary/10 transition-all duration-200">
                {t("nav.species")}
              </Link>
              <Link href="/community" className="px-3 py-1.5 rounded-xl hover:text-primary hover:bg-primary/10 transition-all duration-200">
                {t("nav.community")}
              </Link>
              <Link href="/achievements" className="px-3 py-1.5 rounded-xl hover:text-primary hover:bg-primary/10 transition-all duration-200">
                {t("nav.achievements")}
              </Link>
            </nav>
          )}
        </div>
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          {user ? (
            <>
              {rankData && (
                <RankBadge caught={rankData.caught} total={rankData.total} size="sm" />
              )}
              <UserMenu displayName={user.display_name ?? user.email ?? ""} userId={user.id} />
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/auth/login"
                className="text-sm font-semibold hover:text-primary transition-colors"
              >
                {t("common.login")}
              </Link>
              <Link
                href="/auth/register"
                className="text-sm bg-accent text-white px-4 py-2 rounded-xl font-bold hover:bg-accent/90 active:scale-[0.97] shadow-accent transition-all duration-200"
              >
                {t("common.register")}
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
