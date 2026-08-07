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
      <div className="relative w-full h-5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-cyan-500 to-teal-400 rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
        <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-gray-700 dark:text-gray-200 mix-blend-difference">
          {pct}%
        </span>
      </div>
    </div>
  );
}
