import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { RegisterForm } from "@/components/auth/register-form";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function RegisterPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <RegisterContent />;
}

function RegisterContent() {
  const t = useTranslations("auth");

  return (
    <div className="flex flex-col items-center justify-center flex-1 px-4 py-16">
      <h1 className="text-2xl font-bold mb-8">{t("registerTitle")}</h1>
      <RegisterForm />
    </div>
  );
}
