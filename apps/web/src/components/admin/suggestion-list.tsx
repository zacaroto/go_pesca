"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { SuggestionReview } from "./suggestion-review";

type Suggestion = {
  id: string;
  common_name: string;
  photo_url: string | null;
  notes: string | null;
  status: string;
  created_at: string;
};

export function SuggestionList() {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const supabase = createClient();
      const { data } = await supabase
        .from("species_suggestions")
        .select("id, common_name, photo_url, notes, status, created_at")
        .eq("status", "pending")
        .order("created_at", { ascending: false });
      setSuggestions((data as Suggestion[]) ?? []);
    } catch {
      // Supabase not configured
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return <p className="text-gray-500 text-center py-8">Loading...</p>;
  }

  if (suggestions.length === 0) {
    return (
      <p className="text-gray-500 text-center py-8">
        No pending suggestions.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {suggestions.map((s) => (
        <SuggestionReview key={s.id} suggestion={s} onUpdated={load} />
      ))}
    </div>
  );
}
