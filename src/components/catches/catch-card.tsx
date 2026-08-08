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
      className="group flex gap-3 rounded-2xl bg-white dark:bg-gray-800/50 ring-1 ring-gray-100 dark:ring-gray-700/50 p-3 hover:shadow-lg hover:shadow-cyan-100/30 dark:hover:shadow-cyan-900/10 transition-all duration-300 hover:-translate-y-0.5"
    >
      <div className="relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden">
        <img
          src={catch_entry.photo_url}
          alt=""
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <h3 className="font-semibold text-sm text-gray-900 dark:text-gray-100">
          {catch_entry.species_name}
        </h3>
        <div className="flex items-center gap-3 mt-1.5">
          <span className="inline-flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
            <svg className="w-3.5 h-3.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
            </svg>
            {day} {month}
          </span>
          {catch_entry.location_name && (
            <span className="inline-flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 truncate">
              <svg className="w-3.5 h-3.5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
              </svg>
              {catch_entry.location_name}
            </span>
          )}
        </div>
      </div>
      <div className="flex-shrink-0 self-center">
        <svg className="w-4 h-4 text-gray-300 dark:text-gray-600 group-hover:text-cyan-500 transition-colors" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
        </svg>
      </div>
    </Link>
  );
}
