import { setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getPokedex } from "@/lib/pokedex";
import { PokedexGrid } from "@/components/pokedex/pokedex-grid";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function PokedexPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  let entries = [];
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
  entries: Awaited<ReturnType<typeof getPokedex>>;
  locale: string;
}) {
  const t = useTranslations("pokedex");

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">{t("title")}</h1>
      <PokedexGrid entries={entries} locale={locale} />
    </div>
  );
}
