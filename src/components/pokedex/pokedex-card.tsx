import Link from "next/link";
import type { PokedexEntry } from "@/lib/pokedex";

type Props = {
  entry: PokedexEntry;
  locale: string;
};

export function PokedexCard({ entry, locale }: Props) {
  const name = locale === "es" ? entry.name_es : entry.name_en;
  const caught = entry.catch_count > 0;

  return (
    <Link
      href={`/pokedex/${entry.id}`}
      className={`block rounded-lg border overflow-hidden hover:shadow-md transition-shadow ${
        caught
          ? "border-blue-300 dark:border-blue-700"
          : "border-gray-200 dark:border-gray-700 opacity-60"
      }`}
    >
      <div
        className={`h-32 flex items-center justify-center ${
          caught
            ? "bg-blue-50 dark:bg-blue-900/20"
            : "bg-gray-100 dark:bg-gray-800"
        }`}
      >
        {caught && entry.first_catch_photo ? (
          <img
            src={entry.first_catch_photo}
            alt={name}
            className="w-full h-full object-cover"
          />
        ) : (
          <span
            className={`text-4xl ${caught ? "" : "grayscale opacity-40"}`}
          >
            🐟
          </span>
        )}
      </div>
      <div className="p-2">
        <h3 className={`font-semibold text-sm ${!caught ? "text-gray-400" : ""}`}>
          {name}
        </h3>
        <p className="text-xs text-gray-500 italic">{entry.scientific_name}</p>
        {caught && (
          <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
            x{entry.catch_count}
          </p>
        )}
      </div>
    </Link>
  );
}
