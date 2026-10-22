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
      <p className="text-muted text-center py-8">{t("noCatches")}</p>
    );
  }

  const fmt = (d: string | undefined) =>
    d
      ? new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeZone: "UTC" }).format(
          new Date(`${d}T00:00:00Z`)
        )
      : "—";
  const firstDate = fmt(catches[catches.length - 1]?.catch_date);
  const lastDate = fmt(catches[0]?.catch_date);

  return (
    <div>
      <div className="grid grid-cols-3 gap-4 mb-6 text-center">
        <div>
          <p className="text-subhead font-bold">{catches.length}</p>
          <p className="text-label text-muted">{t("totalCatches")}</p>
        </div>
        <div>
          <p className="text-small font-medium">{firstDate}</p>
          <p className="text-label text-muted">{t("firstCatch")}</p>
        </div>
        <div>
          <p className="text-small font-medium">{lastDate}</p>
          <p className="text-label text-muted">{t("lastCatch")}</p>
        </div>
      </div>

      <div className="space-y-4">
        {catches.map((c) => (
          <div
            key={c.id}
            className="flex gap-4 rounded-[var(--r-card)] bg-surface p-3"
          >
            <img
              src={c.photo_url}
              alt=""
              className="w-20 h-20 object-cover rounded-[var(--r-control)]"
            />
            <div className="flex-1 min-w-0">
              <p className="text-small font-medium">{fmt(c.catch_date)}</p>
              {c.location_name && (
                <p className="text-label text-muted">
                  {tCatches("location")}: {c.location_name}
                </p>
              )}
              {c.weight_kg && (
                <p className="text-label text-muted">
                  {tCatches("weight")}: {c.weight_kg}
                </p>
              )}
              {c.length_cm && (
                <p className="text-label text-muted">
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
