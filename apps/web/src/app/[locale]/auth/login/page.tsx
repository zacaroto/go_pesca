import { getTranslations, setRequestLocale } from "next-intl/server";
import { LoginForm } from "@/components/auth/login-form";
import { AuthLayout } from "@/components/auth/auth-layout";
import { getFeaturedSpecies } from "@/lib/species-facts";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function LoginPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("auth");
  const species = await getFeaturedSpecies(locale);

  return (
    <AuthLayout title={t("loginHeading")} lede={t("loginLede")} species={species}>
      <LoginForm />
    </AuthLayout>
  );
}
