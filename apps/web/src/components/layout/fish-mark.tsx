export function FishMark({ className = "w-7 h-7" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2 12c3-5 9-7 14-4l5-3v14l-5-3c-5 3-11 1-14-4z" />
      <circle cx="7.5" cy="11" r=".8" />
    </svg>
  );
}
