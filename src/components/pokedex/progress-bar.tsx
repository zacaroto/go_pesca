import { useTranslations } from "next-intl";

type Props = {
  caught: number;
  total: number;
};

export function ProgressBar({ caught, total }: Props) {
  const t = useTranslations("pokedex");
  const pct = total > 0 ? Math.round((caught / total) * 100) : 0;

  return (
    <div className="mb-6">
      <p className="text-sm font-medium mb-2">
        {t("progress", { caught, total })}
      </p>
      <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-600 rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
