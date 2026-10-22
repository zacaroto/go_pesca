"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

export function LoginForm() {
  const t = useTranslations("auth");
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(t("invalidCredentials"));
      setLoading(false);
      return;
    }

    router.push("/pokedex");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full">
      <div>
        <label htmlFor="email" className="block text-small font-medium mb-1">
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
        <label htmlFor="password" className="block text-small font-medium mb-1">
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
      {error && <p className="text-negative text-small">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full"
      >
        {loading ? "..." : t("loginButton")}
      </button>
      <p className="text-small text-center text-muted">
        {t("noAccount")}{" "}
        <Link href="/auth/register" className="text-accent-ink font-medium underline-offset-2 hover:underline active:underline">
          {t("registerButton")}
        </Link>
      </p>
    </form>
  );
}
