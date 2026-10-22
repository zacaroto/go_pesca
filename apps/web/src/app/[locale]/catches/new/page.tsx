import { setRequestLocale } from "next-intl/server";
import { CatchForm } from "@/components/catches/catch-form";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function NewCatchPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  // CatchForm owns the page layout (title, steps and live preview columns).
  return <CatchForm locale={locale} />;
}
