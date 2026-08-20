import { setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { GroupForm } from "@/components/groups/group-form";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function NewGroupPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect(`/${locale}/auth/login`);
  } catch {
    redirect(`/${locale}/auth/login`);
  }

  return <NewGroupContent locale={locale} />;
}

function NewGroupContent({ locale }: { locale: string }) {
  const t = useTranslations("groups");

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">{t("createGroup")}</h1>
      <GroupForm locale={locale} mode="create" />
    </div>
  );
}
