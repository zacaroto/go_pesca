import { useTranslations } from "next-intl";
import Link from "next/link";
import { UserMenu } from "./user-menu";
import { LanguageSwitcher } from "./language-switcher";

type Props = {
  user: { id: string; email?: string; display_name?: string } | null;
};

export function Header({ user }: Props) {
  const t = useTranslations();

  return (
    <header className="border-b border-gray-200 dark:border-gray-800 shadow-sm bg-white dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-xl font-bold text-cyan-600 dark:text-cyan-400">
            {t("common.appName")}
          </Link>
          {user && (
            <nav className="hidden sm:flex items-center gap-1 text-sm">
              <Link href="/pokedex" className="px-3 py-1.5 rounded-md hover:text-cyan-600 hover:bg-cyan-50 dark:hover:bg-cyan-950 transition-all duration-200">
                {t("nav.pokedex")}
              </Link>
              <Link href="/catches" className="px-3 py-1.5 rounded-md hover:text-cyan-600 hover:bg-cyan-50 dark:hover:bg-cyan-950 transition-all duration-200">
                {t("nav.catches")}
              </Link>
              <Link href="/species" className="px-3 py-1.5 rounded-md hover:text-cyan-600 hover:bg-cyan-50 dark:hover:bg-cyan-950 transition-all duration-200">
                {t("nav.species")}
              </Link>
            </nav>
          )}
        </div>
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          {user ? (
            <UserMenu displayName={user.display_name ?? user.email ?? ""} />
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/auth/login"
                className="text-sm hover:text-cyan-600 transition-colors"
              >
                {t("common.login")}
              </Link>
              <Link
                href="/auth/register"
                className="text-sm bg-cyan-600 text-white px-3 py-1.5 rounded-md hover:bg-cyan-700 active:scale-[0.98] transition-all duration-200"
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
