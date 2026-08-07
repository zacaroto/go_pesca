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
        <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-cyan-600 to-teal-500 dark:from-cyan-400 dark:to-teal-300 bg-clip-text text-transparent">
          {t("common.appName")}
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
          {t("home.subtitle")}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/catches/new"
            className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-cyan-600 text-white font-medium hover:bg-cyan-700 active:scale-[0.98] transition-all duration-200 shadow-md hover:shadow-lg"
          >
            {t("home.cta")}
          </Link>
          <Link
            href="/pokedex"
            className="inline-flex items-center justify-center px-6 py-3 rounded-full border border-cyan-600 text-cyan-600 dark:text-cyan-400 dark:border-cyan-400 font-medium hover:bg-cyan-50 dark:hover:bg-cyan-950 active:scale-[0.98] transition-all duration-200"
          >
            {t("nav.pokedex")}
          </Link>
        </div>
      </div>
    </div>
  );
}
