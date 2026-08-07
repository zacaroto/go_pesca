import Link from "next/link";
import { useTranslations } from "next-intl";

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
  const t = useTranslations("catches");

  return (
    <Link
      href={`/catches/${catch_entry.id}`}
      className="flex gap-4 rounded-lg border border-gray-200 dark:border-gray-700 p-3 hover:shadow-md transition-shadow"
    >
      <img
        src={catch_entry.photo_url}
        alt=""
        className="w-20 h-20 object-cover rounded flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-sm">{catch_entry.species_name}</h3>
        <p className="text-xs text-gray-500 mt-1">
          {t("date")}: {catch_entry.catch_date}
        </p>
        {catch_entry.location_name && (
          <p className="text-xs text-gray-500">
            {t("location")}: {catch_entry.location_name}
          </p>
        )}
      </div>
    </Link>
  );
}
