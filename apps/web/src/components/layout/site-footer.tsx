import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

const COLS = [
  { title: "collection", links: [["/pokedex", "nav.pokedex"], ["/species", "nav.species"], ["/achievements", "nav.achievements"]] },
  { title: "community", links: [["/community", "nav.community"], ["/groups", "nav.groups"], ["/species/suggest", "footer.suggestSpecies"]] },
] as const;

export function SiteFooter() {
  const t = useTranslations();
  return (
    <footer className="overflow-hidden px-4 pb-20 pt-14 sm:px-12 md:pb-7" style={{ background: "var(--footer-bg)", color: "var(--footer-text)" }}>
      <div className="mx-auto max-w-[1280px]">
        <div className="grid grid-cols-2 gap-9 sm:grid-cols-[2fr_1fr_1fr]">
          <p className="col-span-2 m-0 max-w-[22ch] font-serif-display text-subhead leading-tight sm:col-span-1 sm:text-heading">
            {t("footer.quote")}
          </p>
          {COLS.map((col) => (
            <div key={col.title}>
              <h2 className="mb-3 text-label font-medium" style={{ color: "var(--footer-muted)" }}>{t(`footer.${col.title}`)}</h2>
              <ul className="m-0 list-none p-0">
                {col.links.map(([href, key]) => (
                  <li key={key} className="mb-2">
                    <Link href={href} className="hover:text-[var(--footer-link-hover)]" style={{ transition: "color var(--t-ui)" }}>{t(key)}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p aria-hidden="true" className="m-0 mb-5 mt-12 font-serif-display font-display leading-[0.85] tracking-[-0.04em] text-[clamp(44px,7vw,96px)]" style={{ color: "var(--surface)" }}>
          Go Pesca
        </p>
        <div className="flex justify-between gap-4 text-label" style={{ color: "var(--footer-muted)" }}>
          <span>© {new Date().getFullYear()} Go Pesca · {t("footer.madeIn")}</span>
        </div>
      </div>
    </footer>
  );
}
