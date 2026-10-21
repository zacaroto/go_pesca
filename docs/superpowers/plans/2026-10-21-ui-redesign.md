# UI Redesign — Outdoor Dark Design System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the gamified "Tropical Collector's Voyage" design system with a disciplined outdoor/rugged dark UI — true-black flat, single cobalt accent, Playfair Display + Inter typography.

**Architecture:** Swap design tokens globally in `globals.css` (one source of truth), update fonts in `layout.tsx`, then rewrite each component screen-by-screen. Each task produces a visually shippable increment. No new dependencies — fonts come from `next/font/google` (already in project).

**Tech Stack:** Next.js 16 App Router, TypeScript, Tailwind CSS v4 (`@theme inline`), next/font/google

**Design reference:** `.superpowers/brainstorm/66952-1792601606/content/screens-v2.html`
**Spec:** `docs/superpowers/specs/2026-10-21-ui-redesign-design.md`

## Global Constraints

- Single dark theme only — no `@media (prefers-color-scheme: dark)` split; always dark
- Only two fonts: `Inter` (UI) and `Playfair_Display` (content: species names, rank, greeting)
- Accent color `#2563EB` (cobalt) used ONLY on: data/numbers, active states, caught badge, FAB
- Never `transition: all` — always name the exact properties
- `font-variant-numeric: tabular-nums` on every number that updates or aligns
- `:active` state on every tappable element
- `min-width: 0` on text columns inside flex/grid

---

## File Map

| File | Action | Task |
|---|---|---|
| `apps/web/src/app/globals.css` | Replace entirely | 1 |
| `apps/web/src/app/layout.tsx` | Replace fonts, remove Material Symbols link | 1 |
| `apps/web/src/components/layout/header.tsx` | Rewrite | 2 |
| `apps/web/src/components/layout/bottom-nav.tsx` | Rewrite | 2 |
| `apps/web/src/components/feed/feed-card.tsx` | Rewrite | 3 |
| `apps/web/src/components/pokedex/pokedex-card.tsx` | Rewrite | 4 |
| `apps/web/src/components/pokedex/pokedex-grid.tsx` | Rewrite filter chip row | 4 |
| `apps/web/src/components/pokedex/progress-bar.tsx` | Rewrite | 4 |
| `apps/web/src/app/[locale]/page.tsx` | Rewrite JSX, keep data-fetching | 5 |
| `apps/web/src/components/catches/catch-card.tsx` | Rewrite as activity row | 5 |
| `apps/web/src/components/catches/catch-list.tsx` | Rewrite shell | 5 |

---

## Task 1: Design Foundation — globals.css + layout.tsx

**Files:**
- Modify: `apps/web/src/app/globals.css`
- Modify: `apps/web/src/app/layout.tsx`

**Interfaces:**
- Produces: CSS custom properties and Tailwind utility names used by all subsequent tasks. New utility names: `bg-ground`, `bg-surface`, `bg-raised`, `text-text`, `text-muted`, `text-faint`, `border-border`, `bg-accent`, `text-accent`, `text-accent-hi`. Legacy names preserved: `bg-page-bg`, `bg-card-bg`, `text-on-surface` (mapped to new values so un-redesigned screens don't break).

- [ ] **Step 1: Replace globals.css entirely**

```css
/* apps/web/src/app/globals.css */
@import "tailwindcss";

/* ========================================
   GO PESCA — Outdoor Dark Design System
   ======================================== */

:root {
  /* Elevation */
  --ground:    #09090b;
  --surface:   #141416;
  --raised:    #222225;

  /* Borders */
  --border:    #1e1e21;
  --rule:      #19191c;

  /* Text */
  --text:      #f4f4f5;
  --muted:     #a1a1aa;
  --faint:     #71717a;

  /* Accent — cobalt, the only hue */
  --accent:    #2563EB;
  --accent-hi: #3B82F6;

  /* Status */
  --positive:  #22c55e;
  --negative:  #ef4444;

  /* Habitat pills */
  --pill-salt-bg:   rgba(37,99,235,0.14);
  --pill-salt-ink:  #93bbfd;
  --pill-fresh-bg:  rgba(34,197,94,0.12);
  --pill-fresh-ink: #4ade80;
  --pill-brack-bg:  rgba(245,158,11,0.13);
  --pill-brack-ink: #fbbf24;

  /* Shape */
  --r-card:    16px;
  --r-pill:    999px;
  --gap:       12px;
  --pad:       18px;

  /* Animation — Emil Kowalski philosophy */
  --ease-out:    cubic-bezier(0.22, 1, 0.36, 1);
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
  --t-press:     120ms;
  --t-ui:        180ms;
  --t-enter:     280ms;

  /* Legacy aliases — keeps un-redesigned screens from breaking */
  --page-bg:          var(--ground);
  --background:       var(--ground);
  --card-bg:          var(--surface);
  --on-surface:       var(--text);
  --on-background:    var(--text);
  --primary:          var(--accent);
  --on-primary:       #ffffff;
  --outline:          var(--faint);
  --outline-variant:  var(--border);
  --muted-legacy:     var(--muted);
}

@theme inline {
  /* Elevation */
  --color-ground:   var(--ground);
  --color-surface:  var(--surface);
  --color-raised:   var(--raised);

  /* Borders */
  --color-border:   var(--border);
  --color-rule:     var(--rule);

  /* Text */
  --color-text:     var(--text);
  --color-muted:    var(--muted);
  --color-faint:    var(--faint);

  /* Accent */
  --color-accent:    var(--accent);
  --color-accent-hi: var(--accent-hi);

  /* Status */
  --color-positive:  var(--positive);
  --color-negative:  var(--negative);

  /* Legacy aliases — un-redesigned components use these */
  --color-page-bg:          var(--ground);
  --color-background:       var(--ground);
  --color-foreground:       var(--text);
  --color-card-bg:          var(--surface);
  --color-on-surface:       var(--text);
  --color-on-background:    var(--text);
  --color-primary:          var(--accent);
  --color-on-primary:       #ffffff;
  --color-secondary:        var(--accent-hi);
  --color-secondary-container: rgba(37,99,235,0.15);
  --color-on-secondary-container: var(--accent-hi);
  --color-outline:          var(--faint);
  --color-outline-variant:  var(--border);
  --color-surface-container:         var(--raised);
  --color-surface-container-high:    var(--raised);
  --color-surface-container-highest: var(--raised);
  --color-surface-container-low:     var(--surface);
  --color-surface-container-lowest:  var(--surface);
  --color-surface-dim:      var(--surface);
  --color-surface-bright:   var(--raised);
  --color-primary-fixed:    rgba(37,99,235,0.12);
  --color-on-primary-fixed: var(--accent-hi);
  --color-on-primary-fixed-variant: var(--accent-hi);
  --color-primary-fixed-dim: rgba(37,99,235,0.2);
  --color-primary-container: var(--accent);
  --color-on-primary-container: #ffffff;

  /* Fonts */
  --font-sans:    var(--font-inter), system-ui, sans-serif;
  --font-serif:   var(--font-playfair), Georgia, serif;
  /* Legacy font aliases */
  --font-heading:      var(--font-playfair), Georgia, serif;
  --font-display-lg:   var(--font-playfair), Georgia, serif;
  --font-headline-lg:  var(--font-playfair), Georgia, serif;
  --font-headline-md:  var(--font-playfair), Georgia, serif;
  --font-body-lg:      var(--font-inter), system-ui, sans-serif;
  --font-body-md:      var(--font-inter), system-ui, sans-serif;
  --font-label-sm:     var(--font-inter), system-ui, sans-serif;
  --font-label-lg:     var(--font-inter), system-ui, sans-serif;

  /* Radius */
  --radius-DEFAULT: var(--r-card);
  --radius-lg:      var(--r-card);
  --radius-xl:      var(--r-card);
  --radius-full:    var(--r-pill);
}

/* Base */
body {
  background-color: var(--ground);
  color: var(--text);
  font-family: var(--font-inter), system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
}

/* Material Symbols — keep class so old components don't crash (font no longer loaded) */
.material-symbols-outlined {
  font-family: 'Material Symbols Outlined', sans-serif;
  font-weight: normal;
  font-style: normal;
  font-size: 20px;
  line-height: 1;
  display: inline-block;
  white-space: nowrap;
  -webkit-font-smoothing: antialiased;
}

/* ── Animation Keyframes ── */

/* #1 — Card entrance (catch cards, feed cards) */
@keyframes card-in {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* #3 — Dex caught badge pop (spring) */
@keyframes badge-pop {
  from { opacity: 0; transform: scale(0); }
  to   { opacity: 1; transform: scale(1); }
}

/* ── Habitat pill helper classes ── */
.pill-salt  { background: var(--pill-salt-bg);  color: var(--pill-salt-ink); }
.pill-fresh { background: var(--pill-fresh-bg); color: var(--pill-fresh-ink); }
.pill-brack { background: var(--pill-brack-bg); color: var(--pill-brack-ink); }

/* ── Legacy helper stubs — stops crashes in un-redesigned pages ── */
.chunky-border  {}
.chunky-shadow  {}
.bouncy-shadow  {}
.bouncy-hover   {}
.bouncy-active  {}
.bouncy-hover:hover {}
.bouncy-active:active {}
.sticker-border {}
.sticker-glow   {}
.fab-3d         {}
.fab-3d:active  {}
.holo-overlay   { display: none; }
.liquid-tube    { background: var(--accent); }
.bubble         { display: none; }
.wave-bg        { display: none; }
.hero-gradient  { background: var(--surface); }
.bg-gradient-sunset { background: var(--accent); }
```

- [ ] **Step 2: Update layout.tsx — swap fonts, remove Material Symbols**

```tsx
// apps/web/src/app/layout.tsx
import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["700", "900"],
});

export const metadata: Metadata = {
  title: "Go Pesca",
  description: "Tu Pescadex de Pesca",
  icons: {
    icon: "/logo.svg",
    apple: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className={`${inter.variable} ${playfair.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-ground text-text">
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 3: Verify**

```bash
cd apps/web && npm run dev
```

Open http://localhost:3000. The page should render on a near-black background (`#09090b`). Text should be light (`#f4f4f5`). No color from old rainbow palette should appear. Un-redesigned pages may look bare/broken visually but must not crash.

- [ ] **Step 4: Commit**

```bash
git add apps/web/src/app/globals.css apps/web/src/app/layout.tsx
git commit -m "feat(web): replace token system with outdoor dark design foundation"
```

---

## Task 2: App Shell — header.tsx + bottom-nav.tsx

**Files:**
- Modify: `apps/web/src/components/layout/header.tsx`
- Modify: `apps/web/src/components/layout/bottom-nav.tsx`

**Interfaces:**
- Consumes: `--surface`, `--border`, `--text`, `--faint`, `--accent`, `--accent-hi`, `--font-playfair` from Task 1
- Produces: New wordmark "Go·Pesca" (Playfair 900, cobalt dot) + bottom nav with 2px top-border active indicator

- [ ] **Step 1: Rewrite header.tsx**

Keep all the existing imports and props — only replace the JSX.

```tsx
// apps/web/src/components/layout/header.tsx
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { UserMenu } from "./user-menu";
import { LanguageSwitcher } from "./language-switcher";
import { RankBadge } from "@/components/rank/rank-badge";
import { VersionBadge } from "@/components/version-badge";

type Props = {
  user: { id: string; email?: string; display_name?: string } | null;
  rankData?: { caught: number; total: number };
};

export function Header({ user, rankData }: Props) {
  const t = useTranslations();

  return (
    <header
      className="top-0 sticky z-40 w-full"
      style={{ background: "var(--surface)", borderBottom: "1px solid var(--border)" }}
    >
      <div className="max-w-6xl mx-auto px-4 h-[52px] flex items-center justify-between">
        {/* Wordmark */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-1" style={{ textDecoration: "none" }}>
            <span
              style={{
                fontFamily: "var(--font-playfair), Georgia, serif",
                fontWeight: 900,
                fontSize: "17px",
                color: "var(--text)",
                letterSpacing: "-0.01em",
              }}
            >
              Go
            </span>
            <span
              style={{
                display: "inline-block",
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: "var(--accent)",
                margin: "0 3px",
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontFamily: "var(--font-playfair), Georgia, serif",
                fontWeight: 900,
                fontSize: "17px",
                color: "var(--text)",
                letterSpacing: "-0.01em",
              }}
            >
              Pesca
            </span>
            <VersionBadge />
          </Link>

          {user && (
            <nav className="hidden sm:flex items-center gap-1 text-sm">
              {[
                { href: "/pokedex",    label: t("nav.pokedex") },
                { href: "/catches",   label: t("nav.catches") },
                { href: "/community", label: t("nav.community") },
              ].map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="px-3 py-1.5 rounded text-sm transition-colors"
                  style={{
                    color: "var(--muted)",
                    fontWeight: 500,
                    transition: "color var(--t-ui)",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "var(--muted)")}
                >
                  {label}
                </Link>
              ))}
            </nav>
          )}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          {user ? (
            <>
              {rankData && (
                <RankBadge caught={rankData.caught} total={rankData.total} size="sm" />
              )}
              <UserMenu displayName={user.display_name ?? user.email ?? ""} userId={user.id} />
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/auth/login"
                className="text-sm font-medium transition-colors"
                style={{ color: "var(--muted)" }}
              >
                {t("common.login")}
              </Link>
              <Link
                href="/auth/register"
                className="text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
                style={{
                  background: "var(--accent)",
                  color: "#ffffff",
                  borderRadius: "8px",
                }}
              >
                {t("common.register")}
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
```

- [ ] **Step 2: Rewrite bottom-nav.tsx**

4 tabs: Inicio (`/`), Feed (`/community`), FishyDex (`/pokedex`), Perfil (`/profile`).
Active indicator: 2px top border in cobalt + label/icon color shift. No scale/translate bounce.

```tsx
// apps/web/src/components/layout/bottom-nav.tsx
"use client";

import { Link, usePathname } from "@/i18n/navigation";

const TABS = [
  {
    href: "/",
    label: "Inicio",
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.5 : 2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" />
        <path d="M9 21V12h6v9" />
      </svg>
    ),
  },
  {
    href: "/community",
    label: "Feed",
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.5 : 2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    href: "/pokedex",
    label: "FishyDex",
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.5 : 2} strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    href: "/profile",
    label: "Perfil",
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.5 : 2} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
      </svg>
    ),
  },
];

export function BottomNav() {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
  }

  return (
    <nav
      className="fixed bottom-0 left-0 w-full flex justify-around items-stretch z-50 sm:hidden"
      style={{
        background: "var(--surface)",
        borderTop: "1px solid var(--border)",
        height: "64px",
      }}
    >
      {TABS.map((tab) => {
        const active = isActive(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className="flex flex-col items-center justify-center flex-1 gap-1 transition-colors"
            style={{
              color: active ? "var(--accent-hi)" : "var(--faint)",
              borderTop: active ? "2px solid var(--accent)" : "2px solid transparent",
              transition: `color var(--t-ui), border-color var(--t-ui)`,
              paddingTop: "2px",
            }}
          >
            {tab.icon(active)}
            <span
              style={{
                fontSize: "10px",
                fontWeight: 600,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                lineHeight: 1,
              }}
            >
              {tab.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
```

- [ ] **Step 3: Verify**

```bash
cd apps/web && npm run dev
```

Open http://localhost:3000 on a mobile viewport (DevTools → 390px wide). Check:
- Header: "Go · Pesca" wordmark in Playfair Display 900, with a 6px cobalt dot separator
- Bottom nav: 4 tabs (Inicio, Feed, FishyDex, Perfil), active tab has a 2px cobalt top border and cobalt-tinted text

- [ ] **Step 4: Commit**

```bash
git add apps/web/src/components/layout/header.tsx apps/web/src/components/layout/bottom-nav.tsx
git commit -m "feat(web): redesign app shell with new wordmark and cobalt tab indicator"
```

---

## Task 3: Community Feed — feed-card.tsx

**Files:**
- Modify: `apps/web/src/components/feed/feed-card.tsx`

**Interfaces:**
- Consumes: `FeedCatch`, `FeedReactions` types (unchanged), `ReactionBar` component (unchanged)
- Consumes: Habitat pill CSS classes `pill-salt`, `pill-fresh`, `pill-brack` from Task 1
- Produces: New card layout — full-width 200px photo with overlaid species name + weight, card-in entrance animation, reaction bar with press states

**Habitat pill helper** — add this inline function in the file:

```ts
function habitatPill(habitat: string | null | undefined) {
  if (habitat === "saltwater") return { cls: "pill-salt",  label: "Salada" };
  if (habitat === "freshwater") return { cls: "pill-fresh", label: "Dulce" };
  return { cls: "pill-brack", label: "Salobre" };
}
```

- [ ] **Step 1: Rewrite feed-card.tsx**

```tsx
// apps/web/src/components/feed/feed-card.tsx
"use client";

import { Link } from "@/i18n/navigation";
import { ReactionBar } from "./reaction-bar";
import type { FeedCatch, FeedReactions } from "@/lib/feed";

type Props = {
  catch_entry: FeedCatch;
  reactions: FeedReactions;
  index?: number;
};

function habitatPill(habitat: string | null | undefined) {
  if (habitat === "saltwater")  return { cls: "pill-salt",  label: "Salada" };
  if (habitat === "freshwater") return { cls: "pill-fresh", label: "Dulce" };
  return { cls: "pill-brack", label: "Salobre" };
}

function relativeTime(dateStr: string) {
  const date = new Date(dateStr + "T00:00:00");
  const diffDays = Math.floor((Date.now() - date.getTime()) / 86_400_000);
  if (diffDays === 0) return "hoy";
  if (diffDays === 1) return "ayer";
  if (diffDays < 7)  return `hace ${diffDays} días`;
  return date.toLocaleDateString("es", { day: "numeric", month: "short" });
}

export function FeedCard({ catch_entry, reactions, index = 0 }: Props) {
  const pill = habitatPill((catch_entry as any).habitat);
  const delay = `${index * 60}ms`;

  return (
    <article
      style={{
        background: "var(--surface)",
        borderRadius: "var(--r-card)",
        overflow: "hidden",
        marginBottom: "var(--gap)",
        opacity: 0,
        animation: `card-in var(--t-enter) var(--ease-out) ${delay} forwards`,
      }}
    >
      {/* Photo with overlaid content */}
      <div className="relative w-full" style={{ height: "200px", background: "var(--raised)" }}>
        <img
          src={catch_entry.photo_url}
          alt={catch_entry.species_name}
          className="w-full h-full object-cover"
          loading="lazy"
        />

        {/* Gradient overlay — bottom 85% opacity → 0 at top */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.45) 40%, transparent 100%)",
          }}
        />

        {/* Species name + weight + pill */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3
            style={{
              fontFamily: "var(--font-playfair), Georgia, serif",
              fontWeight: 900,
              fontSize: "22px",
              color: "#ffffff",
              margin: 0,
              textShadow: "0 1px 4px rgba(0,0,0,0.5)",
              letterSpacing: "-0.01em",
              lineHeight: 1.1,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {catch_entry.species_name}
          </h3>

          <div className="flex items-center gap-2 mt-1.5" style={{ minWidth: 0 }}>
            {catch_entry.weight_kg && (
              <span
                style={{
                  fontFamily: "var(--font-inter), system-ui, sans-serif",
                  fontWeight: 700,
                  fontSize: "28px",
                  color: "#ffffff",
                  fontVariantNumeric: "tabular-nums",
                  letterSpacing: "-0.02em",
                  lineHeight: 1,
                  flexShrink: 0,
                }}
              >
                {catch_entry.weight_kg} kg
              </span>
            )}
            <span
              className={pill.cls}
              style={{
                fontSize: "10px",
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                padding: "3px 8px",
                borderRadius: "var(--r-pill)",
                flexShrink: 0,
                whiteSpace: "nowrap",
              }}
            >
              {pill.label}
            </span>
          </div>
        </div>
      </div>

      {/* Meta row — location + time */}
      <div
        className="flex items-center gap-2 px-4 pt-3"
        style={{ color: "var(--faint)", fontSize: "11px", fontWeight: 500 }}
      >
        {catch_entry.location_name && (
          <>
            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", minWidth: 0 }}>
              {catch_entry.location_name}
            </span>
            <span style={{ flexShrink: 0 }}>·</span>
          </>
        )}
        <span style={{ flexShrink: 0 }}>{relativeTime(catch_entry.catch_date)}</span>
      </div>

      {/* User + Reactions footer */}
      <div className="flex items-center justify-between px-4 py-3" style={{ minWidth: 0 }}>
        <Link
          href={`/profile/${catch_entry.user_id}` as "/profile/[userId]"}
          className="flex items-center gap-2"
          style={{ textDecoration: "none", minWidth: 0 }}
        >
          <div
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "50%",
              background: "var(--raised)",
              overflow: "hidden",
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {catch_entry.avatar_url ? (
              <img src={catch_entry.avatar_url} alt="" className="w-full h-full object-cover" />
            ) : (
              <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--accent-hi)" }}>
                {catch_entry.display_name?.charAt(0)?.toUpperCase() ?? "?"}
              </span>
            )}
          </div>
          <span
            style={{
              fontSize: "13px",
              fontWeight: 500,
              color: "var(--muted)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              minWidth: 0,
            }}
          >
            {catch_entry.display_name}
          </span>
        </Link>

        <ReactionBar
          catchId={catch_entry.id}
          counts={reactions.counts}
          userReaction={reactions.userReaction}
        />
      </div>
    </article>
  );
}
```

- [ ] **Step 2: Verify**

```bash
cd apps/web && npm run dev
```

Navigate to `/community`. Check:
- Cards appear with a staggered fade+slide-up entrance (60ms delay per card)
- Fish weight (e.g. "3.2 kg") is the biggest text element on the card — larger than the species name
- Species name is in Playfair Display 900
- Habitat pill (Salada / Dulce / Salobre) appears inline with the weight
- No rainbow colors, no chunky borders, no glassmorphism

- [ ] **Step 3: Commit**

```bash
git add apps/web/src/components/feed/feed-card.tsx
git commit -m "feat(web): redesign feed card with weight-as-hero layout and card-in animation"
```

---

## Task 4: FishyDex — pokedex-card.tsx + pokedex-grid.tsx + progress-bar.tsx

**Files:**
- Modify: `apps/web/src/components/pokedex/pokedex-card.tsx`
- Modify: `apps/web/src/components/pokedex/pokedex-grid.tsx`
- Modify: `apps/web/src/components/pokedex/progress-bar.tsx`

**Interfaces:**
- Consumes: `PokedexEntry` type (unchanged), `locale: string` prop (unchanged)
- Consumes: `getRank()` from `@/lib/rank` (unchanged), `useTranslations` (unchanged)
- Produces: Caught cards with cobalt border + badge-pop animation; uncaught = desaturated silhouette; new filter chips; KPI strip + rank card with animated progress bar

- [ ] **Step 1: Rewrite pokedex-card.tsx**

The `badge-pop` animation fires on mount. Since FishyDex cards only appear in caught state after the catch occurs, "on mount" is effectively "on first show". More sophisticated first-unlock tracking (localStorage) is out of scope.

```tsx
// apps/web/src/components/pokedex/pokedex-card.tsx
import Link from "next/link";
import type { PokedexEntry } from "@/lib/pokedex";

type Props = {
  entry: PokedexEntry;
  locale: string;
};

function HabitatPill({ habitat }: { habitat: string | null | undefined }) {
  const map: Record<string, { cls: string; label: string }> = {
    saltwater:  { cls: "pill-salt",  label: "Salada" },
    freshwater: { cls: "pill-fresh", label: "Dulce" },
    brackish:   { cls: "pill-brack", label: "Salobre" },
  };
  const p = map[habitat ?? ""] ?? { cls: "pill-brack", label: "Salobre" };
  return (
    <span
      className={p.cls}
      style={{
        fontSize: "9px",
        fontWeight: 600,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        padding: "2px 7px",
        borderRadius: "999px",
        whiteSpace: "nowrap",
        flexShrink: 0,
      }}
    >
      {p.label}
    </span>
  );
}

export function PokedexCard({ entry, locale }: Props) {
  const name = locale === "es" ? entry.name_es : entry.name_en;
  const caught = entry.catch_count > 0;

  if (!caught) {
    return (
      <div
        style={{
          background: "var(--surface)",
          borderRadius: "var(--r-card)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          padding: "8px",
        }}
      >
        {/* Desaturated photo */}
        <div
          style={{
            aspectRatio: "4/5",
            borderRadius: "10px",
            overflow: "hidden",
            background: "var(--raised)",
            position: "relative",
          }}
        >
          {entry.reference_photo_url ? (
            <img
              src={entry.reference_photo_url}
              alt="Sin capturar"
              className="w-full h-full object-cover"
              style={{ filter: "saturate(0) brightness(0.4)" }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--faint)" strokeWidth="1.5">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </div>
          )}
        </div>

        {/* Name row */}
        <div style={{ padding: "0 4px 4px" }}>
          <p
            style={{
              fontFamily: "var(--font-playfair), Georgia, serif",
              fontWeight: 700,
              fontSize: "13px",
              color: "var(--faint)",
              fontStyle: "italic",
              margin: 0,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            Sin capturar
          </p>
        </div>
      </div>
    );
  }

  return (
    <Link
      href={`/pokedex/${entry.id}`}
      style={{
        background: "var(--surface)",
        border: "1px solid rgba(37,99,235,0.3)",
        borderRadius: "var(--r-card)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        padding: "8px",
        cursor: "pointer",
        textDecoration: "none",
        transition: `transform var(--t-press) var(--ease-out)`,
      }}
      onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.97)")}
      onMouseUp={(e)   => (e.currentTarget.style.transform = "scale(1)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      {/* Photo */}
      <div
        style={{
          aspectRatio: "4/5",
          borderRadius: "10px",
          overflow: "hidden",
          background: "var(--raised)",
          position: "relative",
        }}
      >
        <img
          src={entry.first_catch_photo || entry.reference_photo_url || ""}
          alt={name}
          className="w-full h-full object-cover"
        />

        {/* Cobalt caught badge — badge-pop spring animation */}
        <div
          style={{
            position: "absolute",
            top: "8px",
            right: "8px",
            width: "22px",
            height: "22px",
            background: "var(--accent)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            animation: "badge-pop 400ms var(--ease-spring) forwards",
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        {/* Habitat pill bottom-left */}
        <div style={{ position: "absolute", bottom: "8px", left: "8px" }}>
          <HabitatPill habitat={entry.habitat} />
        </div>
      </div>

      {/* Name + catch count */}
      <div style={{ padding: "0 4px 4px", minWidth: 0 }}>
        <p
          style={{
            fontFamily: "var(--font-playfair), Georgia, serif",
            fontWeight: 700,
            fontSize: "13px",
            color: "var(--text)",
            margin: 0,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {name}
        </p>
        <p
          style={{
            fontSize: "10px",
            fontWeight: 500,
            color: "var(--faint)",
            margin: "2px 0 0",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {entry.catch_count}× capturado
        </p>
      </div>
    </Link>
  );
}
```

- [ ] **Step 2: Rewrite pokedex-grid.tsx — replace filter chips, keep filter logic**

Read the current file to identify the filter state and handlers before editing. The new chip row uses `rgba(37,99,235,0.15)` fill on active, `transparent` background on inactive, no borders.

```tsx
// apps/web/src/components/pokedex/pokedex-grid.tsx
// NOTE: Keep all existing state/filter/props logic unchanged.
// Only replace the JSX render output.
//
// Existing props signature to preserve:
//   entries: PokedexEntry[]
//   locale: string
//   (and whatever filter state exists — keep it)
//
// Replace the ENTIRE file with the code below, adapting the
// existing filter state variable names if they differ.
```

When rewriting `pokedex-grid.tsx`, read the current file first with the Read tool to capture exact prop names and state variables. Then produce the new file with:

1. All existing `useState`, `useMemo` filter logic preserved verbatim
2. Only the JSX return replaced as follows:

```tsx
// Filter chip row — replaces the old search+pills block:
<div
  className="flex items-center gap-2 overflow-x-auto pb-1 mb-4"
  style={{ scrollbarWidth: "none" }}
>
  {[
    { value: "all",     label: "Todas" },
    { value: "caught",  label: "Capturadas" },
    { value: "uncaught", label: "Sin capturar" },
    { value: "saltwater",  label: "Salada" },
    { value: "freshwater", label: "Dulce" },
    { value: "brackish",   label: "Salobre" },
  ].map((chip) => {
    const active = filter === chip.value; // use existing state var name
    return (
      <button
        key={chip.value}
        onClick={() => setFilter(chip.value)} // use existing setter name
        style={{
          background: active ? "rgba(37,99,235,0.15)" : "transparent",
          color: active ? "var(--accent-hi)" : "var(--muted)",
          border: "none",
          borderRadius: "var(--r-pill)",
          padding: "6px 14px",
          fontSize: "12px",
          fontWeight: 600,
          letterSpacing: "0.04em",
          cursor: "pointer",
          whiteSpace: "nowrap",
          flexShrink: 0,
          transition: `color var(--t-ui), background var(--t-ui)`,
        }}
      >
        {chip.label}
      </button>
    );
  })}
</div>

// Species grid — replaces old grid:
<div className="grid grid-cols-2 gap-3">
  {filteredEntries.map((entry) => (
    <PokedexCard key={entry.id} entry={entry} locale={locale} />
  ))}
</div>
```

**Important:** The actual filter chip values and state variable names must match what the existing component uses. Read the file before making this edit.

- [ ] **Step 3: Rewrite progress-bar.tsx — KPI strip + rank card + animated progress bar**

```tsx
// apps/web/src/components/pokedex/progress-bar.tsx
"use client";

import { useEffect, useRef } from "react";
import { getRank } from "@/lib/rank";

type Props = {
  caught: number;
  total: number;
};

const NEXT_RANK_THRESHOLDS = [7, 13, 20, 27, 33, 40, 47, 53, 60, 67, 73, 80, 87, 93, 100];

export function ProgressBar({ caught, total }: Props) {
  const pct = total > 0 ? Math.round((caught / total) * 100) : 0;
  const { key: rankKey } = getRank(caught, total);
  const barRef = useRef<HTMLDivElement>(null);

  const nextThreshold = NEXT_RANK_THRESHOLDS.find((th) => th > pct);
  const speciesNeeded = nextThreshold
    ? Math.ceil((nextThreshold / 100) * total) - caught
    : 0;

  // #2 animation — progress bar fills from 0 to actual on mount (400ms ease-out)
  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;
    bar.style.width = "0%";
    const raf = requestAnimationFrame(() => {
      bar.style.transition = "width 400ms var(--ease-out)";
      bar.style.width = `${Math.max(pct, 2)}%`;
    });
    return () => cancelAnimationFrame(raf);
  }, [pct]);

  return (
    <section style={{ marginBottom: "24px" }}>
      {/* KPI strip — 3 cells */}
      <div
        className="grid grid-cols-3"
        style={{
          background: "var(--surface)",
          borderRadius: "var(--r-card)",
          border: "1px solid var(--border)",
          overflow: "hidden",
          marginBottom: "12px",
        }}
      >
        {[
          { label: "Capturadas", value: caught, accent: true },
          { label: "Total",       value: total,  accent: false },
          { label: "Completado",  value: `${pct}%`, accent: false },
        ].map((cell, i) => (
          <div
            key={cell.label}
            style={{
              padding: "16px 12px",
              textAlign: "center",
              borderLeft: i > 0 ? "1px solid var(--border)" : "none",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-inter), system-ui, sans-serif",
                fontWeight: 700,
                fontSize: "26px",
                color: cell.accent ? "var(--accent-hi)" : "var(--text)",
                fontVariantNumeric: "tabular-nums",
                letterSpacing: "-0.02em",
                lineHeight: 1,
              }}
            >
              {cell.value}
            </div>
            <div
              style={{
                fontSize: "10px",
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--faint)",
                marginTop: "4px",
              }}
            >
              {cell.label}
            </div>
          </div>
        ))}
      </div>

      {/* Rank card */}
      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "var(--r-card)",
          padding: "var(--pad)",
        }}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {/* Star emblem */}
            <div
              style={{
                width: "32px",
                height: "32px",
                border: "1.5px solid var(--accent)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </div>
            <span
              style={{
                fontFamily: "var(--font-playfair), Georgia, serif",
                fontWeight: 700,
                fontSize: "16px",
                color: "var(--text)",
              }}
            >
              {rankKey}
            </span>
          </div>
          {nextThreshold && speciesNeeded > 0 && (
            <span
              style={{
                fontSize: "11px",
                fontWeight: 500,
                color: "var(--faint)",
              }}
            >
              +{speciesNeeded} para el siguiente
            </span>
          )}
        </div>

        {/* Progress bar — animated from 0 on mount */}
        <div
          style={{
            background: "var(--raised)",
            borderRadius: "var(--r-pill)",
            height: "6px",
            overflow: "hidden",
          }}
        >
          <div
            ref={barRef}
            style={{
              height: "100%",
              background: "var(--accent)",
              borderRadius: "var(--r-pill)",
              width: "0%",
            }}
          />
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Verify**

```bash
cd apps/web && npm run dev
```

Navigate to `/pokedex`. Check:
- KPI strip shows 3 cells; "Capturadas" count is in cobalt-hi, others in white
- Rank card has star emblem (cobalt outline), rank name in Playfair Display 700
- Progress bar animates from 0 to actual % on page load (400ms)
- Caught species: cobalt-bordered card, check badge pops in with spring animation
- Uncaught species: desaturated photo, "Sin capturar" in italic faint
- Filter chips: no borders, active chip has `rgba(37,99,235,0.15)` background + cobalt-hi label

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/components/pokedex/pokedex-card.tsx apps/web/src/components/pokedex/pokedex-grid.tsx apps/web/src/components/pokedex/progress-bar.tsx
git commit -m "feat(web): redesign FishyDex with KPI strip, rank card, cobalt caught states"
```

---

## Task 5: Home & Catches — page.tsx + catch-card.tsx + catch-list.tsx

**Files:**
- Modify: `apps/web/src/app/[locale]/page.tsx`
- Modify: `apps/web/src/components/catches/catch-card.tsx`
- Modify: `apps/web/src/components/catches/catch-list.tsx`

**Interfaces:**
- Consumes: `CatchEntry` type: `{ id, photo_url, catch_date, location_name, species_name, weight_kg?, length_cm? }` (unchanged)
- Consumes: All data-fetching logic in `page.tsx` (preserve verbatim — only replace JSX)
- Produces: Dashboard greeting ("Hola, [*Kevin.*]"), activity-row catch-card, cleaned list shell, cobalt FAB with spring press

- [ ] **Step 1: Rewrite catch-card.tsx — from sticker card to activity row**

```tsx
// apps/web/src/components/catches/catch-card.tsx
import Link from "next/link";

type CatchEntry = {
  id: string;
  photo_url: string;
  catch_date: string;
  location_name: string | null;
  species_name: string;
  weight_kg?: number | null;
  length_cm?: number | null;
  habitat?: string | null;
};

type Props = {
  catch_entry: CatchEntry;
  index?: number;
};

function habitatPillCls(habitat: string | null | undefined) {
  if (habitat === "saltwater")  return "pill-salt";
  if (habitat === "freshwater") return "pill-fresh";
  return "pill-brack";
}

function habitatLabel(habitat: string | null | undefined) {
  if (habitat === "saltwater")  return "Salada";
  if (habitat === "freshwater") return "Dulce";
  return "Salobre";
}

function relativeTime(dateStr: string) {
  const date = new Date(dateStr + "T00:00:00");
  const diffDays = Math.floor((Date.now() - date.getTime()) / 86_400_000);
  if (diffDays === 0) return "hoy";
  if (diffDays === 1) return "ayer";
  if (diffDays < 7)  return `hace ${diffDays}d`;
  return date.toLocaleDateString("es", { day: "numeric", month: "short" });
}

export function CatchCard({ catch_entry, index = 0 }: Props) {
  return (
    <Link
      href={`/catches/${catch_entry.id}`}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "11px 0",
        borderBottom: "1px solid var(--rule)",
        textDecoration: "none",
        minWidth: 0,
        transition: `background var(--t-press)`,
      }}
      onMouseDown={(e) => (e.currentTarget.style.background = "var(--raised)")}
      onMouseUp={(e) => (e.currentTarget.style.background = "transparent")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
    >
      {/* 42px habitat-gradient thumb */}
      <div
        style={{
          width: "42px",
          height: "42px",
          borderRadius: "8px",
          overflow: "hidden",
          flexShrink: 0,
          background: "var(--raised)",
        }}
      >
        <img
          src={catch_entry.photo_url}
          alt={catch_entry.species_name}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>

      {/* Text column */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontFamily: "var(--font-playfair), Georgia, serif",
            fontWeight: 700,
            fontSize: "13px",
            color: "var(--text)",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {catch_entry.species_name}
        </div>
        <div
          className="flex items-center gap-1.5 mt-0.5"
          style={{ minWidth: 0 }}
        >
          {catch_entry.location_name && (
            <span
              style={{
                fontSize: "11px",
                color: "var(--faint)",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                minWidth: 0,
              }}
            >
              {catch_entry.location_name}
            </span>
          )}
          <span
            className={habitatPillCls(catch_entry.habitat)}
            style={{
              fontSize: "9px",
              fontWeight: 600,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              padding: "2px 6px",
              borderRadius: "999px",
              flexShrink: 0,
              whiteSpace: "nowrap",
            }}
          >
            {habitatLabel(catch_entry.habitat)}
          </span>
        </div>
      </div>

      {/* Weight + relative time */}
      <div style={{ flexShrink: 0, textAlign: "right" }}>
        {catch_entry.weight_kg && (
          <div
            style={{
              fontSize: "14px",
              fontWeight: 700,
              color: "var(--text)",
              fontVariantNumeric: "tabular-nums",
              letterSpacing: "-0.01em",
            }}
          >
            {catch_entry.weight_kg} kg
          </div>
        )}
        <div
          style={{
            fontSize: "11px",
            color: "var(--faint)",
            marginTop: "2px",
          }}
        >
          {relativeTime(catch_entry.catch_date)}
        </div>
      </div>
    </Link>
  );
}
```

- [ ] **Step 2: Rewrite catch-list.tsx — clean shell, preserve filter logic**

Keep all existing `useState`, filter variables, and the `CatchFilters` component call. Replace only the outer container styling and FAB.

```tsx
// apps/web/src/components/catches/catch-list.tsx
// Preserve all existing: "use client", useState, useTranslations,
// Link, CatchCard, CatchFilters imports and filter logic (lines 1–50 approx).
// Replace only the JSX return:

return (
  <div style={{ maxWidth: "640px", margin: "0 auto", paddingBottom: "80px" }}>
    {/* Page header */}
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1
          style={{
            fontFamily: "var(--font-playfair), Georgia, serif",
            fontWeight: 900,
            fontSize: "22px",
            color: "var(--text)",
            margin: 0,
            letterSpacing: "-0.01em",
          }}
        >
          {t("title")}
        </h1>
        <p style={{ fontSize: "13px", color: "var(--faint)", margin: "4px 0 0" }}>
          {filtered.length} capturas registradas
        </p>
      </div>
    </div>

    {/* Search input */}
    <div style={{ position: "relative", marginBottom: "16px" }}>
      <svg
        width="16" height="16" viewBox="0 0 24 24" fill="none"
        stroke="var(--faint)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)" }}
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
      </svg>
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder={`${tCommon("search")}...`}
        style={{
          width: "100%",
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "var(--r-card)",
          color: "var(--text)",
          fontSize: "14px",
          padding: "10px 14px 10px 40px",
          outline: "none",
          boxSizing: "border-box",
          transition: `border-color var(--t-ui)`,
        }}
        onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
        onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
      />
    </div>

    {/* Existing CatchFilters — keep as-is */}
    <CatchFilters
      species={species}
      selectedSpecies={selectedSpecies}
      onSpeciesChange={setSelectedSpecies}
      dateFrom={dateFrom}
      dateTo={dateTo}
      onDateFromChange={setDateFrom}
      onDateToChange={setDateTo}
    />

    {/* Results */}
    {filtered.length === 0 ? (
      <div
        style={{
          textAlign: "center",
          padding: "48px 24px",
          background: "var(--surface)",
          borderRadius: "var(--r-card)",
          border: "1px solid var(--border)",
          marginTop: "16px",
        }}
      >
        <p style={{ color: "var(--muted)", fontSize: "14px", margin: 0 }}>
          No hay capturas que coincidan con tu búsqueda.
        </p>
      </div>
    ) : (
      <div
        style={{
          background: "var(--surface)",
          borderRadius: "var(--r-card)",
          border: "1px solid var(--border)",
          padding: "0 16px",
          marginTop: "16px",
        }}
      >
        {filtered.map((c, index) => (
          <CatchCard key={c.id} catch_entry={c} index={index} />
        ))}
      </div>
    )}

    {/* Cobalt FAB — spring press feedback, shadow breathes */}
    <Link
      href="/catches/new"
      aria-label={t("newCatch")}
      style={{
        position: "fixed",
        bottom: "80px",
        right: "18px",
        zIndex: 40,
        width: "50px",
        height: "50px",
        borderRadius: "50%",
        background: "var(--accent)",
        color: "#ffffff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 4px 16px rgba(37,99,235,0.4)",
        textDecoration: "none",
        transition: `transform var(--t-press) var(--ease-spring), box-shadow var(--t-press)`,
      }}
      onMouseDown={(e) => {
        e.currentTarget.style.transform = "scale(0.92)";
        e.currentTarget.style.boxShadow = "0 2px 8px rgba(37,99,235,0.3)";
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.boxShadow = "0 4px 16px rgba(37,99,235,0.4)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.boxShadow = "0 4px 16px rgba(37,99,235,0.4)";
      }}
      className="sm:hidden"
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <path d="M12 5v14M5 12h14" />
      </svg>
    </Link>
  </div>
);
```

- [ ] **Step 3: Read page.tsx before editing**

```bash
# Read the full file first — do NOT skip this step
```

Use the Read tool on `apps/web/src/app/[locale]/page.tsx` to understand the full server component structure. Identify:
- The data-fetching calls (Supabase queries, auth checks, etc.)
- The `user` object fields available
- The recent catches data shape

- [ ] **Step 4: Rewrite page.tsx JSX — preserve all data-fetching logic**

Keep all `import`, `async function`, Supabase query, and `redirect()` calls. Replace only the JSX return for the logged-in state with the dashboard layout below. The logged-out/auth redirect logic stays unchanged.

The dashboard JSX for logged-in users:

```tsx
// Replace the logged-in user JSX return with:
return (
  <main style={{ maxWidth: "640px", margin: "0 auto", padding: "24px 18px 96px" }}>

    {/* Greeting */}
    <div style={{ marginBottom: "28px" }}>
      <p
        style={{
          fontSize: "11px",
          fontWeight: 600,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "var(--faint)",
          margin: "0 0 6px",
        }}
      >
        {/* Replace with actual season/location if available, otherwise static */}
        Temporada · Costa Rica
      </p>
      <h1
        style={{
          fontFamily: "var(--font-playfair), Georgia, serif",
          fontWeight: 900,
          fontSize: "28px",
          color: "var(--text)",
          margin: 0,
          letterSpacing: "-0.02em",
          lineHeight: 1.1,
        }}
      >
        Hola,{" "}
        <em style={{ color: "var(--accent-hi)", fontStyle: "italic" }}>
          {user.display_name?.split(" ")[0] ?? "Pescador"}.
        </em>
      </h1>
    </div>

    {/* KPI strip — replace values with actual data from your queries */}
    <div
      className="grid grid-cols-3"
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--r-card)",
        overflow: "hidden",
        marginBottom: "24px",
      }}
    >
      {[
        { label: "Capturas",   value: totalCatches ?? 0 },
        { label: "Especies",   value: uniqueSpecies ?? 0 },
        { label: "Esta semana", value: thisWeek ?? 0 },
      ].map((kpi, i) => (
        <div
          key={kpi.label}
          style={{
            padding: "16px 12px",
            textAlign: "center",
            borderLeft: i > 0 ? "1px solid var(--border)" : "none",
          }}
        >
          <div
            style={{
              fontWeight: 700,
              fontSize: "26px",
              color: "var(--text)",
              fontVariantNumeric: "tabular-nums",
              letterSpacing: "-0.02em",
              lineHeight: 1,
            }}
          >
            {kpi.value}
          </div>
          <div
            style={{
              fontSize: "10px",
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--faint)",
              marginTop: "4px",
            }}
          >
            {kpi.label}
          </div>
        </div>
      ))}
    </div>

    {/* Recent catches section */}
    <div style={{ marginBottom: "24px" }}>
      <div className="flex items-center justify-between mb-3">
        <span
          style={{
            fontSize: "10px",
            fontWeight: 600,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "var(--faint)",
          }}
        >
          Últimas capturas
        </span>
        <Link
          href="/catches"
          style={{
            fontSize: "12px",
            fontWeight: 500,
            color: "var(--accent-hi)",
            textDecoration: "none",
          }}
        >
          Ver todas →
        </Link>
      </div>

      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "var(--r-card)",
          padding: "0 16px",
        }}
      >
        {recentCatches.length === 0 ? (
          <p style={{ color: "var(--faint)", fontSize: "13px", padding: "16px 0", margin: 0 }}>
            Aún no tienes capturas. ¡Registra tu primera!
          </p>
        ) : (
          recentCatches.map((c: any, i: number) => (
            <CatchCard key={c.id} catch_entry={c} index={i} />
          ))
        )}
      </div>
    </div>

    {/* Rank card */}
    {rankData && <ProgressBar caught={rankData.caught} total={rankData.total} />}

    {/* Cobalt FAB */}
    <Link
      href="/catches/new"
      aria-label="Nueva captura"
      style={{
        position: "fixed",
        bottom: "80px",
        right: "18px",
        zIndex: 40,
        width: "50px",
        height: "50px",
        borderRadius: "50%",
        background: "var(--accent)",
        color: "#ffffff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 4px 16px rgba(37,99,235,0.4)",
        textDecoration: "none",
      }}
      className="sm:hidden"
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <path d="M12 5v14M5 12h14" />
      </svg>
    </Link>
  </main>
);
```

**Note on KPI variables:** The variable names `totalCatches`, `uniqueSpecies`, `thisWeek`, `recentCatches`, `rankData` may not exist in the current page.tsx. After reading the file, map these to the actual variable names returned by the existing Supabase queries. If a specific metric isn't fetched yet, use `0` as fallback — don't add new queries.

- [ ] **Step 5: Verify**

```bash
cd apps/web && npm run dev
```

Navigate to `/` (logged in). Check:
- Greeting: "Hola, *Kevin.*" — "Kevin" in cobalt italic, Playfair 900 28px
- KPI strip: 3 cells with tabular numbers
- Recent catches: activity rows (thumb | species name | weight + relative time)
- FAB: cobalt circle, spring press animation (scale 0.92 on press)

Navigate to `/catches`. Check:
- Search input with no chunky border — clean, 1px border-border
- Catches render as compact activity rows (not sticker cards)
- FAB present above bottom nav

- [ ] **Step 6: Commit**

```bash
git add apps/web/src/app/[locale]/page.tsx apps/web/src/components/catches/catch-card.tsx apps/web/src/components/catches/catch-list.tsx
git commit -m "feat(web): redesign home dashboard and catches as activity rows"
```

---

## Self-Review

**Spec coverage:**
- ✅ Design tokens: Task 1 — full `--ground/surface/raised/border/text/muted/faint/accent/accent-hi` system
- ✅ Typography: Playfair Display (species names, rank, greeting) + Inter (UI, numbers) in every component
- ✅ Shell: Task 2 — wordmark "Go·Pesca" cobalt dot, 2px top-border nav active indicator
- ✅ Community Feed: Task 3 — weight as protagonist, species on photo, card-in stagger, habitat pill
- ✅ FishyDex: Task 4 — KPI strip, rank card, animated progress bar, badge-pop, caught/uncaught states
- ✅ Home: Task 5 — greeting with accent-hi italic name, KPI strip, activity list, FAB
- ✅ Animations (all 5 approved): card-in (#1), progress bar fill (#2), badge-pop (#3), reaction press (#4 — ReactionBar handles this), filter chip crossfade (#5)
- ✅ House rules: tabular-nums on all numbers, `:active` via onMouseDown on all tappable surfaces, `minWidth: 0` on text columns, no `transition: all`

**Out of scope (per spec):** Catch form, species detail, achievements, profile, groups, auth screens, mobile Expo app — not touched.
