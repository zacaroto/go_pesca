import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import Link from "next/link";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function Home({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <HomeContent />;
}

function HomeContent() {
  const t = useTranslations();

  return (
    <div className="flex flex-col items-center justify-center flex-1 px-4 py-16">
      <div className="text-center max-w-lg">
        <h1 className="text-5xl font-bold text-blue-600 mb-2">
          🐟 {t("common.appName")}
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
          {t("home.subtitle")}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/catches/new"
            className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
          >
            {t("home.cta")}
          </Link>
          <Link
            href="/pokedex"
            className="inline-flex items-center justify-center px-6 py-3 rounded-full border border-blue-600 text-blue-600 font-medium hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors"
          >
            {t("nav.pokedex")}
          </Link>
        </div>
      </div>
    </div>
  );
}
