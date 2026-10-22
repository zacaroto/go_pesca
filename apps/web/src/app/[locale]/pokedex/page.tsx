import { setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getPokedex, type PokedexEntry } from "@/lib/pokedex";
import { RankRing } from "@/components/rank/rank-ring";
import { SpeciesIndex } from "@/components/pokedex/species-index";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function PokedexPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  let entries: PokedexEntry[] = [];
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) redirect(`/${locale}/auth/login`);
    entries = await getPokedex(user.id);
  } catch {
    redirect(`/${locale}/auth/login`);
  }

  return <PokedexContent entries={entries} locale={locale} />;
}

function PokedexContent({
  entries,
  locale,
}: {
  entries: PokedexEntry[];
  locale: string;
}) {
  const t = useTranslations("pokedex");
  const caught = entries.filter((e) => e.catch_count > 0).length;
  const total = entries.length;

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-10 sm:px-12">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-x-8 gap-y-4">
        <div>
          <h1
            className="font-serif-display m-0"
            style={{ fontSize: "clamp(36px, 6vw, 52px)", fontWeight: 900, lineHeight: 1, color: "var(--text)" }}
          >
            {t("title")}
          </h1>
          <p className="mt-2 mb-0 text-[15px]" style={{ color: "var(--muted)" }}>
            {t("subtitle", { caught, total })}
          </p>
        </div>
        <RankRing caught={caught} total={total} />
      </div>
      <SpeciesIndex entries={entries} locale={locale} />
    </div>
  );
}
