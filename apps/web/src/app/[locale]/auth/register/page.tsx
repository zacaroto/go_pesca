import { getTranslations, setRequestLocale } from "next-intl/server";
import { RegisterForm } from "@/components/auth/register-form";
import { AuthLayout } from "@/components/auth/auth-layout";
import { getFeaturedSpecies } from "@/lib/species-facts";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function RegisterPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("auth");
  const species = await getFeaturedSpecies(locale);

  return (
    <AuthLayout title={t("registerHeading")} lede={t("registerLede")} species={species}>
      <RegisterForm />
    </AuthLayout>
  );
}
