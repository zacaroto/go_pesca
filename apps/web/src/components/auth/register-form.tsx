"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export function RegisterForm() {
  const t = useTranslations("auth");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName,
        },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  }

  if (success) {
    return (
      <div className="text-center max-w-sm">
        <p className="text-positive font-medium mb-4">
          {t("registrationSuccess")}
        </p>
        <Link href="/auth/login" className="text-accent-ink font-medium underline-offset-2 hover:underline active:underline">
          {t("loginButton")}
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full">
      <div>
        <label htmlFor="displayName" className="block text-sm font-medium mb-1">
          {t("displayName")}
        </label>
        <input
          id="displayName"
          type="text"
          required
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          className="field"
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-1">
          {t("email")}
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="field"
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium mb-1">
          {t("password")}
        </label>
        <input
          id="password"
          type="password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="field"
        />
      </div>
      {error && <p className="text-negative text-sm">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full"
      >
        {loading ? "..." : t("registerButton")}
      </button>
      <p className="text-sm text-center text-muted">
        {t("hasAccount")}{" "}
        <Link href="/auth/login" className="text-accent-ink font-medium underline-offset-2 hover:underline active:underline">
          {t("loginButton")}
        </Link>
      </p>
    </form>
  );
}
