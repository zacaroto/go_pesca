import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function Home({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <HomeContent />;
}

function HomeContent() {
  const t = useTranslations();

  return (
    <div className="flex flex-col flex-1 relative overflow-hidden">
      {/* Hero Canvas */}
      <main className="flex-grow relative flex flex-col items-center justify-center w-full hero-gradient pt-8 pb-36 md:pb-44 min-h-[calc(100vh-4rem)]">
        {/* Decorative Floating Bubbles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <div className="bubble w-12 h-12 left-[10%]" style={{ animationDuration: "8s", animationDelay: "0s" }} />
          <div className="bubble w-8 h-8 left-[25%]" style={{ animationDuration: "6s", animationDelay: "1.5s" }} />
          <div className="bubble w-16 h-16 left-[50%]" style={{ animationDuration: "9s", animationDelay: "3s" }} />
          <div className="bubble w-10 h-10 left-[75%]" style={{ animationDuration: "7s", animationDelay: "0.5s" }} />
          <div className="bubble w-14 h-14 left-[88%]" style={{ animationDuration: "10s", animationDelay: "2s" }} />
        </div>

        <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-4xl mx-auto mt-4">
          {/* Hero Sticker Illustration */}
          <div className="relative mb-6 animate-bounce" style={{ animationDuration: "4s" }}>
            <div className="w-52 h-52 md:w-72 md:h-72 object-contain sticker-border rounded-full bg-white/40 backdrop-blur-md p-4 flex items-center justify-center shadow-xl">
              <svg width="160" height="160" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-40 h-40 md:w-56 md:h-56 filter drop-shadow-md">
                {/* Stylized Jump Marlin / Fish Icon in Vibrant Vector */}
                <g transform="translate(4, 2)">
                  <path
                    d="M52 28 C42 12 24 8 10 14 L4 4 L6 28 L12 18 C26 22 40 18 48 4 C50 14 44 26 36 34 L48 44 L44 32 C54 36 56 46 54 54 C46 44 38 40 28 42 L24 48 L22 38 C14 38 8 42 4 48 C6 38 12 30 22 26 C32 22 44 26 52 28 Z"
                    fill="#0061A7"
                    stroke="#FFFFFF"
                    strokeWidth="2.5"
                    strokeLinejoin="round"
                  />
                  <circle cx="18" cy="18" r="3.5" fill="#FFD60A" stroke="#0F1A37" strokeWidth="1.5" />
                  <circle cx="19" cy="17" r="1.2" fill="#0F1A37" />
                  {/* Underbelly Accent */}
                  <path
                    d="M14 20 C24 24 36 22 44 14 C40 20 34 28 26 32 C18 30 14 24 14 20 Z"
                    fill="#25FEA8"
                    opacity="0.9"
                  />
                </g>
              </svg>
            </div>
            {/* Star Sticker Badge */}
            <div className="absolute -bottom-3 -right-3 w-14 h-14 bg-sunny-yellow rounded-full flex items-center justify-center chunky-border rotate-12 bouncy-shadow">
              <span className="material-symbols-outlined text-tertiary-container text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                star
              </span>
            </div>
          </div>

          {/* Headline */}
          <h1
            className="font-display-lg text-[40px] md:text-[64px] font-bold leading-tight text-on-primary-fixed drop-shadow-md mb-4 px-2 tracking-tight"
            style={{ fontFamily: "var(--font-fredoka)" }}
          >
            {t("home.hero")} 🎣
          </h1>

          <p className="font-body-lg text-base sm:text-lg md:text-xl text-on-primary-fixed-variant max-w-xl mx-auto mb-8 bg-white/40 p-4 sm:p-5 rounded-xl border-2 border-white backdrop-blur-sm">
            {t("home.subtitle")}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto px-4 justify-center items-center">
            <Link
              href="/catches/new"
              className="w-full sm:w-auto bg-gradient-to-r from-[#FF9A9E] to-[#FECFEF] text-on-surface font-headline-md text-lg md:text-xl py-4 px-8 rounded-full border-3 border-white bouncy-shadow bouncy-hover bouncy-active transition-all flex items-center justify-center gap-2.5 font-bold"
              style={{ fontFamily: "var(--font-fredoka)" }}
            >
              <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                add_circle
              </span>
              + {t("nav.newCatch")}
            </Link>

            <Link
              href="/pokedex"
              className="w-full sm:w-auto bg-secondary-container text-on-secondary-container font-headline-md text-lg md:text-xl py-4 px-8 rounded-full border-3 border-white bouncy-shadow bouncy-hover bouncy-active transition-all flex items-center justify-center gap-2.5 font-bold"
              style={{ fontFamily: "var(--font-fredoka)" }}
            >
              <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                style
              </span>
              {t("home.title")}
            </Link>
          </div>
        </div>

        {/* Wave Divider Bottom */}
        <div className="absolute bottom-0 w-full h-24 md:h-36 wave-bg z-0" aria-hidden="true" />
      </main>
    </div>
  );
}
