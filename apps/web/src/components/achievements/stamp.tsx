import { AchievementIcon } from "./achievement-icon";

type Props = {
  id: string;
  name: string;
  description: string;
  /** ISO date when earned; absent while locked. */
  awardedAt?: string;
  progress: { current: number; total: number } | null;
  tilt: number;
  locale: string;
  labels: { sealedOn: (date: string) => string; progress: (current: number, total: number) => string };
};

/** One page of the stamp book: an inked, slightly tilted seal once earned; a dashed outline until then. */
export function Stamp({ id, name, description, awardedAt, progress, tilt, locale, labels }: Props) {
  const earned = Boolean(awardedAt);
  const date = awardedAt ? new Date(awardedAt) : null;
  const sealDate = date?.toLocaleDateString(locale, { month: "short", year: "numeric", timeZone: "America/Costa_Rica" }).toUpperCase();
  const longDate = date?.toLocaleDateString(locale, { day: "numeric", month: "long", year: "numeric", timeZone: "America/Costa_Rica" });

  return (
    <li className="flex min-w-0 flex-col items-center gap-2 px-2 py-3 text-center">
      <div
        className={`relative grid h-[118px] w-[118px] place-items-center rounded-full bg-surface ${
          earned
            ? "border-[3px] border-accent text-accent motion-safe:animate-[badge-pop_400ms_var(--ease-spring)] before:absolute before:inset-[6px] before:rounded-full before:border-[1.5px] before:border-dashed before:border-current before:opacity-60"
            : "border-[3px] border-dashed border-silhouette text-faint"
        }`}
        style={earned ? { transform: `rotate(${tilt}deg)` } : undefined}
      >
        <AchievementIcon id={id} className="h-10 w-10" />
        {sealDate && <span className="absolute bottom-5 text-[10px] font-bold tracking-[0.08em]">{sealDate}</span>}
      </div>
      <h3 className={`m-0 font-serif-display text-name font-bold leading-tight ${earned ? "text-text" : "text-muted"}`}>{name}</h3>
      <p className="m-0 text-label text-muted">
        {longDate ? labels.sealedOn(longDate) : progress ? labels.progress(progress.current, progress.total) : description}
      </p>
      {!earned && progress && (
        <span className="block h-1.5 w-24 overflow-hidden rounded-full bg-raised" aria-hidden="true">
          <span className="block h-full rounded-full bg-progress" style={{ width: `${(progress.current / progress.total) * 100}%` }} />
        </span>
      )}
      {!earned && progress && <span className="sr-only">{description}</span>}
    </li>
  );
}
