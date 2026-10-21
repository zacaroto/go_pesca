"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  function switchLocale() {
    const newLocale = locale === "es" ? "en" : "es";
    const segments = pathname.split("/");
    segments[1] = newLocale;
    router.push(segments.join("/"));
  }

  return (
    <button
      onClick={switchLocale}
      className="h-8 shrink-0 rounded-full border px-3 text-[13px] font-medium hover:bg-[var(--raised)] active:opacity-75"
      style={{ borderColor: "var(--border)", color: "var(--muted)", transition: "background-color var(--t-ui), opacity var(--t-ui)" }}
      title={locale === "es" ? "Switch to English" : "Cambiar a Español"}
    >
      {locale === "es" ? "EN" : "ES"}
    </button>
  );
}
