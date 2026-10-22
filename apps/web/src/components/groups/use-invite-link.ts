"use client";

import { useState } from "react";

/** Copies the group's join link to the clipboard; `copied` flips back after 2s. */
export function useInviteLink(inviteCode: string, locale: string) {
  const [copied, setCopied] = useState(false);
  const [failed, setFailed] = useState(false);

  async function copy() {
    const url = `${window.location.origin}/${locale}/groups/join/${inviteCode}`;
    try {
      await navigator.clipboard.writeText(url);
      setFailed(false);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy invite link:", err);
      setFailed(true);
    }
  }

  return { copy, copied, failed };
}
