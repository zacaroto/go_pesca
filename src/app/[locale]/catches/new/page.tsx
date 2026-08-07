import { setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import { CatchForm } from "@/components/catches/catch-form";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function NewCatchPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <NewCatchContent locale={locale} />;
}

function NewCatchContent({ locale }: { locale: string }) {
  const t = useTranslations("catches");

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">{t("newCatch")}</h1>
      <CatchForm locale={locale} />
    </div>
  );
}
