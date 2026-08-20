import { setRequestLocale } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getGroupByInviteCode, isGroupMember } from "@/lib/groups.server";
import { JoinConfirmation } from "@/components/groups/join-confirmation";

type Props = {
  params: Promise<{ locale: string; code: string }>;
};

export default async function JoinGroupPage({ params }: Props) {
  const { locale, code } = await params;
  setRequestLocale(locale);

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/auth/login?redirect=/groups/join/${code}`);

  const group = await getGroupByInviteCode(code);

  if (!group) {
    return <JoinConfirmation locale={locale} error="notFound" />;
  }

  // Already a member? Redirect to group
  const alreadyMember = await isGroupMember(group.id, user.id);
  if (alreadyMember) redirect(`/${locale}/groups/${group.id}`);

  // Group full?
  if (group.member_count >= 20) {
    return <JoinConfirmation locale={locale} error="full" group={group} />;
  }

  return (
    <JoinConfirmation
      locale={locale}
      group={group}
      inviteCode={code}
    />
  );
}
