import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import Link from "next/link";

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
    <div className="flex flex-col flex-1 -mt-14">
      {/* Hero Section */}
      <section className="relative min-h-[100dvh] flex flex-col items-center justify-center overflow-hidden ocean-gradient">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Floating fish silhouettes */}
          <svg className="absolute top-[18%] left-[8%] w-16 h-16 text-white/10 animate-float-slow" viewBox="0 0 64 64" fill="currentColor">
            <path d="M48 32c-8-12-24-16-36-12l-4-8v24l4-8c12 4 28 0 36-12l8 6v-6l4-2-4-2v-6z" />
          </svg>
          <svg className="absolute top-[60%] right-[12%] w-12 h-12 text-white/8 animate-float" style={{ animationDelay: "1s" }} viewBox="0 0 64 64" fill="currentColor">
            <path d="M48 32c-8-12-24-16-36-12l-4-8v24l4-8c12 4 28 0 36-12l8 6v-6l4-2-4-2v-6z" />
          </svg>
          <svg className="absolute top-[35%] right-[25%] w-8 h-8 text-white/6 animate-float-slow" style={{ animationDelay: "2.5s" }} viewBox="0 0 64 64" fill="currentColor">
            <path d="M48 32c-8-12-24-16-36-12l-4-8v24l4-8c12 4 28 0 36-12l8 6v-6l4-2-4-2v-6z" />
          </svg>

          {/* Bubbles */}
          <div className="absolute bottom-[20%] left-[20%] w-3 h-3 rounded-full bg-white/15" style={{ animation: "bubble-rise 4s ease-in infinite" }} />
          <div className="absolute bottom-[10%] left-[50%] w-2 h-2 rounded-full bg-white/10" style={{ animation: "bubble-rise 5s ease-in infinite 1s" }} />
          <div className="absolute bottom-[15%] right-[30%] w-4 h-4 rounded-full bg-white/10" style={{ animation: "bubble-rise 6s ease-in infinite 2s" }} />

          {/* Large decorative circle (sun/moon) */}
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-gradient-to-br from-accent-light/20 to-accent/10 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-secondary/10 blur-3xl" />
        </div>

        {/* Wave bottom */}
        <svg className="absolute bottom-0 left-0 w-[200%] animate-wave-drift" viewBox="0 0 1440 120" preserveAspectRatio="none" style={{ height: "80px" }}>
          <path d="M0,40 C360,100 720,0 1080,60 C1260,90 1380,50 1440,40 L1440,120 L0,120 Z" fill="var(--background)" opacity="0.5" />
          <path d="M0,60 C240,10 480,90 720,50 C960,10 1200,80 1440,60 L1440,120 L0,120 Z" fill="var(--background)" opacity="0.7" />
          <path d="M0,80 C180,50 360,100 540,70 C720,40 900,90 1080,60 C1260,30 1380,80 1440,80 L1440,120 L0,120 Z" fill="var(--background)" />
        </svg>

        {/* Content */}
        <div className="relative z-10 text-center px-6 max-w-xl animate-scale-in">
          {/* Logo icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-white/15 backdrop-blur-sm mb-6 shadow-lg shadow-black/10 animate-float" style={{ animationDuration: "5s" }}>
            <svg width="48" height="48" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g transform="translate(18, 10)">
                <path d="M14 4 L14 24 Q14 34 8 34 Q2 34 2 28" stroke="white" strokeWidth="3.5" strokeLinecap="round" fill="none" />
                <path d="M2 28 L5 31" stroke="white" strokeWidth="3" strokeLinecap="round" fill="none" />
                <circle cx="14" cy="4" r="3" stroke="white" strokeWidth="2.5" fill="none" />
              </g>
              <g transform="translate(22, 34)">
                <path d="M0 8 Q4 4 10 4 Q16 4 20 8 Q16 12 10 12 Q4 12 0 8Z" fill="white" opacity="0.9" />
                <path d="M0 8 L-4 4 L-4 12 Z" fill="white" opacity="0.9" />
                <circle cx="15" cy="7.5" r="1.5" fill="#0077B6" />
              </g>
            </svg>
          </div>

          <h1 className="text-6xl sm:text-7xl font-bold text-white mb-3 drop-shadow-lg" style={{ fontFamily: "var(--font-fredoka)" }}>
            {t("common.appName")}
          </h1>
          <p className="text-xl sm:text-2xl text-white/80 mb-10 font-medium">
            {t("home.subtitle")}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <Link
              href="/catches/new"
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-accent text-white font-bold text-lg shadow-accent hover:shadow-lg hover:bg-accent/90 active:scale-[0.97] transition-all duration-200"
            >
              <svg className="w-5 h-5 transition-transform group-hover:rotate-12" viewBox="0 0 24 24" fill="currentColor">
                <path fillRule="evenodd" d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
              </svg>
              {t("home.cta")}
            </Link>
            <Link
              href="/pokedex"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-white/15 backdrop-blur-sm text-white font-bold text-lg border-2 border-white/30 hover:bg-white/25 hover:border-white/50 active:scale-[0.97] transition-all duration-200"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25a2.25 2.25 0 0 1-2.25-2.25v-2.25Z" />
              </svg>
              {t("nav.pokedex")}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
