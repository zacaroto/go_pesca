import type { ReactNode } from "react";
import type { FeaturedSpecies } from "@/lib/species-facts-data";
import { SpeciesCarousel } from "@/components/landing/species-carousel";
import { Reveal } from "@/components/landing/reveal";

/** Login/register: the form on the left, the species carousel filling the right half from lg up. */
export function AuthLayout({ title, lede, species, children }: { title: string; lede: string; species: FeaturedSpecies[]; children: ReactNode }) {
  const withPanel = species.length > 0;
  return (
    <div className={`grid w-full flex-1 ${withPanel ? "lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]" : ""}`}>
      <div className="flex items-center px-4 py-12 sm:px-12 lg:py-16">
        <div className={`w-full max-w-[400px] ${withPanel ? "lg:ml-auto lg:mr-16" : "mx-auto"}`}>
          <Reveal>
            <h1 className="m-0 font-serif-display text-[40px] font-black leading-none tracking-[-0.03em] sm:text-5xl">{title}</h1>
          </Reveal>
          <Reveal delay={1}>
            <p className="mt-2.5 mb-6 text-muted">{lede}</p>
          </Reveal>
          <Reveal delay={2}>{children}</Reveal>
        </div>
      </div>
      {withPanel && (
        <div className="hidden lg:block">
          <SpeciesCarousel species={species} variant="panel" />
        </div>
      )}
    </div>
  );
}
