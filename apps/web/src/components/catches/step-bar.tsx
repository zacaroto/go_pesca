"use client";

type Props = {
  steps: string[];
  current: number;
  label: string;
  onSelect: (step: number) => void;
};

export function StepBar({ steps, current, label, onSelect }: Props) {
  return (
    <div className="flex gap-1.5 mb-6" role="group" aria-label={label}>
      {steps.map((name, i) => {
        const n = i + 1;
        const state = n === current ? "current" : n < current ? "done" : "later";
        return (
          <button
            key={name}
            type="button"
            onClick={() => onSelect(n)}
            aria-current={state === "current" ? "step" : undefined}
            data-state={state}
            className="flex-1 text-left pt-2.5 pb-1 text-[13px] cursor-pointer border-t-[3px] border-[var(--raised)] text-[var(--muted)] hover:text-[var(--text)] active:opacity-70 data-[state=done]:border-[var(--text)] data-[state=done]:text-[var(--text)] data-[state=current]:border-[var(--accent)] data-[state=current]:text-[var(--text)] data-[state=current]:font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] transition-[border-color,color,opacity] duration-[var(--t-ui)] motion-reduce:transition-none"
          >
            <span className="tabular-nums">{n}</span> · {name}
          </button>
        );
      })}
    </div>
  );
}
