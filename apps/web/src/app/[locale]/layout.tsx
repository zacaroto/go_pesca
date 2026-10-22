import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/layout/header";
import { SiteFooter } from "@/components/layout/site-footer";
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
        .select("display_name, avatar_url")
        .eq("id", authUser.id)
        .single();
      const row = profile as { display_name: string | null; avatar_url: string | null } | null;
      user = {
        id: authUser.id,
        email: authUser.email,
        display_name: row?.display_name ?? undefined,
        avatar_url: row?.avatar_url ?? undefined,
      };
    }
  } catch {
    // Supabase not configured yet — continue without auth
  }

  return (
    <NextIntlClientProvider messages={messages}>
      <AchievementProvider>
        <Header user={user} />
        <main className="flex flex-1 flex-col">{children}</main>
        <SiteFooter />
        {user && <BottomNav />}
      </AchievementProvider>
    </NextIntlClientProvider>
  );
}
