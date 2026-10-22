"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { FishMark } from "@/components/layout/fish-mark";
import type { FeaturedSpecies } from "@/lib/species-facts-data";

const INTERVAL_MS = 4200;

type Props = {
  species: FeaturedSpecies[];
  /** "plate" sits on the landing hero; "panel" fills the login/register side panel. */
  variant?: "plate" | "panel";
};

/**
 * Field-guide plate that cycles through species with a fun fact each. Pauses on hover/focus,
 * dots jump to a species, and it does not autoplay when the user prefers reduced motion.
 */
export function SpeciesCarousel({ species, variant = "plate" }: Props) {
  const t = useTranslations("landing");
  // tick keeps counting across loops so each visit to a species can show its next fact.
  const [tick, setTick] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [failed, setFailed] = useState<Set<number>>(new Set());

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (paused || reduced || species.length < 2) return;
    const id = window.setTimeout(() => setTick((n) => n + 1), INTERVAL_MS);
    return () => window.clearTimeout(id);
  }, [tick, paused, reduced, species.length]);

  if (species.length === 0) return null;
  const index = tick % species.length;
  const current = species[index];
  const fact = current.facts.length ? current.facts[Math.floor(tick / species.length) % current.facts.length] : null;
  const goTo = (i: number) => setTick((n) => n - (n % species.length) + i);

  const panel = variant === "panel";

  return (
    <figure
      className={`relative m-0 overflow-hidden bg-surface ${panel ? "h-full min-h-[560px]" : "h-[440px] rounded-[var(--r-card)] sm:h-[520px]"}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label={t("carouselLabel")}
    >
      {species.map((s, i) => (
        <div
          key={s.id}
          aria-hidden={i !== index}
          className={`absolute inset-x-6 top-6 bottom-[170px] grid place-items-center transition-[opacity,transform] duration-700 ease-[var(--ease-out)] motion-reduce:transition-none sm:inset-x-10 sm:top-10 ${
            i === index ? "translate-x-0 opacity-100" : "translate-x-6 opacity-0"
          }`}
        >
          {s.photoUrl && !failed.has(s.id) ? (
            // eslint-disable-next-line @next/next/no-img-element -- remote reference photo (fishbase)
            <img
              src={s.photoUrl}
              alt={s.name}
              className="h-full w-full object-contain"
              loading={i === 0 ? "eager" : "lazy"}
              onError={() => setFailed((prev) => new Set(prev).add(s.id))}
            />
          ) : (
            <FishMark className="h-28 w-28 text-silhouette" />
          )}
        </div>
      ))}

      <figcaption className="absolute inset-x-6 bottom-6 sm:inset-x-10 sm:bottom-8" aria-live={paused ? "polite" : "off"}>
        <div className="flex items-end justify-between gap-4">
          <div className="min-w-0">
            <b className="block truncate font-serif-display text-[32px] font-black leading-none tracking-[-0.02em] sm:text-[40px]">
              {current.name}
            </b>
            <span className="sci-name block truncate text-base sm:text-lg">{current.scientificName}</span>
          </div>
          <div className="flex shrink-0 gap-1.5" role="group" aria-label={t("carouselLabel")}>
            {species.map((s, i) => (
              <button
                key={s.id}
                type="button"
                aria-current={i === index}
                aria-label={s.name}
                onClick={() => goTo(i)}
                className="relative h-6 w-6 rounded-full focus-visible:outline-2 focus-visible:outline-offset-1"
              >
                <span className="absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 overflow-hidden rounded-full bg-raised">
                  {i === index && (
                    <span
                      key={`${tick}-${paused}`}
                      className={`absolute inset-0 origin-left bg-accent ${
                        paused || reduced ? "" : "animate-[carousel-fill_var(--carousel-ms)_linear_forwards]"
                      }`}
                      style={{ ["--carousel-ms" as string]: `${INTERVAL_MS}ms` }}
                    />
                  )}
                </span>
              </button>
            ))}
          </div>
        </div>
        {fact && (
          <p key={`${current.id}-${fact}`} className="mt-3 mb-0 max-w-[52ch] text-[15px] text-text motion-safe:animate-[fact-in_500ms_var(--ease-out)]">
            <span className="font-semibold text-accent-ink">{t("didYouKnow")} </span>
            {fact}
          </p>
        )}
      </figcaption>
    </figure>
  );
}
