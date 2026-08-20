import { setRequestLocale } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { SuggestionList } from "@/components/admin/suggestion-list";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function AdminSuggestionsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) redirect(`/${locale}/auth/login`);

    // Check admin status
    const { data: profile } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", user.id)
      .single();

    const isAdmin = (profile as { is_admin: boolean } | null)?.is_admin;
    if (!isAdmin) redirect(`/${locale}`);
  } catch {
    redirect(`/${locale}/auth/login`);
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Species Suggestions</h1>
      <SuggestionList />
    </div>
  );
}
