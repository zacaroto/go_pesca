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
    } catch {
      // Error handling
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4">
      <div className="flex gap-4">
        {suggestion.photo_url && (
          <img
            src={suggestion.photo_url}
            alt={suggestion.common_name}
            className="w-20 h-20 object-cover rounded"
          />
        )}
        <div className="flex-1">
          <h3 className="font-semibold">{suggestion.common_name}</h3>
          <p className="text-xs text-gray-500">
            {new Date(suggestion.created_at).toLocaleDateString()}
          </p>
          {suggestion.notes && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {suggestion.notes}
            </p>
          )}
        </div>
      </div>
      <div className="flex gap-2 mt-3">
        <button
          onClick={() => handleAction("approved")}
          disabled={loading}
          className="px-4 py-1.5 text-sm bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
        >
          Approve
        </button>
        <button
          onClick={() => handleAction("rejected")}
          disabled={loading}
          className="px-4 py-1.5 text-sm bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
        >
          Reject
        </button>
      </div>
    </div>
  );
}
