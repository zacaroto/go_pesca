const PATHS: Record<string, React.ReactNode> = {
  first_blood: (
    <>
      <path d="M14 6v14a4 4 0 0 1-8 0" />
      <path d="M14 6l3-3" />
    </>
  ),
  catch_10: (
    <>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="12" cy="12" r="1" />
    </>
  ),
  catch_50: <path d="m12 3 2.6 5.6 6 .7-4.5 4.1 1.2 6L12 16.4 6.7 19.4l1.2-6L3.4 9.3l6-.7z" />,
  species_5: (
    <>
      <path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2z" />
      <path d="M9 4v14M15 6v14" />
    </>
  ),
  species_10: (
    <>
      <circle cx="10" cy="10" r="6" />
      <path d="m20 20-5.5-5.5" />
      <path d="M7 10c1-2 4-2 5 0" />
    </>
  ),
  species_20: <path d="M3 8l4 4 5-7 5 7 4-4-2 11H5z" />,
  big_catch: <path d="M12 3v18M5 7h14M5 7l-3 7a3 3 0 0 0 6 0zM19 7l-3 7a3 3 0 0 0 6 0z" />,
  early_bird: (
    <>
      <circle cx="12" cy="14" r="4" />
      <path d="M2 18h20M12 4v3M4.9 7.9l2 2M19.1 7.9l-2 2" />
    </>
  ),
  night_owl: <path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z" />,
};

/** Line-drawn emblem for each achievement (replaces the old emoji). */
export function AchievementIcon({ id, className = "h-6 w-6" }: { id: string; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {PATHS[id] ?? <circle cx="12" cy="12" r="8" />}
    </svg>
  );
}
