import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import { SpeciesGrid } from "@/components/species/species-grid";
import type { CatalogCardSpecies } from "@/components/species/species-card";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function SpeciesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("species");

  let species: CatalogCardSpecies[] = [];
  try {
    const supabase = await createClient();
    // "*" so the page keeps working on databases without the trophy/regulation columns yet.
    const { data, error } = await supabase.from("species").select("*");
    if (error) throw error;
    species = (data ?? []) as CatalogCardSpecies[];
  } catch (err) {
    console.error("species: failed to load catalog", err);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 pb-24 sm:px-8">
      <header className="mb-8">
        <h1 className="m-0 font-serif-display text-[length:clamp(var(--text-heading),6vw,var(--text-title))] leading-none text-text">{t("title")}</h1>
        <p className="m-0 mt-3 max-w-[60ch] text-body text-muted">{t("catalogIntro", { count: species.length })}</p>
      </header>

      <SpeciesGrid species={species} locale={locale} />

      <section className="mt-12 flex flex-wrap items-center justify-between gap-4 rounded-[var(--r-card)] bg-surface p-6">
        <div className="min-w-0">
          <h2 className="m-0 font-serif-display text-subhead font-bold">{t("missingTitle")}</h2>
          <p className="m-0 mt-1 text-body text-muted">{t("missingBody")}</p>
        </div>
        <Link
          href="/species/suggest"
          className="rounded-[var(--r-control)] bg-accent px-4 py-2.5 text-small font-semibold text-on-primary hover:bg-accent-hi active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 transition-[background-color,transform] duration-[var(--t-press)] motion-reduce:transition-none motion-reduce:active:scale-100"
        >
          {t("suggestSpecies")}
        </Link>
      </section>
    </div>
  );
}
