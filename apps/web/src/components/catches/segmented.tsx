"use client";

type Option = { value: string; label: string };

type Props = {
  label: string;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
};

/** Pill-track segmented control. Stored values stay separate from the visible labels. */
export function Segmented({ label, options, value, onChange }: Props) {
  return (
    <div role="group" aria-label={label} className="flex flex-wrap sm:flex-nowrap bg-[var(--ground)] rounded-[var(--r-pill)] p-[3px] gap-0.5">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          aria-pressed={o.value === value}
          data-selected={o.value === value}
          onClick={() => onChange(o.value)}
          className="flex-1 min-w-[72px] h-[34px] px-2 rounded-[var(--r-pill)] text-[13px] text-[var(--muted)] cursor-pointer hover:text-[var(--text)] active:bg-[var(--raised)] data-[selected=true]:bg-[var(--surface)] data-[selected=true]:text-[var(--text)] data-[selected=true]:font-semibold focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--accent)] transition-[background-color,color] duration-[var(--t-ui)] motion-reduce:transition-none"
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
