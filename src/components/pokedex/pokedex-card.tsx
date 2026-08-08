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
      className={`group block rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 ${
        caught
          ? "bg-white dark:bg-gray-800 shadow-sm hover:shadow-xl hover:shadow-cyan-100/50 dark:hover:shadow-cyan-900/20 ring-1 ring-cyan-100 dark:ring-cyan-800/40"
          : "bg-gray-50 dark:bg-gray-800/50 opacity-60 hover:opacity-80 ring-1 ring-gray-200 dark:ring-gray-700"
      }`}
    >
      <div
        className={`relative h-36 flex items-center justify-center overflow-hidden ${
          caught
            ? "bg-gradient-to-br from-cyan-50 via-blue-50 to-teal-50 dark:from-cyan-900/20 dark:via-blue-900/20 dark:to-teal-900/20"
            : "bg-gray-100 dark:bg-gray-800"
        }`}
      >
        {caught && entry.first_catch_photo ? (
          <img
            src={entry.first_catch_photo}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="flex flex-col items-center gap-1">
            <svg className={`w-10 h-10 ${caught ? "text-cyan-300" : "text-gray-300 dark:text-gray-600"}`} viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-1 14.5c-2 0-4-1.5-4-4s2-5 4-5c1 0 2 .5 2.5 1l2-1.5c.5-.3 1 0 .8.5l-1 3h2c.5 0 .7.5.4.8l-4 4c-.3.3-.7.1-.7-.3v-2h-1c-.5 0-1-.3-1-.5z"/>
            </svg>
            <span className="text-[10px] text-gray-400 dark:text-gray-500">?</span>
          </div>
        )}
        {caught && (
          <div className="absolute top-2 right-2 bg-cyan-600/90 backdrop-blur-sm text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
            x{entry.catch_count}
          </div>
        )}
      </div>
      <div className="p-2.5">
        <h3 className={`font-semibold text-sm leading-tight ${caught ? "text-gray-900 dark:text-gray-100" : "text-gray-400 dark:text-gray-500"}`}>
          {name}
        </h3>
        <p className="text-[11px] text-gray-400 dark:text-gray-500 italic mt-0.5 truncate">
          {entry.scientific_name}
        </p>
      </div>
    </Link>
  );
}
