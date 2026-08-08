import Link from "next/link";

type CatchEntry = {
  id: string;
  photo_url: string;
  catch_date: string;
  location_name: string | null;
  species_name: string;
};

type Props = {
  catch_entry: CatchEntry;
};

export function CatchCard({ catch_entry }: Props) {
  const date = new Date(catch_entry.catch_date + "T00:00:00");
  const day = date.getDate();
  const month = date.toLocaleDateString(undefined, { month: "short" });

  return (
    <Link
      href={`/catches/${catch_entry.id}`}
      className="group flex gap-3.5 rounded-2xl bg-surface dark:bg-surface-alt ring-1 ring-foreground/5 dark:ring-white/5 p-3 hover:shadow-ocean transition-all duration-300 hover:-translate-y-0.5"
    >
      {/* Photo with rounded overlay */}
      <div className="relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden ring-2 ring-primary-light/20">
        <img
          src={catch_entry.photo_url}
          alt=""
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {/* Gradient overlay at bottom */}
        <div className="absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-black/30 to-transparent" />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <h3 className="font-bold text-sm text-foreground">
          {catch_entry.species_name}
        </h3>
        <div className="flex items-center gap-3 mt-1.5">
          <span className="inline-flex items-center gap-1 text-xs text-muted font-medium">
            <svg className="w-3.5 h-3.5 text-accent" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path fillRule="evenodd" d="M6.75 2.25A.75.75 0 0 1 7.5 3v1.5h9V3A.75.75 0 0 1 18 3v1.5h.75a3 3 0 0 1 3 3v11.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V7.5a3 3 0 0 1 3-3H6V3a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
            </svg>
            {day} {month}
          </span>
          {catch_entry.location_name && (
            <span className="inline-flex items-center gap-1 text-xs text-muted font-medium truncate">
              <svg className="w-3.5 h-3.5 flex-shrink-0 text-coral" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path fillRule="evenodd" d="m11.54 22.351.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a16.975 16.975 0 0 0 1.144-.742 19.58 19.58 0 0 0 2.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 0 0-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 0 0 3.834 3.025ZM12 12.75a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" clipRule="evenodd" />
              </svg>
              {catch_entry.location_name}
            </span>
          )}
        </div>
      </div>

      {/* Arrow */}
      <div className="flex-shrink-0 self-center">
        <svg className="w-5 h-5 text-muted/40 group-hover:text-accent group-hover:translate-x-0.5 transition-all duration-200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
        </svg>
      </div>
    </Link>
  );
}
