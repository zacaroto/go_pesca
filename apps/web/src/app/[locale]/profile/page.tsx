import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

type Props = {
  params: Promise<{ locale: string }>;
};

/** /profile (the phone nav's "Perfil") goes to the signed-in angler's own profile. */
export default async function MyProfileRoute({ params }: Props) {
  const { locale } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  redirect(user ? `/${locale}/profile/${user.id}` : `/${locale}/auth/login`);
}
