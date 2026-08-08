import { setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { fetchFeedCatches, fetchReactionsForCatches } from "@/lib/feed";
import { FeedList } from "@/components/feed/feed-list";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function CommunityPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) redirect(`/${locale}/auth/login`);
  } catch {
    redirect(`/${locale}/auth/login`);
  }

  const catches = await fetchFeedCatches(locale);
  const reactions = await fetchReactionsForCatches(catches.map((c) => c.id));

  return <CommunityContent catches={catches} reactions={reactions} locale={locale} />;
}

function CommunityContent({
  catches,
  reactions,
  locale,
}: {
  catches: Awaited<ReturnType<typeof fetchFeedCatches>>;
  reactions: Awaited<ReturnType<typeof fetchReactionsForCatches>>;
  locale: string;
}) {
  const t = useTranslations("feed");

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-extrabold mb-6 text-gradient-ocean" style={{ fontFamily: "var(--font-fredoka)" }}>
        {t("title")}
      </h1>
      <FeedList initialCatches={catches} initialReactions={reactions} locale={locale} />
    </div>
  );
}
