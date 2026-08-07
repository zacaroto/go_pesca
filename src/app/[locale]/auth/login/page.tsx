import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { LoginForm } from "@/components/auth/login-form";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function LoginPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <LoginContent />;
}

function LoginContent() {
  const t = useTranslations("auth");

  return (
    <div className="flex flex-col items-center justify-center flex-1 px-4 py-16">
      <h1 className="text-2xl font-bold mb-8">{t("loginTitle")}</h1>
      <LoginForm />
    </div>
  );
}
