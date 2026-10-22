"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { parseInviteCode } from "@/lib/group-overview";

/** "¿Te invitaron?": paste an invite link or code and go to the join confirmation page. */
export function JoinByCode() {
  const t = useTranslations("groups");
  const router = useRouter();
  const [value, setValue] = useState("");
  const [invalid, setInvalid] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const code = parseInviteCode(value);
    if (!code) {
      setInvalid(true);
      return;
    }
    router.push(`/groups/join/${code}`);
  }

  return (
    <form onSubmit={submit} className="flex flex-wrap items-center gap-3 rounded-[var(--r-card)] bg-surface p-4">
      <label htmlFor="invite-code" className="text-small font-semibold text-text">
        {t("joinPrompt")}
      </label>
      <input
        id="invite-code"
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          setInvalid(false);
        }}
        placeholder={t("joinPlaceholder")}
        aria-invalid={invalid}
        aria-describedby={invalid ? "invite-code-error" : undefined}
        autoComplete="off"
        className="h-10 min-w-0 flex-[1_1_220px] rounded-[var(--r-pill)] bg-ground px-4 text-small text-text outline-none placeholder:text-faint focus:shadow-[inset_0_0_0_1.5px_var(--accent)] aria-[invalid=true]:shadow-[inset_0_0_0_1.5px_var(--negative)] transition-[box-shadow] duration-[var(--t-ui)] motion-reduce:transition-none"
      />
      <button
        type="submit"
        className="h-10 rounded-[var(--r-pill)] bg-raised px-4 text-small font-semibold text-text hover:bg-border active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 transition-[background-color,transform] duration-[var(--t-press)] motion-reduce:transition-none motion-reduce:active:scale-100"
      >
        {t("joinGroup")}
      </button>
      {invalid && (
        <p id="invite-code-error" role="alert" className="m-0 w-full text-small text-negative">
          {t("joinInvalid")}
        </p>
      )}
    </form>
  );
}
