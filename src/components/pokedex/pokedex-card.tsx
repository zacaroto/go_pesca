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
      className={`block rounded-lg border overflow-hidden transition-all duration-200 hover:-translate-y-0.5 ${
        caught
          ? "border-cyan-300 dark:border-cyan-700 shadow-sm hover:shadow-lg hover:shadow-cyan-100 dark:hover:shadow-cyan-900/30 ring-1 ring-cyan-100 dark:ring-cyan-900/50"
          : "border-gray-200 dark:border-gray-700 opacity-50 hover:opacity-70 hover:shadow-md"
      }`}
    >
      <div
        className={`h-32 flex items-center justify-center ${
          caught
            ? "bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20"
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
          <svg className={`w-12 h-12 ${caught ? "text-cyan-400" : "text-gray-300 dark:text-gray-600"}`} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-1 14.5c-2 0-4-1.5-4-4s2-5 4-5c1 0 2 .5 2.5 1l2-1.5c.5-.3 1 0 .8.5l-1 3h2c.5 0 .7.5.4.8l-4 4c-.3.3-.7.1-.7-.3v-2h-1c-.5 0-1-.3-1-.5z"/>
          </svg>
        )}
      </div>
      <div className="p-2">
        <h3 className={`font-semibold text-sm ${!caught ? "text-gray-400" : ""}`}>
          {name}
        </h3>
        <p className="text-xs text-gray-500 italic">{entry.scientific_name}</p>
        {caught && (
          <p className="text-xs text-cyan-600 dark:text-cyan-400 mt-1 font-medium">
            x{entry.catch_count}
          </p>
        )}
      </div>
    </Link>
  );
}
