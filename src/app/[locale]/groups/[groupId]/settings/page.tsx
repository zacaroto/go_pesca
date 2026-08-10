import { setRequestLocale } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getGroupById } from "@/lib/groups";
import { GroupSettingsContent } from "./settings-content";

type Props = {
  params: Promise<{ locale: string; groupId: string }>;
};

export default async function GroupSettingsPage({ params }: Props) {
  const { locale, groupId } = await params;
  setRequestLocale(locale);

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/auth/login`);

  const group = await getGroupById(groupId);
  if (!group) redirect(`/${locale}/community`);

  // Only the creator can access settings
  if (group.created_by !== user.id) redirect(`/${locale}/groups/${groupId}`);

  return <GroupSettingsContent group={group} locale={locale} />;
}

