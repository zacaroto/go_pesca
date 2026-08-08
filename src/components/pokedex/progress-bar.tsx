import { useTranslations } from "next-intl";
import { RankBadge } from "@/components/rank/rank-badge";
import { getRank } from "@/lib/rank";

type Props = {
  caught: number;
  total: number;
};

const NEXT_RANK_THRESHOLDS = [7, 13, 20, 27, 33, 40, 47, 53, 60, 67, 73, 80, 87, 93, 100];

export function ProgressBar({ caught, total }: Props) {
  const t = useTranslations("pokedex");
  const pct = total > 0 ? Math.round((caught / total) * 100) : 0;
  const { key } = getRank(caught, total);

  // Find next rank threshold
  const nextThreshold = NEXT_RANK_THRESHOLDS.find((th) => th > pct);
  const speciesNeeded = nextThreshold
    ? Math.ceil((nextThreshold / 100) * total) - caught
    : 0;

  const gradients: Record<string, string> = {
    sardina: "from-gray-400 to-gray-500",
    tilapia: "from-green-400 to-emerald-500",
    robalo: "from-blue-400 to-cyan-500",
    dorado: "from-amber-400 to-yellow-500",
    marlinAzul: "from-purple-500 to-indigo-500",
  };

  return (
    <div className="mb-6 p-4 rounded-xl bg-white dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-lg font-bold">
            {t("progress", { caught, total })}
          </p>
          {nextThreshold && speciesNeeded > 0 && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {speciesNeeded} more to rank up
            </p>
          )}
        </div>
        <RankBadge caught={caught} total={total} size="md" />
      </div>
      <div className="relative w-full h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r ${gradients[key] ?? gradients.sardina} rounded-full transition-all duration-700 ease-out`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex justify-between mt-1.5">
        <span className="text-[10px] text-gray-400 font-medium">0%</span>
        <span className="text-[10px] text-gray-400 font-medium">{pct}%</span>
        <span className="text-[10px] text-gray-400 font-medium">100%</span>
      </div>
    </div>
  );
}
