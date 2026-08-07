"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Props = {
  displayName: string;
};

export function UserMenu({ displayName }: Props) {
  const t = useTranslations();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 text-sm hover:text-blue-600 transition-colors"
      >
        <span className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 font-medium">
          {displayName.charAt(0).toUpperCase()}
        </span>
        <span className="hidden sm:inline">{displayName}</span>
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-20">
            <Link
              href="/catches/new"
              className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => setOpen(false)}
            >
              {t("catches.newCatch")}
            </Link>
            <hr className="border-gray-200 dark:border-gray-700" />
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {t("common.logout")}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
