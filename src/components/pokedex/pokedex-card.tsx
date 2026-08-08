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
      className={`group block rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1.5 ${
        caught
          ? "holo-border bg-surface dark:bg-surface-alt shadow-sm hover:shadow-ocean"
          : "bg-foreground/5 dark:bg-white/5 opacity-55 hover:opacity-75"
      }`}
    >
      {/* Image area */}
      <div
        className={`relative h-36 flex items-center justify-center overflow-hidden ${
          caught
            ? "bg-gradient-to-br from-primary-light/15 via-secondary/10 to-accent-light/15"
            : "bg-foreground/5 dark:bg-white/5"
        }`}
      >
        {caught && entry.first_catch_photo ? (
          <img
            src={entry.first_catch_photo}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          />
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center ${caught ? "bg-primary-light/20" : "bg-foreground/10 dark:bg-white/10"}`}>
              <span className="text-2xl">❓</span>
            </div>
          </div>
        )}

        {/* Catch count badge */}
        {caught && (
          <div className="absolute top-2 right-2 bg-gradient-to-r from-primary to-primary-light text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-sm">
            x{entry.catch_count}
          </div>
        )}

        {/* Habitat indicator dot */}
        <div className={`absolute bottom-2 left-2 w-2.5 h-2.5 rounded-full ring-2 ring-white/80 dark:ring-surface/80 ${
          entry.habitat === "freshwater" ? "bg-secondary" : entry.habitat === "saltwater" ? "bg-primary" : "bg-accent"
        }`} />
      </div>

      {/* Info */}
      <div className="p-2.5">
        <h3 className={`font-bold text-sm leading-tight ${caught ? "text-foreground" : "text-muted"}`}>
          {caught ? name : "???"}
        </h3>
        <p className="text-[11px] text-muted italic mt-0.5 truncate">
          {caught ? entry.scientific_name : "???"}
        </p>
      </div>
    </Link>
  );
}
