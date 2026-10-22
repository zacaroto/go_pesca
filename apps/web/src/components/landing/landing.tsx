import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { FishMark } from "@/components/layout/fish-mark";
import type { FeaturedSpecies } from "@/lib/species-facts-data";
import { SpeciesCarousel } from "./species-carousel";
import { Reveal } from "./reveal";

const BTN =
  "inline-flex h-12 items-center justify-center rounded-full bg-accent px-6 font-semibold text-on-primary hover:bg-accent-hi active:scale-[0.97] transition-[background-color,transform] duration-[var(--t-ui)] ease-[var(--ease-out)] motion-reduce:transition-none motion-reduce:active:scale-100 focus-visible:outline-2 focus-visible:outline-offset-2";
const BTN_GHOST =
  "inline-flex h-12 items-center justify-center rounded-full px-6 font-semibold text-text hover:bg-raised active:bg-raised active:scale-[0.97] transition-[background-color,transform] duration-[var(--t-ui)] motion-reduce:transition-none motion-reduce:active:scale-100 focus-visible:outline-2 focus-visible:outline-offset-2";

const DEX_SLOTS = 16;

/** Signed-out landing: field-guide hero with a species carousel, FishyDex reveal and how-it-works. */
export async function Landing({ species, totalSpecies }: { species: FeaturedSpecies[]; totalSpecies: number }) {
  const t = await getTranslations("landing");
  // Show the featured species as "discovered" tiles, the rest of the slots as silhouettes.
  const dex = Array.from({ length: DEX_SLOTS }, (_, i) => species[i] ?? null);

  const steps = [
    { title: t("stepPhotoTitle"), body: t("stepPhotoBody"), icon: <path d="M4 8h3l2-3h6l2 3h3v11H4z M12 16.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" /> },
    { title: t("stepSpeciesTitle"), body: t("stepSpeciesBody", { count: totalSpecies }), icon: <path d="M2 12c3-5 9-7 14-4l5-3v14l-5-3c-5 3-11 1-14-4z" /> },
    { title: t("stepPlaceTitle"), body: t("stepPlaceBody"), icon: <path d="M12 21s-7-6.3-7-11.5a7 7 0 0 1 14 0C19 14.7 12 21 12 21z M12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z" /> },
  ];

  return (
    <div className="w-full">
      <section className="mx-auto grid w-full max-w-[1280px] items-center gap-10 px-4 pt-8 pb-20 sm:px-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-14 lg:pb-24">
        <div>
          <Reveal>
            <h1 className="m-0 font-serif-display text-[44px] font-black leading-[0.95] tracking-[-0.035em] text-balance sm:text-[64px] lg:text-[76px]">
              {t("title")}
            </h1>
          </Reveal>
          <Reveal delay={1}>
            <p className="mt-5 mb-0 max-w-[46ch] text-lg text-muted">{t("lede", { count: totalSpecies })}</p>
          </Reveal>
          <Reveal delay={2} className="mt-7 flex flex-wrap gap-2.5">
            <Link href="/auth/register" className={BTN}>
              {t("createAccount")}
            </Link>
            <Link href="/auth/login" className={BTN_GHOST}>
              {t("haveAccount")}
            </Link>
          </Reveal>
          <Reveal delay={3}>
            <p className="mt-7 mb-0 text-[13px] text-faint">{t("meta", { count: totalSpecies })}</p>
          </Reveal>
        </div>
        <Reveal delay={1}>
          {species.length > 0 ? (
            <SpeciesCarousel species={species} />
          ) : (
            <div className="grid h-[440px] place-items-center rounded-[var(--r-card)] bg-surface sm:h-[520px]">
              <FishMark className="h-28 w-28 text-silhouette" />
            </div>
          )}
        </Reveal>
      </section>

      <section className="bg-surface py-20 lg:py-24">
        <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-12">
          <Reveal>
            <h2 className="m-0 font-serif-display text-4xl font-black leading-none tracking-[-0.03em] sm:text-[52px]">{t("dexTitle")}</h2>
          </Reveal>
          <Reveal delay={1}>
            <p className="mt-3.5 mb-0 max-w-[50ch] text-lg text-muted">{t("dexLede")}</p>
          </Reveal>
          <ul className="mt-9 grid list-none grid-cols-4 gap-3 p-0 sm:grid-cols-8">
            {dex.map((s, i) => (
              <Reveal as="li" key={s?.id ?? `empty-${i}`} delay={i % 4} className="rounded-[var(--r-card)] bg-ground p-2">
                <div className="grid h-16 place-items-center overflow-hidden rounded-[3px] bg-surface">
                  {s?.photoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element -- remote reference photo (fishbase)
                    <img src={s.photoUrl} alt="" loading="lazy" className="h-full w-full object-contain" />
                  ) : (
                    <FishMark className="h-9 w-9 text-silhouette" />
                  )}
                </div>
                <p className={`mt-1.5 mb-0 truncate font-serif-display text-[13px] font-bold ${s ? "" : "text-faint"}`}>
                  {s?.name ?? t("undiscovered")}
                </p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1280px] px-4 py-20 sm:px-12 lg:py-24">
        <Reveal>
          <h2 className="m-0 font-serif-display text-4xl font-black leading-none tracking-[-0.03em] sm:text-[52px]">{t("stepsTitle")}</h2>
        </Reveal>
        <Reveal delay={1}>
          <p className="mt-3.5 mb-0 max-w-[50ch] text-lg text-muted">{t("stepsLede")}</p>
        </Reveal>
        <ol className="mt-9 grid list-none gap-5 p-0 md:grid-cols-3">
          {steps.map((step, i) => (
            <Reveal as="li" key={step.title} delay={i} className="rounded-[var(--r-card)] bg-surface p-6">
              <svg viewBox="0 0 24 24" className="h-8 w-8 text-accent" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                {step.icon}
              </svg>
              <h3 className="mt-4 mb-1.5 font-serif-display text-2xl font-bold">{step.title}</h3>
              <p className="m-0 text-muted">{step.body}</p>
            </Reveal>
          ))}
        </ol>
        <Reveal delay={1} className="mt-10 flex flex-wrap gap-2.5">
          <Link href="/auth/register" className={BTN}>
            {t("createAccount")}
          </Link>
        </Reveal>
      </section>
    </div>
  );
}
