"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type State = "static" | "hidden" | "shown";

/**
 * Fades and lifts its children in the first time they scroll into view.
 * Server render and no-JS stay fully visible ("static"); reduced motion never hides anything.
 */
export function Reveal({
  children,
  delay = 0,
  className = "",
  as: Tag = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "li" | "section";
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [state, setState] = useState<State>("static");

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.9) {
      // Already on screen at load: play the entrance once.
      setState("hidden");
      const frame = requestAnimationFrame(() => setState("shown"));
      return () => cancelAnimationFrame(frame);
    }
    setState("hidden");
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setState("shown");
          io.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref as never}
      data-reveal={state}
      className={`reveal ${className}`}
      style={{ ["--reveal-delay" as string]: `${delay * 90}ms` }}
    >
      {children}
    </Tag>
  );
}
