import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { FishMark } from "@/components/layout/fish-mark";
import { TrophyPill } from "./personal-records";

export type ProfileCatch = {
  id: string;
  speciesName: string;
  photoUrl: string | null;
  weightKg: number | null;
  locationName: string | null;
  trophy: boolean;
};

type Props = { catches: ProfileCatch[]; isOwner: boolean; locale: string };

/** Recent catches grid. Only the owner can open a catch (its page is owner-only). */
export function ProfileCatches({ catches, isOwner, locale }: Props) {
  const t = useTranslations("profile");
  const num = new Intl.NumberFormat(locale === "en" ? "en" : "es-CR", { maximumFractionDigits: 1 });

  return (
    <section>
      <h2 className="m-0 mb-3 font-serif-display text-2xl font-bold">{t("catches")}</h2>
      {catches.length === 0 ? (
        <p className="m-0 rounded-[var(--r-card)] bg-surface p-5 text-muted">{t("catchesEmpty")}</p>
      ) : (
        <ul className="m-0 grid list-none grid-cols-2 gap-3 p-0 sm:grid-cols-3 lg:grid-cols-4">
          {catches.map((c) => {
            const meta = [c.weightKg != null ? `${num.format(c.weightKg)} kg` : null, c.locationName].filter(Boolean).join(" · ");
            const body = (
              <>
                <div className="relative aspect-square overflow-hidden rounded-[3px] bg-ground">
                  {c.photoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={c.photoUrl} alt={c.speciesName} loading="lazy" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <FishMark className="h-12 w-12 text-silhouette" />
                    </div>
                  )}
                  {c.trophy && <TrophyPill className="absolute top-2 left-2" />}
                </div>
                <p className="m-0 mt-2 truncate font-serif-display text-base font-bold text-text">{c.speciesName}</p>
                {meta && <p className="m-0 truncate text-[13px] text-muted">{meta}</p>}
              </>
            );
            return (
              <li key={c.id} className="min-w-0">
                {isOwner ? (
                  <Link
                    href={`/catches/${c.id}`}
                    className="block rounded-[var(--r-card)] bg-surface p-2.5 hover:bg-raised active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 transition-[background-color,transform] duration-[var(--t-ui)] ease-[var(--ease-out)] motion-reduce:transition-none motion-reduce:active:scale-100"
                  >
                    {body}
                  </Link>
                ) : (
                  <div className="rounded-[var(--r-card)] bg-surface p-2.5">{body}</div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
