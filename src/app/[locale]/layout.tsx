import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/layout/header";
import { BottomNav } from "@/components/layout/bottom-nav";
import { AchievementProvider } from "@/components/achievements/achievement-provider";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isSpanish = locale === "es";
  return {
    title: isSpanish ? "Go Pesca - Tu Pescadex" : "Go Pesca - Your FishyDex",
    description: isSpanish
      ? "Registra tus capturas y completa tu colección de especies"
      : "Log your catches and complete your species collection",
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "es" | "en")) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  let user = null;
  try {
    const supabase = await createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (authUser) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("display_name")
        .eq("id", authUser.id)
        .single();
      const displayName = (profile as { display_name: string | null } | null)?.display_name;
      user = {
        id: authUser.id,
        email: authUser.email,
        display_name: displayName ?? undefined,
      };
    }
  } catch {
    // Supabase not configured yet — continue without auth
  }

  let rankData: { caught: number; total: number } | undefined;
  if (user) {
    try {
      const supabase = await createClient();
      const [{ count: totalCount }, { data: caughtRows }] = await Promise.all([
        supabase.from("species").select("*", { count: "exact", head: true }),
        supabase
          .from("catches")
          .select("species_id")
          .eq("user_id", user.id),
      ]);
      const distinctSpecies = new Set(
        (caughtRows ?? []).map((r: { species_id: number }) => r.species_id)
      );
      rankData = { caught: distinctSpecies.size, total: totalCount ?? 0 };
    } catch {
      // Continue without rank data
    }
  }

  return (
    <NextIntlClientProvider messages={messages}>
      <AchievementProvider>
        <Header user={user} rankData={rankData} />
        <main className="flex-1 flex flex-col pb-20 sm:pb-0">{children}</main>
        {user && <BottomNav />}
      </AchievementProvider>
    </NextIntlClientProvider>
  );
}
