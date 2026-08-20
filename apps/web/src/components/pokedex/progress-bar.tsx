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

  const nextThreshold = NEXT_RANK_THRESHOLDS.find((th) => th > pct);
  const speciesNeeded = nextThreshold
    ? Math.ceil((nextThreshold / 100) * total) - caught
    : 0;

  const gradients: Record<string, string> = {
    sardina: "from-muted to-muted",
    tilapia: "from-secondary to-emerald-400",
    robalo: "from-primary to-primary-light",
    dorado: "from-accent to-accent-light",
    marlinAzul: "from-coral to-purple-500",
  };

  const bgColors: Record<string, string> = {
    sardina: "bg-muted/10 border-muted/20",
    tilapia: "bg-secondary/10 border-secondary/20",
    robalo: "bg-primary/10 border-primary/20",
    dorado: "bg-accent/10 border-accent/20",
    marlinAzul: "bg-coral/10 border-coral/20",
  };

  return (
    <div className={`mb-6 p-5 rounded-2xl border-2 ${bgColors[key] ?? bgColors.sardina} shadow-sm`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xl font-extrabold" style={{ fontFamily: "var(--font-fredoka)" }}>
            {t("progress", { caught, total })}
          </p>
          {nextThreshold && speciesNeeded > 0 && (
            <p className="text-xs text-muted mt-1 font-medium">
              {speciesNeeded} more to rank up
            </p>
          )}
        </div>
        <RankBadge caught={caught} total={total} size="md" />
      </div>

      {/* Progress bar */}
      <div className="relative w-full h-4 bg-foreground/10 dark:bg-white/10 rounded-full overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r ${gradients[key] ?? gradients.sardina} rounded-full transition-all duration-1000 ease-out relative`}
          style={{ width: `${Math.max(pct, 2)}%` }}
        >
          {/* Animated shimmer overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
        </div>
      </div>

      <div className="flex justify-between mt-2">
        <span className="text-[10px] text-muted font-bold">0%</span>
        <span className="text-[10px] font-extrabold text-foreground">{pct}%</span>
        <span className="text-[10px] text-muted font-bold">100%</span>
      </div>
    </div>
  );
}
