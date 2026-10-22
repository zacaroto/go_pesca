"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Suggestion = {
  id: string;
  common_name: string;
  photo_url: string | null;
  notes: string | null;
  status: string;
  created_at: string;
};

type Props = {
  suggestion: Suggestion;
  onUpdated: () => void;
};

export function SuggestionReview({ suggestion, onUpdated }: Props) {
  const [loading, setLoading] = useState(false);

  async function handleAction(action: "approved" | "rejected") {
    setLoading(true);
    try {
      const supabase = createClient();

      if (action === "approved") {
        // Create new species entry
        await supabase.from("species").insert({
          name_es: suggestion.common_name,
          name_en: suggestion.common_name,
          scientific_name: "Pending identification",
          habitat: "saltwater",
        } as never);
      }

      // Update suggestion status
      await supabase
        .from("species_suggestions")
        .update({ status: action, reviewed_at: new Date().toISOString() } as never)
        .eq("id", suggestion.id);

      onUpdated();
    } catch (err) {
      console.error("Failed to review suggestion:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-[var(--r-card)] border border-border bg-surface p-4">
      <div className="flex gap-4">
        {suggestion.photo_url && (
          <img
            src={suggestion.photo_url}
            alt={suggestion.common_name}
            className="w-20 h-20 object-cover rounded-[var(--r-control)]"
          />
        )}
        <div className="flex-1">
          <h3 className="font-semibold">{suggestion.common_name}</h3>
          <p className="text-[13px] text-muted">
            {new Date(suggestion.created_at).toLocaleDateString()}
          </p>
          {suggestion.notes && (
            <p className="text-sm text-muted mt-1">
              {suggestion.notes}
            </p>
          )}
        </div>
      </div>
      <div className="flex gap-2 mt-3">
        <button
          onClick={() => handleAction("approved")}
          disabled={loading}
          className="btn-primary px-4 py-1.5 text-sm"
        >
          Approve
        </button>
        <button
          onClick={() => handleAction("rejected")}
          disabled={loading}
          className="btn-danger px-4 py-1.5 text-sm"
        >
          Reject
        </button>
      </div>
    </div>
  );
}
