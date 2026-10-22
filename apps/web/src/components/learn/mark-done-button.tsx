"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/client";
import { checkLearnAchievements } from "@/lib/achievements";
import { useAchievements } from "@/components/achievements/achievement-provider";

type Props = { itemType: "guide" | "knot"; slug: string; initiallyDone: boolean; signedIn: boolean };

/** "Mark as learned" toggle that feeds the chapter progress bars. Signed-out anglers get a login link. */
export function MarkDoneButton({ itemType, slug, initiallyDone, signedIn }: Props) {
  const t = useTranslations("learn");
  const [done, setDone] = useState(initiallyDone);
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);
  const [justMarked, setJustMarked] = useState(false);
  const { showAchievements } = useAchievements();

  if (!signedIn) {
    return (
      <Link href="/auth/login" className="text-small font-semibold text-accent underline-offset-2 hover:underline">
        {t("loginToTrack")}
      </Link>
    );
  }

  async function toggle() {
    setBusy(true);
    setFailed(false);
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("no session");
      const { error } = done
        ? await supabase.from("learn_progress").delete().match({ user_id: user.id, item_type: itemType, slug })
        : // learn_progress isn't in the generated Database types yet (migration 023).
          await supabase.from("learn_progress").insert({ user_id: user.id, item_type: itemType, slug } as never);
      if (error) throw error;
      setDone(!done);
      setJustMarked(!done);
      if (!done) showAchievements(await checkLearnAchievements(user.id));
    } catch (err) {
      console.error("learn: failed to save progress", err);
      setFailed(true);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={toggle}
        disabled={busy}
        aria-pressed={done}
        className="inline-flex items-center gap-2 rounded-[var(--r-control)] bg-accent px-4 py-2.5 text-small font-semibold text-on-primary hover:bg-accent-hi aria-pressed:bg-progress aria-pressed:text-[var(--ground)] active:scale-[0.98] disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 transition-[background-color,transform] duration-[var(--t-press)] motion-reduce:transition-none motion-reduce:active:scale-100"
      >
        {done && (
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            {/* Draws itself only when just marked, not when the page loads already done. */}
            <path d="m5 12 5 5 9-10" pathLength={1} className={justMarked ? "draw-check" : undefined} />
          </svg>
        )}
        {done ? t("learned") : t(itemType === "knot" ? "markKnot" : "markGuide")}
      </button>
      {failed && (
        <p role="alert" className="m-0 text-small text-negative">
          {t("saveFailed")}
        </p>
      )}
    </div>
  );
}
