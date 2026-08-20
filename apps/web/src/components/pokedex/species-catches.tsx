import { useTranslations } from "next-intl";
import type { Database } from "@/lib/database.types";

type Catch = Database["public"]["Tables"]["catches"]["Row"];

type Props = {
  catches: Catch[];
  locale: string;
};

export function SpeciesCatches({ catches, locale }: Props) {
  const t = useTranslations("pokedex");
  const tCatches = useTranslations("catches");

  if (catches.length === 0) {
    return (
      <p className="text-gray-500 text-center py-8">{t("noCatches")}</p>
    );
  }

  const firstDate = catches[catches.length - 1]?.catch_date;
  const lastDate = catches[0]?.catch_date;

  return (
    <div>
      <div className="grid grid-cols-3 gap-4 mb-6 text-center">
        <div>
          <p className="text-2xl font-bold">{catches.length}</p>
          <p className="text-xs text-gray-500">{t("totalCatches")}</p>
        </div>
        <div>
          <p className="text-sm font-medium">{firstDate}</p>
          <p className="text-xs text-gray-500">{t("firstCatch")}</p>
        </div>
        <div>
          <p className="text-sm font-medium">{lastDate}</p>
          <p className="text-xs text-gray-500">{t("lastCatch")}</p>
        </div>
      </div>

      <div className="space-y-4">
        {catches.map((c) => (
          <div
            key={c.id}
            className="flex gap-4 rounded-lg border border-gray-200 dark:border-gray-700 p-3"
          >
            <img
              src={c.photo_url}
              alt=""
              className="w-20 h-20 object-cover rounded"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">{c.catch_date}</p>
              {c.location_name && (
                <p className="text-xs text-gray-500">
                  {tCatches("location")}: {c.location_name}
                </p>
              )}
              {c.weight_kg && (
                <p className="text-xs text-gray-500">
                  {tCatches("weight")}: {c.weight_kg}
                </p>
              )}
              {c.length_cm && (
                <p className="text-xs text-gray-500">
                  {tCatches("length")}: {c.length_cm}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
