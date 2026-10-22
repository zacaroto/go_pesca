import { Link } from "@/i18n/navigation";

type Props = { back: { href: string; label: string }; title: string; intro?: string; meta?: React.ReactNode };

/** Shared header for Aprender sub-pages: back link, Caslon title, optional intro line. */
export function LearnHeader({ back, title, intro, meta }: Props) {
  return (
    <header className="mb-8">
      <Link
        href={back.href}
        className="mb-4 inline-flex items-center gap-2 py-2 text-small font-medium text-muted hover:text-text active:scale-[0.98] transition-[color,transform] duration-[var(--t-press)] motion-reduce:transition-none motion-reduce:active:scale-100"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        {back.label}
      </Link>
      {meta && <div className="mb-2 text-label text-muted">{meta}</div>}
      <h1 className="m-0 font-serif-display text-[length:clamp(var(--text-heading),6vw,var(--text-title))] leading-none text-text">{title}</h1>
      {intro && <p className="m-0 mt-3 max-w-[60ch] text-body text-muted">{intro}</p>}
    </header>
  );
}
