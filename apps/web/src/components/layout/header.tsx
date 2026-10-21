import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { UserMenu } from "./user-menu";
import { LanguageSwitcher } from "./language-switcher";
import { RankBadge } from "@/components/rank/rank-badge";
import { VersionBadge } from "@/components/version-badge";

type Props = {
  user: { id: string; email?: string; display_name?: string } | null;
  rankData?: { caught: number; total: number };
};

export function Header({ user, rankData }: Props) {
  const t = useTranslations();

  return (
    <header
      className="top-0 sticky z-40 w-full"
      style={{ background: "var(--surface)", borderBottom: "1px solid var(--border)" }}
    >
      <div className="max-w-6xl mx-auto px-4 h-[52px] flex items-center justify-between">
        {/* Wordmark */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-1" style={{ textDecoration: "none" }}>
            <span
              style={{
                fontFamily: "var(--font-playfair), Georgia, serif",
                fontWeight: 900,
                fontSize: "17px",
                color: "var(--text)",
                letterSpacing: "-0.01em",
              }}
            >
              Go
            </span>
            <span
              style={{
                display: "inline-block",
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: "var(--accent)",
                margin: "0 3px",
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontFamily: "var(--font-playfair), Georgia, serif",
                fontWeight: 900,
                fontSize: "17px",
                color: "var(--text)",
                letterSpacing: "-0.01em",
              }}
            >
              Pesca
            </span>
            <VersionBadge />
          </Link>

          {user && (
            <nav className="hidden sm:flex items-center gap-1 text-sm">
              {[
                { href: "/pokedex",    label: t("nav.pokedex") },
                { href: "/catches",   label: t("nav.catches") },
                { href: "/community", label: t("nav.community") },
              ].map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="px-3 py-1.5 rounded text-sm transition-colors"
                  style={{
                    color: "var(--muted)",
                    fontWeight: 500,
                    transition: "color var(--t-ui)",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "var(--muted)")}
                >
                  {label}
                </Link>
              ))}
            </nav>
          )}
        </div>

        {/* Right actions */}
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
            <div className="flex items-center gap-3">
              <Link
                href="/auth/login"
                className="text-sm font-medium transition-colors"
                style={{ color: "var(--muted)" }}
              >
                {t("common.login")}
              </Link>
              <Link
                href="/auth/register"
                className="text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
                style={{
                  background: "var(--accent)",
                  color: "#ffffff",
                  borderRadius: "8px",
                }}
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
