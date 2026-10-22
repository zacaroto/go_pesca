# Field Guide Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restyle the Go Pesca web app (`apps/web`) into the "Guía de campo" editorial direction the owner approved: a light field-guide look, a top bar, an editorial footer, and redesigned Home, FishyDex (alphabetical index + plate), Community (magazine mosaic) and Catch form (steps + live preview card).

**Architecture:** The look is driven by CSS custom properties in `globals.css`. Swapping the token values flips every screen that already uses `var(--token)` from dark to light. On top of that, four screens get new layouts built from small client components. Their data shaping (index sections, featured catch, monthly records, catch insight, latest new species) lives in pure TypeScript modules that are unit-tested with Vitest. Server data loading keeps using the existing Supabase helpers in `src/lib/`.

**Tech Stack:** Next.js 16.3 (App Router, `[locale]` segment), React 19.2, next-intl 4, Tailwind CSS 4 (`@theme inline`), Supabase JS, Vitest (added in Task 0).

**Approved mocks (source of truth for look and behaviour):**
- Round 1, direction C "Guía de campo" (Home, top bar, footer): https://claude.ai/artifact/YXYivDUfFHX9Tm9Yqk3JqJ (tab C)
- Round 2 picks: https://claude.ai/artifact/CDbYxfr6vULnBKhgRcruoG. FishyDex **option 2** (Índice de guía), Comunidad **option 2** (Revista), Registrar captura **option 1** (Paso a paso con ficha en vivo).

## Global Constraints

- Branch format (user rule): `feature/OFM-{ticket}-field-guide-redesign`. **Ask the user for the ticket number before creating the branch.** Never commit to `develop` or `main` directly.
- Read the relevant guide in `apps/web/node_modules/next/dist/docs/` before writing Next.js code (AGENTS.md: this Next.js has breaking changes).
- All user-visible strings go through `t()` from next-intl, with keys added to **both** `apps/web/src/messages/es.json` and `apps/web/src/messages/en.json`.
- No hardcoded colors in components. Use `var(--token)` only (the exception is the footer, which uses its own `--footer-*` tokens, defined in Task 1).
- Icons are inline SVGs with `aria-hidden="true"`. No Material Symbols, no emoji in UI.
- Fonts: Playfair Display (species names, page and section titles, scientific names in italic) + Inter (all UI). No other faces.
- Field-guide house rules: no gradients, no shadows on resting surfaces (shadows are only for floating menus and sheets), no tiny uppercase letter-spaced labels, no pill badges above headings, no icon-in-tinted-square tiles.
- Numbers use `font-variant-numeric: tabular-nums`. Show missing values as `—` and zero as `0`.
- `transition` lists exact properties; never `transition-all`.
- Every tappable surface has hover, `:active` and `:focus-visible` states. Honour `prefers-reduced-motion`.
- Never expose `latitude`/`longitude` of other users' catches (existing rule in `src/lib/feed.ts`).
- Commit messages end with: `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`

## File Map

| File | Status | Responsibility |
|---|---|---|
| `apps/web/package.json`, `apps/web/vitest.config.mts` | modify / create | Test runner |
| `apps/web/src/app/globals.css` | modify | Field-guide tokens, base styles, habitat pills |
| `apps/web/src/app/layout.tsx` | modify | Font weights (Playfair italic, Inter 700) |
| `DESIGN.md` | modify | Document design system v3 "Field Guide" |
| `apps/web/src/components/layout/header.tsx` | rewrite | Top bar: wordmark, nav, search, "Registrar captura", avatar |
| `apps/web/src/components/layout/site-footer.tsx` | create | Editorial dark footer |
| `apps/web/src/components/layout/fish-mark.tsx` | create | Brand fish icon (shared by header and footer) |
| `apps/web/src/components/layout/bottom-nav.tsx` | modify | Light phone nav with centre add button |
| `apps/web/src/app/[locale]/layout.tsx` | modify | Mount footer |
| `apps/web/src/lib/home-data.ts` | create | Pure: `pickLatestNewSpecies` |
| `apps/web/src/lib/home.ts` | create | Server: `getHomeData` |
| `apps/web/src/app/[locale]/page.tsx` | rewrite | Home: species hero, FishyDex band, recent catches |
| `apps/web/src/lib/pokedex.ts` | modify | Add descriptions + best weight to `PokedexEntry` |
| `apps/web/src/lib/fishydex-index.ts` | create | Pure: `buildSpeciesIndex`, `countByHabitat`, `speciesName` |
| `apps/web/src/components/pokedex/species-index.tsx` | create | Index list + chips + selection state |
| `apps/web/src/components/pokedex/species-plate.tsx` | create | Large plate (photo, names, facts, CTA) |
| `apps/web/src/app/[locale]/pokedex/page.tsx` | modify | Use the index |
| `apps/web/src/lib/community-mosaic.ts` | create | Pure: `pickFeatured`, `computeRecords` |
| `apps/web/src/components/feed/magazine-grid.tsx` | create | Mosaic + load more + records row |
| `apps/web/src/components/feed/magazine-tile.tsx` | create | One tile (featured or regular) |
| `apps/web/src/app/[locale]/community/page.tsx` | modify | Chips (Todos / Mis grupos) + magazine |
| `apps/web/src/lib/catch-insight.ts` | create | Pure: `getCatchInsight` |
| `apps/web/src/lib/species-bests-client.ts` | create | Client fetch of the user's best weight per species |
| `apps/web/src/components/catches/catch-preview.tsx` | create | Live "Así quedará en tu bitácora" card |
| `apps/web/src/components/catches/species-picker.tsx` | modify | Grid of options with reference photos |
| `apps/web/src/components/catches/catch-form.tsx` | modify | Two-column layout, step bar, preview wiring |
| `brain/Wiki/design-system.md` | modify | Record the new system |

---

### Task 0: Branch and test runner

**Files:**
- Modify: `apps/web/package.json`
- Create: `apps/web/vitest.config.mts`
- Create: `apps/web/src/lib/smoke.test.ts` (deleted again in Step 6)

**Interfaces:**
- Produces: `npm run test -w @go-pesca/web` runs `src/**/*.test.ts` with the `@/` alias resolved.

- [ ] **Step 1: Ask for the ticket and create the branch**

Ask the user: "¿Qué número de ticket OFM uso para la rama?" Then:

```bash
git checkout develop && git pull
git checkout -b feature/OFM-<ticket>-field-guide-redesign
```

- [ ] **Step 2: Install Vitest**

```bash
npm install -D vitest@3.2.4 -w @go-pesca/web
```

- [ ] **Step 3: Add the script and config**

In `apps/web/package.json`, add to `"scripts"`:

```json
"test": "vitest run"
```

Create `apps/web/vitest.config.mts`:

```ts
import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
```

- [ ] **Step 4: Write a smoke test**

`apps/web/src/lib/smoke.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { getRank } from "@/lib/rank";

describe("vitest wiring", () => {
  it("resolves the @ alias", () => {
    expect(getRank(0, 40).key).toBe("sardina");
  });
});
```

- [ ] **Step 5: Run it**

Run: `npm run test -w @go-pesca/web`
Expected: 1 passed.

- [ ] **Step 6: Delete the smoke test and commit**

```bash
rm apps/web/src/lib/smoke.test.ts
git add apps/web/package.json apps/web/vitest.config.mts package-lock.json
git commit -m "chore(web): add vitest for pure lib tests"
```

---

### Task 1: Field-guide tokens and fonts

**Files:**
- Modify: `apps/web/src/app/globals.css` (the `:root` block, lines 1-60; `body`; the habitat pill classes)
- Modify: `apps/web/src/app/layout.tsx:5-15`
- Modify: `DESIGN.md`

**Interfaces:**
- Produces these tokens, used by every later task: `--ground #f7f7f5`, `--surface #ffffff`, `--raised #ececea`, `--border #e6e6e3`, `--rule #e6e6e3`, `--text #121314`, `--muted #5c5f63`, `--faint #8a8d91`, `--accent #1d4ed8`, `--accent-hi #1a43bd`, `--accent-soft #eef2fd`, `--accent-ink #1a3a99`, `--silhouette #c9cac6`, `--footer-bg #121314`, `--footer-text #e8e8e6`, `--footer-muted #9a9c9f`, `--footer-link-hover #9db7ff`, `--r-card 4px`, `--r-pill 999px`, `--r-control 6px`.

- [ ] **Step 1: Replace the token values**

In `globals.css`, replace the Elevation, Borders, Text, Accent, Status, Habitat and Shape groups of `:root` with:

```css
  /* Field Guide v3 — light paper, ink, one cobalt hue */
  --ground:    #f7f7f5;
  --surface:   #ffffff;
  --raised:    #ececea;

  --border:    #e6e6e3;
  --rule:      #e6e6e3;

  --text:      #121314;
  --muted:     #5c5f63;
  --faint:     #8a8d91;

  --accent:      #1d4ed8;
  --accent-hi:   #1a43bd;
  --accent-soft: #eef2fd;
  --accent-ink:  #1a3a99;

  --silhouette: #c9cac6;

  --positive:  #15803d;
  --negative:  #c4242a;

  --pill-salt-bg:   #eef2fd;
  --pill-salt-ink:  #1a3a99;
  --pill-fresh-bg:  #e8f5ec;
  --pill-fresh-ink: #14532d;
  --pill-brack-bg:  #fdf6e3;
  --pill-brack-ink: #7a4b0b;

  --footer-bg:         #121314;
  --footer-text:       #e8e8e6;
  --footer-muted:      #9a9c9f;
  --footer-link-hover: #9db7ff;

  --r-card:    4px;
  --r-pill:    999px;
  --r-control: 6px;
  --gap:       16px;
  --pad:       24px;
```

Keep the animation tokens and the legacy aliases as they are. Change `--on-primary` stays `#ffffff`.

- [ ] **Step 2: Add base type helpers below `body`**

```css
.font-serif-display {
  font-family: var(--font-playfair), Georgia, serif;
  letter-spacing: -0.02em;
}
.sci-name {
  font-family: var(--font-playfair), Georgia, serif;
  font-style: italic;
  font-weight: 500;
  color: var(--muted);
}
:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}
```

- [ ] **Step 3: Load the extra font weights**

In `apps/web/src/app/layout.tsx`:

```ts
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["500", "700", "900"],
  style: ["normal", "italic"],
});
```

- [ ] **Step 4: Search for hardcoded dark values that would break on light**

Run: `grep -rnE "#fff(fff)?\b|rgba\(0,0,0|rgba\(37,99,235|text-gradient|dark:" apps/web/src --include=*.tsx`

Replace each hit with the matching token (`#ffffff` text on accent stays allowed only on `var(--accent)` backgrounds). Record the files you touched in the commit message.

- [ ] **Step 5: Verify**

Run: `npm run lint -w @go-pesca/web && npm run build -w @go-pesca/web`
Expected: both succeed. Then `npm run dev:web`, open `http://localhost:3000/es/pokedex` and `/es/community`. Pages render light, with dark text, and nothing is white-on-white.

- [ ] **Step 6: Update DESIGN.md**

Replace the frontmatter `version`, `theme` and `tokens` with the values from Step 1 (`version: "3.0.0"`, `theme: "Field Guide — paper, ink and cobalt"`). Replace the "Dark only" rule with "Light only; one hue (cobalt) on actions, active states and the main data element". Add the house rules from Global Constraints.

- [ ] **Step 7: Commit**

```bash
git add apps/web/src/app/globals.css apps/web/src/app/layout.tsx DESIGN.md <files from step 4>
git commit -m "feat(web): field guide design tokens and fonts"
```

---

### Task 2: Top bar, footer and phone nav

**Files:**
- Create: `apps/web/src/components/layout/fish-mark.tsx`
- Rewrite: `apps/web/src/components/layout/header.tsx`
- Create: `apps/web/src/components/layout/site-footer.tsx`
- Modify: `apps/web/src/components/layout/bottom-nav.tsx`
- Modify: `apps/web/src/app/[locale]/layout.tsx` (return block)
- Modify: `apps/web/src/messages/es.json`, `en.json`

**Interfaces:**
- Produces: `<FishMark className?: string />`, `<SiteFooter />` (server-safe, uses `useTranslations`), `Header` keeps its props `{ user, rankData }`.

- [ ] **Step 1: Add i18n keys**

`es.json`: add to `nav`: `"groups": "Grupos"`, `"logCatch": "Registrar captura"`. Add a top-level block:

```json
"footer": {
  "quote": "Cada especie que registrás ayuda a conocer mejor nuestras aguas.",
  "collection": "Colección",
  "community": "Comunidad",
  "brand": "Go Pesca",
  "ranks": "Rangos",
  "suggestSpecies": "Sugerir especie",
  "responsible": "Pesca responsable",
  "privacy": "Privacidad",
  "terms": "Términos",
  "contact": "Contacto",
  "madeIn": "Hecho en Costa Rica"
}
```

`en.json`: same keys with `"groups": "Groups"`, `"logCatch": "Log catch"`, and footer values `"Every species you log helps us understand our waters better."`, `"Collection"`, `"Community"`, `"Go Pesca"`, `"Ranks"`, `"Suggest a species"`, `"Responsible fishing"`, `"Privacy"`, `"Terms"`, `"Contact"`, `"Made in Costa Rica"`.

- [ ] **Step 2: Create the brand mark**

`fish-mark.tsx`:

```tsx
export function FishMark({ className = "w-7 h-7" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2 12c3-5 9-7 14-4l5-3v14l-5-3c-5 3-11 1-14-4z" />
      <circle cx="7.5" cy="11" r=".8" />
    </svg>
  );
}
```

- [ ] **Step 3: Rewrite the header**

Replace `header.tsx` with a 60px white bar matching the mock: wordmark (FishMark in `--accent` + "Go Pesca" in Playfair 700 20px), nav links `/` Inicio, `/pokedex` FishyDex, `/community` Comunidad, `/groups` Grupos, `/species` Especies (signed-in only, hidden below `sm`), then a spacer, a search icon link to `/species`, the "Registrar captura" pill (`/catches/new`, `var(--accent)` fill, 40px tall, hidden below `sm`), `LanguageSwitcher`, and `UserMenu`. Signed-out users keep the existing login/register links with the new tokens.

```tsx
"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { UserMenu } from "./user-menu";
import { LanguageSwitcher } from "./language-switcher";
import { FishMark } from "./fish-mark";

type Props = {
  user: { id: string; email?: string; display_name?: string } | null;
  rankData?: { caught: number; total: number };
};

const NAV = [
  { href: "/", key: "home" },
  { href: "/pokedex", key: "pokedex" },
  { href: "/community", key: "community" },
  { href: "/groups", key: "groups" },
  { href: "/species", key: "species" },
] as const;

export function Header({ user }: Props) {
  const t = useTranslations();
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");

  return (
    <header className="sticky top-0 z-40 w-full" style={{ background: "var(--surface)" }}>
      <div className="mx-auto flex h-[60px] max-w-[1280px] items-center gap-7 px-4 sm:px-12">
        <Link href="/" className="flex items-center gap-2.5 active:opacity-75" style={{ color: "var(--text)" }}>
          <span style={{ color: "var(--accent)" }}><FishMark /></span>
          <span className="font-serif-display" style={{ fontWeight: 700, fontSize: 20 }}>Go Pesca</span>
        </Link>

        {user && (
          <nav className="hidden gap-1 sm:flex" aria-label={t("nav.home")}>
            {NAV.map(({ href, key }) => {
              const active = isActive(href);
              return (
                <Link key={href} href={href}
                  className="rounded-full px-3 py-2 text-sm hover:bg-[var(--raised)] active:opacity-75"
                  style={{
                    color: active ? "var(--text)" : "var(--muted)",
                    fontWeight: active ? 600 : 400,
                    transition: "color var(--t-ui), background-color var(--t-ui)",
                  }}
                  aria-current={active ? "page" : undefined}>
                  {t(`nav.${key}`)}
                </Link>
              );
            })}
          </nav>
        )}

        <span className="flex-1" />

        <Link href="/species" aria-label={t("common.search")} className="hidden sm:block active:opacity-75" style={{ color: "var(--muted)" }}>
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" aria-hidden="true">
            <circle cx="11" cy="11" r="6.5" /><path d="m20 20-4.2-4.2" />
          </svg>
        </Link>

        <LanguageSwitcher />

        {user ? (
          <>
            <Link href="/catches/new"
              className="hidden h-10 items-center gap-2 rounded-full px-5 text-sm font-semibold active:scale-[0.97] sm:inline-flex"
              style={{ background: "var(--accent)", color: "var(--on-primary)", transition: "background-color var(--t-ui), transform var(--t-press)" }}>
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>
              {t("nav.logCatch")}
            </Link>
            <UserMenu displayName={user.display_name ?? user.email ?? ""} userId={user.id} />
          </>
        ) : (
          <div className="flex items-center gap-3">
            <Link href="/auth/login" className="text-sm font-medium active:opacity-75" style={{ color: "var(--muted)" }}>{t("common.login")}</Link>
            <Link href="/auth/register" className="inline-flex h-10 items-center rounded-full px-5 text-sm font-semibold active:scale-[0.97]"
              style={{ background: "var(--accent)", color: "var(--on-primary)" }}>{t("common.register")}</Link>
          </div>
        )}
      </div>
    </header>
  );
}
```

`RankBadge` leaves the header: the rank now appears on Home and in the FishyDex subtitle. `rankData` stays in the props so `[locale]/layout.tsx` compiles unchanged.

- [ ] **Step 4: Create the footer**

`site-footer.tsx`:

```tsx
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

const COLS = [
  { title: "collection", links: [["/pokedex", "nav.pokedex"], ["/species", "nav.species"], ["/achievements", "nav.achievements"]] },
  { title: "community", links: [["/community", "nav.community"], ["/groups", "nav.groups"], ["/species/suggest", "footer.suggestSpecies"]] },
  { title: "brand", links: [["/", "footer.responsible"], ["/", "footer.privacy"], ["/", "footer.terms"], ["/", "footer.contact"]] },
] as const;

export function SiteFooter() {
  const t = useTranslations();
  return (
    <footer className="px-4 pb-7 pt-14 sm:px-12" style={{ background: "var(--footer-bg)", color: "var(--footer-text)" }}>
      <div className="mx-auto max-w-[1280px]">
        <div className="grid grid-cols-2 gap-9 sm:grid-cols-[2fr_1fr_1fr_1fr]">
          <p className="col-span-2 m-0 max-w-[22ch] font-serif-display text-[22px] leading-tight sm:col-span-1 sm:text-[26px]">
            {t("footer.quote")}
          </p>
          {COLS.map((col) => (
            <div key={col.title}>
              <h2 className="mb-3 text-[13px] font-medium" style={{ color: "var(--footer-muted)" }}>{t(`footer.${col.title}`)}</h2>
              <ul className="m-0 list-none p-0">
                {col.links.map(([href, key]) => (
                  <li key={key} className="mb-2">
                    <Link href={href} className="hover:text-[var(--footer-link-hover)]" style={{ transition: "color var(--t-ui)" }}>{t(key)}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p aria-hidden="true" className="m-0 mb-5 mt-12 font-serif-display font-black leading-[0.85] tracking-[-0.04em] text-[clamp(64px,14vw,180px)]" style={{ color: "var(--surface)" }}>
          Go Pesca
        </p>
        <div className="flex justify-between gap-4 text-xs" style={{ color: "var(--footer-muted)" }}>
          <span>© {new Date().getFullYear()} Go Pesca · {t("footer.madeIn")}</span>
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 5: Mount the footer**

In `apps/web/src/app/[locale]/layout.tsx`, import `SiteFooter` and render it after `<main>`:

```tsx
<Header user={user} rankData={rankData} />
<main className="flex flex-1 flex-col">{children}</main>
<SiteFooter />
{user && <BottomNav />}
```

Add `pb-20 sm:pb-0` to the `<footer>` root className so the phone nav never covers it.

- [ ] **Step 6: Restyle the phone nav**

In `bottom-nav.tsx`, keep `TABS` and `isActive`. Change the tabs to Inicio, FishyDex, (centre add button), Feed, Perfil. The `<nav>` background becomes `var(--surface)` with no top border. Active color is `var(--text)` at weight 600 and inactive is `var(--muted)`. Remove the `borderTop` active indicator. Insert this centre item between the second and third tab:

```tsx
<Link href="/catches/new" aria-label={t("nav.logCatch")} className="flex flex-1 items-center justify-center active:scale-95"
  style={{ transition: "transform var(--t-press)" }}>
  <span className="grid h-12 w-12 place-items-center rounded-full" style={{ background: "var(--accent)", color: "var(--on-primary)" }}>
    <svg className="h-[22px] w-[22px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>
  </span>
</Link>
```

Replace the hardcoded `label` strings with `t("nav.home")`, `t("nav.pokedex")`, `t("nav.community")`, `t("nav.profile")` (add `const t = useTranslations();`). Delete `home-fab.tsx` and its import in `[locale]/page.tsx`, because the centre button replaces it.

- [ ] **Step 7: Verify**

Run: `npm run lint -w @go-pesca/web && npm run build -w @go-pesca/web`. Open `/es` and `/en` at 1440px and 390px.
Expected: the top bar matches the mock, the nav hides on phone, the footer shows four columns on desktop and two on phone, the giant wordmark never causes horizontal scroll, and the phone nav does not cover footer text.

- [ ] **Step 8: Commit**

```bash
git add apps/web/src/components/layout apps/web/src/app/\[locale\]/layout.tsx apps/web/src/app/\[locale\]/page.tsx apps/web/src/messages
git commit -m "feat(web): field guide top bar, editorial footer and phone nav"
```

---

### Task 3: Home — latest species hero, FishyDex band, recent catches

**Files:**
- Create: `apps/web/src/lib/home-data.ts`, `apps/web/src/lib/home-data.test.ts`
- Create: `apps/web/src/lib/home.ts`
- Rewrite: `apps/web/src/app/[locale]/page.tsx`
- Modify: `es.json`, `en.json` (`home` block)

**Interfaces:**
- Produces: `type HomeCatch = { id: string; species_id: number; species_name: string; scientific_name: string; habitat: string | null; description: string | null; reference_photo_url: string | null; photo_url: string; catch_date: string; location_name: string | null; weight_kg: number | null; length_cm: number | null; bait_lure: string | null }`
- Produces: `pickLatestNewSpecies(catches: HomeCatch[]): HomeCatch | null`. It returns the most recent catch that was the first catch of its species. Ties on the same date go to the later array position.
- Produces: `getHomeData(userId: string, locale: string): Promise<{ catches: HomeCatch[]; latestNew: HomeCatch | null; caught: number; total: number }>`

- [ ] **Step 1: Write the failing test**

`home-data.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { pickLatestNewSpecies, type HomeCatch } from "@/lib/home-data";

const c = (id: string, species_id: number, catch_date: string): HomeCatch => ({
  id, species_id, catch_date, species_name: `s${species_id}`, scientific_name: "", habitat: null,
  description: null, reference_photo_url: null, photo_url: "", location_name: null,
  weight_kg: null, length_cm: null, bait_lure: null,
});

describe("pickLatestNewSpecies", () => {
  it("returns null with no catches", () => {
    expect(pickLatestNewSpecies([])).toBeNull();
  });
  it("ignores repeat catches of an already-caught species", () => {
    const list = [c("a", 1, "2026-09-01"), c("b", 2, "2026-09-10"), c("c", 1, "2026-10-20")];
    expect(pickLatestNewSpecies(list)?.id).toBe("b");
  });
  it("works regardless of input order", () => {
    const list = [c("c", 1, "2026-10-20"), c("b", 2, "2026-09-10"), c("a", 1, "2026-09-01")];
    expect(pickLatestNewSpecies(list)?.id).toBe("b");
  });
});
```

- [ ] **Step 2: Run it and see it fail**

Run: `npm run test -w @go-pesca/web -- home-data`
Expected: FAIL, "Cannot find module '@/lib/home-data'".

- [ ] **Step 3: Implement**

`home-data.ts`:

```ts
export type HomeCatch = {
  id: string;
  species_id: number;
  species_name: string;
  scientific_name: string;
  habitat: string | null;
  description: string | null;
  reference_photo_url: string | null;
  photo_url: string;
  catch_date: string;
  location_name: string | null;
  weight_kg: number | null;
  length_cm: number | null;
  bait_lure: string | null;
};

export function pickLatestNewSpecies(catches: HomeCatch[]): HomeCatch | null {
  const chronological = [...catches].sort((a, b) => a.catch_date.localeCompare(b.catch_date));
  const seen = new Set<number>();
  let latest: HomeCatch | null = null;
  for (const entry of chronological) {
    if (seen.has(entry.species_id)) continue;
    seen.add(entry.species_id);
    latest = entry;
  }
  return latest;
}
```

- [ ] **Step 4: Run it and see it pass**

Run: `npm run test -w @go-pesca/web -- home-data`
Expected: 3 passed.

- [ ] **Step 5: Server loader**

`home.ts`:

```ts
import { createClient } from "@/lib/supabase/server";
import { pickLatestNewSpecies, type HomeCatch } from "./home-data";

export async function getHomeData(userId: string, locale: string) {
  const supabase = await createClient();
  const nameCol = locale === "en" ? "name_en" : "name_es";
  const descCol = locale === "en" ? "description_en" : "description_es";

  const [{ data: rows }, { count: total }] = await Promise.all([
    supabase
      .from("catches")
      .select(`id, species_id, photo_url, catch_date, location_name, weight_kg, length_cm, bait_lure,
               species:species_id (${nameCol}, scientific_name, habitat, ${descCol}, reference_photo_url)`)
      .eq("user_id", userId)
      .order("catch_date", { ascending: false }),
    supabase.from("species").select("*", { count: "exact", head: true }),
  ]);

  const catches: HomeCatch[] = (rows ?? []).map((row: Record<string, unknown>) => {
    const s = (row.species ?? {}) as Record<string, string | null>;
    return {
      id: row.id as string,
      species_id: row.species_id as number,
      species_name: s[nameCol] ?? "",
      scientific_name: s.scientific_name ?? "",
      habitat: s.habitat ?? null,
      description: s[descCol] ?? null,
      reference_photo_url: s.reference_photo_url ?? null,
      photo_url: row.photo_url as string,
      catch_date: row.catch_date as string,
      location_name: (row.location_name as string | null) ?? null,
      weight_kg: (row.weight_kg as number | null) ?? null,
      length_cm: (row.length_cm as number | null) ?? null,
      bait_lure: (row.bait_lure as string | null) ?? null,
    };
  });

  return {
    catches,
    latestNew: pickLatestNewSpecies(catches),
    caught: new Set(catches.map((c) => c.species_id)).size,
    total: total ?? 0,
  };
}
```

- [ ] **Step 6: i18n keys**

`es.json` `home` block, added keys: `"latestSpecies": "Tu especie más reciente"`, `"length": "Largo"`, `"weight": "Peso"`, `"place": "Lugar"`, `"date": "Fecha"`, `"viewSpecies": "Ver ficha de la especie"`, `"yourFishyDex": "Tu FishyDex"`, `"fishyDexProgress": "{caught} de {total} especies"`, `"openCollection": "Abrir colección"`, `"recentCatches": "Últimas capturas"`, `"viewAll": "Ver las {count}"`, `"emptyTitle": "Tu guía está en blanco"`, `"emptyBody": "Registrá tu primera captura y aparecerá aquí como la portada de tu guía."`. Add matching English keys in `en.json`.

- [ ] **Step 7: Rewrite the page**

`[locale]/page.tsx` is a server component. Steps inside it:
1. Get the user with `createClient()`. If there is no user, render the existing signed-out landing copy in the new tokens: the h1 `t("home.emptyTitle")` and a register link.
2. Call `getHomeData`.
3. Render three blocks, using the mock's tab C as reference:
   - **Hero** (`grid lg:grid-cols-[5fr_7fr] gap-12 items-center`). On the left: label `t("home.latestSpecies")` in `--muted`, an `<h1>` with `latestNew.species_name` in Playfair 900 at `clamp(40px,6vw,64px)`, a `.sci-name` paragraph, three facts (weight or length, place, date formatted with `toLocaleDateString(locale, { day: "numeric", month: "short" })`, and `—` when missing), the description, and a link button to `/pokedex/${species_id}`. On the right: a white `--surface` panel 400px tall (220px on phone) showing `reference_photo_url ?? photo_url` with `object-fit: contain; padding: 24px`.
   - **FishyDex band**: a white panel with a Playfair 30px h2, `t("home.fishyDexProgress", { caught, total })`, an 8px progress bar (`--raised` track, `--accent` fill), and the six most recent distinct species as cards (reference photo, Playfair name).
   - **Recent catches**: the four most recent rows, each with a 120×80 photo, Playfair name, a meta line (place · bait · date), and the weight right-aligned. Rows are separated by a `--rule` top border. The view-all link goes to `/catches`.
4. When `catches.length === 0`, render a single empty block in place of all three: `t("home.emptyTitle")`, `t("home.emptyBody")`, and a "Registrar captura" link to `/catches/new`.

Use `next/image` only if `next.config.mjs` already allows the Supabase and fishbase hosts. Otherwise use `<img>` with `loading="lazy"`, which is what `feed-card.tsx` does today.

- [ ] **Step 8: Verify**

Run: `npm run lint -w @go-pesca/web && npm run build -w @go-pesca/web`, then open `/es` signed in with a test account that has catches, and again with a fresh account.
Expected: the hero shows the latest new species, a fresh account sees the empty block, and there is no horizontal scroll at 390px.

- [ ] **Step 9: Commit**

```bash
git add apps/web/src/lib/home-data.ts apps/web/src/lib/home-data.test.ts apps/web/src/lib/home.ts apps/web/src/app/\[locale\]/page.tsx apps/web/src/messages
git commit -m "feat(web): field guide home with latest species hero"
```

---

### Task 4: FishyDex — alphabetical index with plate (option 2)

**Files:**
- Modify: `apps/web/src/lib/pokedex.ts` (type + select)
- Create: `apps/web/src/lib/fishydex-index.ts`, `apps/web/src/lib/fishydex-index.test.ts`
- Create: `apps/web/src/components/pokedex/species-plate.tsx`
- Create: `apps/web/src/components/pokedex/species-index.tsx`
- Modify: `apps/web/src/app/[locale]/pokedex/page.tsx`
- Delete after verifying: `pokedex-grid.tsx`, `pokedex-card.tsx`, `progress-bar.tsx` (only if `grep -rn` shows no other importers)

**Interfaces:**
- `PokedexEntry` gains `description_es: string | null; description_en: string | null; best_weight_kg: number | null`.
- Produces: `type Habitat = "saltwater" | "freshwater" | "brackish"`, `type HabitatFilter = Habitat | "all"`, `type IndexSection = { letter: string; entries: PokedexEntry[] }`.
- Produces: `speciesName(e, locale): string`, `buildSpeciesIndex(entries, locale, habitat): IndexSection[]`, `countByHabitat(entries): Record<Habitat, { caught: number; total: number }>`.
- Produces: `<SpeciesPlate entry={PokedexEntry} locale={string} />`, `<SpeciesIndex entries={PokedexEntry[]} locale={string} />`.

- [ ] **Step 1: Write the failing tests**

`fishydex-index.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { buildSpeciesIndex, countByHabitat } from "@/lib/fishydex-index";
import type { PokedexEntry } from "@/lib/pokedex";

const e = (id: number, name_es: string, habitat: string, catch_count = 0): PokedexEntry => ({
  id, name_es, name_en: name_es, scientific_name: "", habitat, reference_photo_url: null,
  catch_count, first_catch_date: null, last_catch_date: null, first_catch_photo: null,
  description_es: null, description_en: null, best_weight_kg: null,
});

const list = [
  e(1, "Sábalo", "saltwater", 2), e(2, "Atún aleta amarilla", "saltwater", 1),
  e(3, "Barracuda", "saltwater"), e(4, "Guapote", "freshwater", 1),
  e(5, "Róbalo", "brackish", 1), e(6, "Ñato", "freshwater"),
];

describe("buildSpeciesIndex", () => {
  it("groups by first letter in Spanish order, folding accents but keeping Ñ", () => {
    const letters = buildSpeciesIndex(list, "es", "all").map((s) => s.letter);
    expect(letters).toEqual(["A", "B", "G", "Ñ", "R", "S"]);
  });
  it("filters by habitat", () => {
    const names = buildSpeciesIndex(list, "es", "saltwater").flatMap((s) => s.entries.map((x) => x.name_es));
    expect(names).toEqual(["Atún aleta amarilla", "Barracuda", "Sábalo"]);
  });
  it("returns no sections when nothing matches", () => {
    expect(buildSpeciesIndex([], "es", "all")).toEqual([]);
  });
});

describe("countByHabitat", () => {
  it("counts caught and total per habitat", () => {
    expect(countByHabitat(list)).toEqual({
      saltwater: { caught: 2, total: 3 },
      freshwater: { caught: 1, total: 2 },
      brackish: { caught: 1, total: 1 },
    });
  });
});
```

- [ ] **Step 2: Run them and see them fail**

Run: `npm run test -w @go-pesca/web -- fishydex-index`
Expected: FAIL, module not found (and a TypeScript error on the new `PokedexEntry` fields).

- [ ] **Step 3: Extend `PokedexEntry`**

In `pokedex.ts`, add the three fields to the type. Change the catches query to `.select("species_id, catch_date, photo_url, weight_kg")`. Track `best` in `catchMap` (`best: Math.max(existing.best ?? 0, c.weight_kg ?? 0) || null` in the existing branch, and `best: c.weight_kg ?? null` in the new branch). In the returned object add `description_es: s.description_es, description_en: s.description_en, best_weight_kg: catchData?.best ?? null`.

- [ ] **Step 4: Implement the index module**

`fishydex-index.ts`:

```ts
import type { PokedexEntry } from "./pokedex";

export type Habitat = "saltwater" | "freshwater" | "brackish";
export type HabitatFilter = Habitat | "all";
export type IndexSection = { letter: string; entries: PokedexEntry[] };

const FOLD: Record<string, string> = { Á: "A", É: "E", Í: "I", Ó: "O", Ú: "U", Ü: "U" };

export function speciesName(e: Pick<PokedexEntry, "name_es" | "name_en">, locale: string): string {
  return locale === "en" ? e.name_en : e.name_es;
}

export function buildSpeciesIndex(entries: PokedexEntry[], locale: string, habitat: HabitatFilter): IndexSection[] {
  const collator = new Intl.Collator(locale, { sensitivity: "base" });
  const sorted = entries
    .filter((e) => habitat === "all" || e.habitat === habitat)
    .sort((a, b) => collator.compare(speciesName(a, locale), speciesName(b, locale)));

  const sections: IndexSection[] = [];
  for (const entry of sorted) {
    const first = speciesName(entry, locale).charAt(0).toUpperCase();
    const letter = FOLD[first] ?? first;
    const last = sections[sections.length - 1];
    if (last && last.letter === letter) last.entries.push(entry);
    else sections.push({ letter, entries: [entry] });
  }
  return sections;
}

export function countByHabitat(entries: PokedexEntry[]): Record<Habitat, { caught: number; total: number }> {
  const out: Record<Habitat, { caught: number; total: number }> = {
    saltwater: { caught: 0, total: 0 },
    freshwater: { caught: 0, total: 0 },
    brackish: { caught: 0, total: 0 },
  };
  for (const e of entries) {
    const bucket = out[e.habitat as Habitat];
    if (!bucket) continue;
    bucket.total++;
    if (e.catch_count > 0) bucket.caught++;
  }
  return out;
}
```

- [ ] **Step 5: Run the tests and see them pass**

Run: `npm run test -w @go-pesca/web -- fishydex-index`
Expected: 4 passed.

- [ ] **Step 6: i18n keys**

Add to `pokedex` in both files (Spanish shown): `"subtitle": "{caught} de {total} especies"`, `"all": "Todas"`, `"saltwater": "Agua salada"`, `"freshwater": "Agua dulce"`, `"brackish": "Salobre"`, `"undiscovered": "Por descubrir"`, `"yourBest": "Tu mejor"`, `"where": "Dónde"`, `"habitat": "Hábitat"`, `"released": "Liberado"`, `"viewMyCatches": "Ver mis capturas"`, `"whereToFish": "Ver ficha de la especie"`, `"timesCaught": "{count, plural, one {# captura} other {# capturas}}"`.

- [ ] **Step 7: Build the plate**

`species-plate.tsx`. It renders a white `--surface` panel (`position: sticky; top: 80px` from `lg` up, `padding: 24px`, radius `var(--r-card)`) containing:
- an image box 260px tall on `--ground`, with `reference_photo_url` at `object-fit: contain`. When `catch_count === 0`, show the FishMark silhouette in `--silhouette` instead;
- an `<h2>` with the name in Playfair 900 40px;
- a `.sci-name` line at 18px;
- the description;
- three facts (`best_weight_kg` as `"{n} kg"` or `—`, `t("pokedex.timesCaught", { count })` or `—`, the habitat label);
- a full-width accent link: `/pokedex/${id}` with `t("pokedex.viewMyCatches")` when caught, `/species/${id}` with `t("pokedex.whereToFish")` otherwise.

It takes `{ entry, locale }` and uses `useTranslations("pokedex")`, so mark it `"use client"`.

- [ ] **Step 8: Build the index**

`species-index.tsx`, `"use client"`:
- State: `habitat: HabitatFilter = "all"` and `selectedId: number` (initially the most recently caught entry by `last_catch_date`, otherwise the first entry).
- Header row: chips for `all | saltwater | freshwater | brackish`. Each habitat chip shows its `countByHabitat` value, for example "Agua salada 13/26". Active chip uses `--text` background and `--ground` ink; inactive uses `--raised`.
- Layout: `grid lg:grid-cols-[7fr_5fr] gap-10 items-start`. Left: the sections from `buildSpeciesIndex`. Each letter is a Playfair 22px `--accent` heading. Each row is a `<button>` with a 4-column grid (`minmax(0,1.3fr) minmax(0,1.3fr) 90px 110px`): name in Playfair 700 17px, `.sci-name`, habitat label at 12px `--muted`, and status right-aligned (`best_weight_kg` kg, `t("pokedex.released")` when caught without a weight, `t("pokedex.undiscovered")` in `--muted` when not caught). Rows have a `--rule` top border. On hover or selection they get a `--surface` background with radius 6px and a transparent border.
- Select on `onMouseEnter`, `onFocus` and `onClick`. Arrow Up/Down on a focused row moves focus to the previous or next row button. Right column: `<SpeciesPlate entry={selected} />`.
- Below `lg`: hide the plate, drop the scientific-name and habitat columns, and make each row a `Link` to `/pokedex/${id}` (caught) or `/species/${id}` (not caught).

- [ ] **Step 9: Wire the page**

In `pokedex/page.tsx`, replace `PokedexContent` with a header row (`<h1>` with `t("title")` in Playfair 900 52px, a subtitle `t("subtitle", { caught, total })`, and the rank from `getRank(caught, total)` shown as plain text `t("rank.<key>")` plus the level) and `<SpeciesIndex entries={entries} locale={locale} />`. Wrap them in `mx-auto max-w-[1280px] px-4 sm:px-12 py-10`. Remove the `text-gradient-ocean` class and the `--font-fredoka` reference.

- [ ] **Step 10: Verify, then delete dead files**

Run: `npm run test -w @go-pesca/web && npm run lint -w @go-pesca/web && npm run build -w @go-pesca/web`.
Then `grep -rn "pokedex-grid\|pokedex-card\|progress-bar" apps/web/src`. If only the deleted page referenced them, delete the three files and build again.
Manual check: hovering a row updates the plate, chips filter and show counts, keyboard arrows move between rows, and at 390px rows navigate to the species page.

- [ ] **Step 11: Commit**

```bash
git add apps/web/src/lib/pokedex.ts apps/web/src/lib/fishydex-index.ts apps/web/src/lib/fishydex-index.test.ts apps/web/src/components/pokedex apps/web/src/app/\[locale\]/pokedex/page.tsx apps/web/src/messages
git commit -m "feat(web): FishyDex alphabetical index with species plate"
```

---

### Task 5: Community — magazine mosaic (option 2)

**Files:**
- Create: `apps/web/src/lib/community-mosaic.ts`, `apps/web/src/lib/community-mosaic.test.ts`
- Create: `apps/web/src/components/feed/magazine-tile.tsx`
- Create: `apps/web/src/components/feed/magazine-grid.tsx`
- Modify: `apps/web/src/app/[locale]/community/page.tsx`
- Modify: `es.json`, `en.json` (`feed` block)

**Interfaces:**
- Consumes: `FeedCatch`, `FeedReactions`, `ReactionCounts` from `@/lib/feed` (type-only imports), `ReactionBar` from `./reaction-bar`, `fetchMoreFeedCatches` / `fetchMoreReactions` from `@/lib/feed-client`, `fetchMoreAllGroupsFeedCatches` from `@/lib/group-feed-client`.
- Produces: `totalReactions(r: FeedReactions | undefined): number`.
- Produces: `pickFeatured(catches: FeedCatch[], reactions: Record<string, FeedReactions>, now: Date): { featured: FeedCatch | null; rest: FeedCatch[] }`. Featured is the catch from the last 7 days with the most reactions (ties go to the newer `created_at`). If none is that recent, it is the first item.
- Produces: `type CommunityRecords = { heaviest: FeedCatch | null; topSpecies: { name: string; count: number } | null; weekCount: number }` and `computeRecords(catches: FeedCatch[], now: Date): CommunityRecords`. Heaviest and top species cover the current calendar month; `weekCount` covers the last 7 days by `catch_date`.

- [ ] **Step 1: Write the failing tests**

`community-mosaic.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { pickFeatured, computeRecords } from "@/lib/community-mosaic";
import type { FeedCatch, FeedReactions } from "@/lib/feed";

const now = new Date("2026-10-21T12:00:00Z");
const f = (id: string, species_name: string, catch_date: string, weight_kg: number | null): FeedCatch => ({
  id, user_id: "u", photo_url: "", species_name, display_name: "", avatar_url: null,
  location_name: null, catch_date, created_at: `${catch_date}T10:00:00Z`, weight_kg, habitat: null,
});
const r = (n: number): FeedReactions => ({ counts: { fish: n, fire: 0, trophy: 0, wow: 0, respect: 0 }, userReaction: null });

describe("pickFeatured", () => {
  it("picks the most-reacted catch from the last 7 days", () => {
    const list = [f("a", "Dorado", "2026-10-20", 8), f("b", "Pargo", "2026-10-18", 3), f("c", "Wahoo", "2026-10-01", 14)];
    const out = pickFeatured(list, { a: r(2), b: r(9), c: r(40) }, now);
    expect(out.featured?.id).toBe("b");
    expect(out.rest.map((x) => x.id)).toEqual(["a", "c"]);
  });
  it("falls back to the first catch when none are recent", () => {
    const list = [f("x", "Dorado", "2026-09-01", 8), f("y", "Pargo", "2026-08-01", 3)];
    expect(pickFeatured(list, {}, now).featured?.id).toBe("x");
  });
  it("handles an empty feed", () => {
    expect(pickFeatured([], {}, now)).toEqual({ featured: null, rest: [] });
  });
});

describe("computeRecords", () => {
  it("finds this month's heaviest, top species and last-7-days count", () => {
    const list = [
      f("a", "Dorado", "2026-10-20", 8.4), f("b", "Dorado", "2026-10-05", 6),
      f("c", "Sábalo", "2026-10-02", 31), f("d", "Marlín", "2026-09-28", 90),
    ];
    const out = computeRecords(list, now);
    expect(out.heaviest?.id).toBe("c");
    expect(out.topSpecies).toEqual({ name: "Dorado", count: 2 });
    expect(out.weekCount).toBe(1);
  });
  it("returns nulls and zero with no data", () => {
    expect(computeRecords([], now)).toEqual({ heaviest: null, topSpecies: null, weekCount: 0 });
  });
});
```

- [ ] **Step 2: Run them and see them fail**

Run: `npm run test -w @go-pesca/web -- community-mosaic`
Expected: FAIL, module not found.

- [ ] **Step 3: Implement**

`community-mosaic.ts`:

```ts
import type { FeedCatch, FeedReactions } from "./feed";

const DAY = 86_400_000;

export function totalReactions(r: FeedReactions | undefined): number {
  if (!r) return 0;
  return Object.values(r.counts).reduce((sum, n) => sum + n, 0);
}

function daysAgo(dateStr: string, now: Date): number {
  return (now.getTime() - new Date(`${dateStr}T00:00:00Z`).getTime()) / DAY;
}

export function pickFeatured(catches: FeedCatch[], reactions: Record<string, FeedReactions>, now: Date) {
  if (catches.length === 0) return { featured: null, rest: [] as FeedCatch[] };
  const recent = catches.filter((c) => daysAgo(c.catch_date, now) <= 7);
  const featured = recent.length
    ? recent.reduce((best, c) => {
        const diff = totalReactions(reactions[c.id]) - totalReactions(reactions[best.id]);
        return diff > 0 || (diff === 0 && c.created_at > best.created_at) ? c : best;
      })
    : catches[0];
  return { featured, rest: catches.filter((c) => c.id !== featured.id) };
}

export type CommunityRecords = {
  heaviest: FeedCatch | null;
  topSpecies: { name: string; count: number } | null;
  weekCount: number;
};

export function computeRecords(catches: FeedCatch[], now: Date): CommunityRecords {
  const month = now.toISOString().slice(0, 7);
  const thisMonth = catches.filter((c) => c.catch_date.startsWith(month));

  let heaviest: FeedCatch | null = null;
  const counts = new Map<string, number>();
  for (const c of thisMonth) {
    if (c.weight_kg !== null && (heaviest === null || c.weight_kg > (heaviest.weight_kg ?? 0))) heaviest = c;
    counts.set(c.species_name, (counts.get(c.species_name) ?? 0) + 1);
  }

  let topSpecies: CommunityRecords["topSpecies"] = null;
  for (const [name, count] of counts) {
    if (!topSpecies || count > topSpecies.count) topSpecies = { name, count };
  }

  return { heaviest, topSpecies, weekCount: catches.filter((c) => daysAgo(c.catch_date, now) <= 7).length };
}
```

- [ ] **Step 4: Run the tests and see them pass**

Run: `npm run test -w @go-pesca/web -- community-mosaic`
Expected: 5 passed.

- [ ] **Step 5: i18n keys**

Add to `feed` (Spanish shown): `"subtitle": "{count, plural, one {# captura} other {# capturas}} en los últimos 7 días"`, `"tabAll": "Todos"`, `"tabGroups": "Mis grupos"`, `"recordHeaviest": "Más pesado del mes"`, `"recordTopSpecies": "Especie más registrada"`, `"recordWeek": "Capturas esta semana"`. Change `"empty"` to `"Todavía nadie compartió capturas. Sé el primero."` (this removes the emoji empty state).

- [ ] **Step 6: Build the tile**

`magazine-tile.tsx`, `"use client"`. Props: `{ entry: FeedCatch; reactions: FeedReactions; featured?: boolean }`. Markup: an `<article>` on `--surface` with radius `var(--r-card)` and `overflow: hidden`, in a column flex. Its parts:
- A photo area (`flex: 1; min-height: 0`), with `<img loading="lazy">` at `object-fit: cover`. On hover the image scales to 1.04 over 500ms `var(--ease-out)`, disabled under `prefers-reduced-motion`.
- A caption (`padding: 10px 14px 12px`): `species_name` in Playfair 700 18px (900 34px when `featured`), then `display_name · location_name · relative date` at 12px `--muted`.
- When `featured`, a `<ReactionBar catchId={entry.id} reactions={reactions} />` under the caption. Check the prop names in `reaction-bar.tsx` before using it.

The whole tile links to `/catches/${entry.id}`. No gradient overlay; the text sits under the photo, not on it.

- [ ] **Step 7: Build the grid**

`magazine-grid.tsx`, `"use client"`. Props: `{ initialCatches: FeedCatch[]; initialReactions: Record<string, FeedReactions>; locale: string; feedType: "global" | "allGroups"; emptyMessage?: string }`. Copy the `loadMore` state logic from `feed-list.tsx` unchanged (same fetchers and the 20-item page size). Render:
- the empty state (Playfair 24px line + `--muted` body, no emoji) when there are no catches;
- `const { featured, rest } = pickFeatured(catches, reactions, new Date())`;
- `<div className="grid grid-cols-2 lg:grid-cols-4 auto-rows-[220px] gap-4">` with the featured tile as `col-span-2 row-span-2` and the rest as single tiles;
- a "load more" ghost pill button (`--raised` background) when `hasMore`;
- the records row: `computeRecords(catches, new Date())` in a `grid sm:grid-cols-3 gap-4 mt-10`. Each record is a `--surface` panel with a `--muted` 13px label, a 30px semibold value, and a 13px `--muted` detail. Heaviest shows "31.0 kg" with "Sábalo · Barra del Colorado". Top species shows "Dorado · 23". The week count is the number. A missing record shows `—`.

- [ ] **Step 8: Wire the page**

In `community/page.tsx`, keep the data loading. Replace `CommunityContent` with a page header (`<h1>` `t("title")` Playfair 900 52px, subtitle `t("subtitle", { count })` where `count` comes from `computeRecords(catches, new Date()).weekCount`) and a client `CommunityTabs` component, defined in `magazine-grid.tsx` and exported from it. It holds `tab: "all" | "groups"` and renders the chips plus `<MagazineGrid feedType="global" initialCatches={catches} …/>` or `<MagazineGrid feedType="allGroups" initialCatches={groupFeedCatches} …/>`. Show the "Mis grupos" chip only when `groups.length > 0`. Keep `NoGroupsCard`, restyled with tokens (no ring, no emoji, no `text-primary` classes), under the grid when the user has no groups. Keep `MyGroupsBar` above the chips.

- [ ] **Step 9: Verify**

Run: `npm run test -w @go-pesca/web && npm run lint -w @go-pesca/web && npm run build -w @go-pesca/web`. Open `/es/community` at 1440, 768 and 390.
Expected: the featured tile spans 2×2 on desktop and the full width on phone, tabs switch feeds, load more appends tiles, records show `—` when there is no data this month, and no location coordinates appear anywhere.

- [ ] **Step 10: Commit**

```bash
git add apps/web/src/lib/community-mosaic.ts apps/web/src/lib/community-mosaic.test.ts apps/web/src/components/feed apps/web/src/app/\[locale\]/community/page.tsx apps/web/src/messages
git commit -m "feat(web): community magazine mosaic with monthly records"
```

---

### Task 6: Catch form — steps with live preview card (option 1)

**Files:**
- Create: `apps/web/src/lib/catch-insight.ts`, `apps/web/src/lib/catch-insight.test.ts`
- Create: `apps/web/src/lib/species-bests-client.ts`
- Create: `apps/web/src/components/catches/catch-preview.tsx`
- Modify: `apps/web/src/components/catches/species-picker.tsx`
- Modify: `apps/web/src/components/catches/catch-form.tsx`
- Modify: `es.json`, `en.json` (`catches` block)

**Interfaces:**
- Produces: `type SpeciesBest = { speciesId: number; bestWeightKg: number | null }`.
- Produces: `type CatchInsight = { kind: "none" } | { kind: "new"; caughtAfter: number } | { kind: "record"; previousBestKg: number } | { kind: "known"; bestKg: number | null }`.
- Produces: `getCatchInsight(speciesId: number | null, weightKg: number | null, bests: SpeciesBest[]): CatchInsight`.
- Produces: `fetchSpeciesBests(): Promise<SpeciesBest[]>`. It runs client-side for the signed-in user and returns `[]` on error.
- `SpeciesPicker` props gain `onSpeciesMeta?: (meta: PickedSpecies) => void`, with `type PickedSpecies = { id: number; name: string; scientific_name: string; reference_photo_url: string | null }` exported from `species-picker.tsx`.
- Produces: `<CatchPreview photoUrl={string | null} species={PickedSpecies | null} weightKg={string} lengthCm={string} locationName={string} catchDate={string} bait={string} insight={CatchInsight} locale={string} />`.

- [ ] **Step 1: Write the failing tests**

`catch-insight.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { getCatchInsight } from "@/lib/catch-insight";

const bests = [{ speciesId: 7, bestWeightKg: 8.4 }, { speciesId: 10, bestWeightKg: null }];

describe("getCatchInsight", () => {
  it("is none without a species", () => {
    expect(getCatchInsight(null, 5, bests)).toEqual({ kind: "none" });
  });
  it("flags a species not yet in the FishyDex", () => {
    expect(getCatchInsight(3, null, bests)).toEqual({ kind: "new", caughtAfter: 3 });
  });
  it("flags a personal record when heavier than the best", () => {
    expect(getCatchInsight(7, 9.1, bests)).toEqual({ kind: "record", previousBestKg: 8.4 });
  });
  it("is known when equal or lighter, or when there is no weight", () => {
    expect(getCatchInsight(7, 8.4, bests)).toEqual({ kind: "known", bestKg: 8.4 });
    expect(getCatchInsight(7, null, bests)).toEqual({ kind: "known", bestKg: 8.4 });
  });
  it("does not call a record when no previous weight exists", () => {
    expect(getCatchInsight(10, 2, bests)).toEqual({ kind: "known", bestKg: null });
  });
});
```

- [ ] **Step 2: Run them and see them fail**

Run: `npm run test -w @go-pesca/web -- catch-insight`
Expected: FAIL, module not found.

- [ ] **Step 3: Implement**

`catch-insight.ts`:

```ts
export type SpeciesBest = { speciesId: number; bestWeightKg: number | null };

export type CatchInsight =
  | { kind: "none" }
  | { kind: "new"; caughtAfter: number }
  | { kind: "record"; previousBestKg: number }
  | { kind: "known"; bestKg: number | null };

export function getCatchInsight(speciesId: number | null, weightKg: number | null, bests: SpeciesBest[]): CatchInsight {
  if (speciesId === null) return { kind: "none" };
  const match = bests.find((b) => b.speciesId === speciesId);
  if (!match) return { kind: "new", caughtAfter: bests.length + 1 };
  if (weightKg !== null && match.bestWeightKg !== null && weightKg > match.bestWeightKg) {
    return { kind: "record", previousBestKg: match.bestWeightKg };
  }
  return { kind: "known", bestKg: match.bestWeightKg };
}
```

- [ ] **Step 4: Run the tests and see them pass**

Run: `npm run test -w @go-pesca/web -- catch-insight`
Expected: 5 passed.

- [ ] **Step 5: Client fetch of bests**

`species-bests-client.ts`:

```ts
import { createClient } from "@/lib/supabase/client";
import type { SpeciesBest } from "./catch-insight";

export async function fetchSpeciesBests(): Promise<SpeciesBest[]> {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];
    const { data } = await supabase.from("catches").select("species_id, weight_kg").eq("user_id", user.id);
    const best = new Map<number, number | null>();
    for (const row of (data ?? []) as { species_id: number; weight_kg: number | null }[]) {
      const prev = best.get(row.species_id) ?? null;
      const w = row.weight_kg;
      best.set(row.species_id, w === null ? prev : prev === null ? w : Math.max(prev, w));
    }
    return [...best].map(([speciesId, bestWeightKg]) => ({ speciesId, bestWeightKg }));
  } catch {
    return [];
  }
}
```

- [ ] **Step 6: i18n keys**

Add to `catches` (Spanish shown): `"stepPhotoSpecies": "Foto y especie"`, `"stepPlaceDate": "Lugar y fecha"`, `"stepDetails": "Detalles"`, `"requiredHint": "Lo obligatorio es la foto, la especie y el lugar. El resto suma a tu bitácora."`, `"previewTitle": "Así quedará en tu bitácora"`, `"insightNewTitle": "Especie nueva para tu FishyDex"`, `"insightNewBody": "Con esta llegás a {count} especies."`, `"insightRecordTitle": "Nuevo récord personal"`, `"insightRecordBody": "Tu mejor era de {kg} kg."`, `"insightKnownTitle": "Ya está en tu FishyDex"`, `"insightKnownBody": "Tu mejor: {kg} kg."`, `"insightKnownNoWeight": "Todavía no registraste su peso."`, `"next": "Siguiente"`, `"back": "Atrás"`, `"searchSpecies": "Buscar entre {count} especies"`. Also move the hardcoded validation messages in `catch-form.tsx` (`"Por favor añade una foto…"`, etc.) into keys `"errorPhoto"`, `"errorSpecies"`, `"errorLocation"`.

- [ ] **Step 7: Species picker as a photo grid**

In `species-picker.tsx`, add `reference_photo_url` to the select and to the `Species` type. Replace the dropdown with an always-visible search field (pill, `--ground` background, search icon) and a `grid grid-cols-1 sm:grid-cols-2 gap-2` of option buttons. Each button is a 52px thumbnail (reference photo, or a FishMark silhouette when null) plus the name in Playfair 700 15px and `.sci-name` 11px. The selected option gets `--accent-soft` background and `box-shadow: inset 0 0 0 1.5px var(--accent)`. With an empty search, show the first 8 species. Keep `onChange(id)` and also call `onSpeciesMeta?.({ id, name, scientific_name, reference_photo_url })`.

- [ ] **Step 8: Preview card**

`catch-preview.tsx`, `"use client"`. A `--surface` panel, `lg:sticky lg:top-20`, padding 24px. It contains:
- the `t("previewTitle")` label in `--muted`;
- the photo (an `URL.createObjectURL` of the chosen file, created in the form and revoked on change) at 220px `object-fit: cover`, or a `--ground` box with a FishMark silhouette;
- the species name in Playfair 900 40px, or `—`;
- `.sci-name`;
- facts for weight, length and place (`—` when empty);
- a line with the bait and the date formatted with `toLocaleDateString(locale, { day: "numeric", month: "long" })`;
- the insight block: `new` and `record` on `--accent-soft` with `--accent-ink` text, `known` on `--ground` with `--muted` text, nothing for `none`.

- [ ] **Step 9: Rework the form layout**

In `catch-form.tsx`:
- Add state `const [bests, setBests] = useState<SpeciesBest[]>([])` loaded once with `fetchSpeciesBests()` in the existing `useEffect`, plus `const [speciesMeta, setSpeciesMeta] = useState<PickedSpecies | null>(null)` and `const [photoUrl, setPhotoUrl] = useState<string | null>(null)`, set from `photo` in an effect that revokes the previous URL.
- Compute `const insight = getCatchInsight(speciesId, weightKg ? Number(weightKg) : null, bests)`.
- Wrap the form in `grid lg:grid-cols-[7fr_5fr] gap-12 items-start`. The left column holds the page header (`<h1>` `t("newCatch")` Playfair 900 52px + `t("requiredHint")`), the step bar, and the existing step bodies inside a `--surface` panel. The right column holds `<CatchPreview …/>` (hidden below `lg`; on phone, show only the insight block above the Next button).
- Step bar: three buttons in a flex row. Each has a 3px top border: `--accent` and semibold `--text` for the current step, `--text` for done steps, `--raised` with `--muted` text for later steps. Clicking a done step goes back to it. Clicking a later step runs the same validation as Next.
- Restyle inputs to 42px with `--ground` background, radius `var(--r-control)` and focus `box-shadow: inset 0 0 0 1.5px var(--accent)`. Turn weather/tide/time-of-day selects into segmented controls: a `--ground` pill track, with the active segment on `--surface` with semibold text. Keep the stored values identical (`"Soleado"`, `"Marea Alta"`, …) so `submitCatch` and existing rows still match.
- Actions row: ghost "Atrás" (hidden on step 1) and accent "Siguiente" or "Guardar captura" on step 3. Keep `submitting`, `error`, the achievements call and the redirect unchanged.

- [ ] **Step 10: Verify**

Run: `npm run test -w @go-pesca/web && npm run lint -w @go-pesca/web && npm run build -w @go-pesca/web`. In the browser on `/es/catches/new`:
1. Pick a photo and a species you have never caught. The preview shows "Especie nueva para tu FishyDex".
2. Pick a species you have caught and enter a weight above your best. It shows "Nuevo récord personal".
3. Complete all 3 steps and save. The catch appears on Home and in Community, and achievements still pop.
4. Check at 390px that the preview is hidden, the insight shows, and the segmented controls fit without horizontal scroll.

- [ ] **Step 11: Commit**

```bash
git add apps/web/src/lib/catch-insight.ts apps/web/src/lib/catch-insight.test.ts apps/web/src/lib/species-bests-client.ts apps/web/src/components/catches apps/web/src/messages
git commit -m "feat(web): catch form with live preview card and FishyDex insight"
```

---

### Task 7: Sweep, quality gate and docs

**Files:**
- Modify: any remaining screens flagged by the sweep (catches list/detail, species, profile, groups, achievements, auth)
- Modify: `brain/Wiki/design-system.md`
- Update memory note `redesign-direction-field-guide` (mark as implemented)

- [ ] **Step 1: Sweep for leftovers**

Run each command and fix every hit with tokens or the shared classes:

```bash
grep -rn "material-symbols\|font-fredoka\|text-gradient\|linear-gradient\|radial-gradient\|dark:" apps/web/src --include=*.tsx
grep -rnE "letterSpacing: \"0\.(0[6-9]|1)\w*\"" apps/web/src --include=*.tsx   # tracked tiny caps
grep -rnE "[\"'](Salada|Dulce|Salobre|hoy|ayer|Capturas|Últimas capturas|Ver todas)[\"']" apps/web/src --include=*.tsx  # hardcoded copy
grep -rn "transition-all" apps/web/src --include=*.tsx
```

Uppercase micro-labels become sentence case 12-13px `--muted`. Habitat labels and relative dates go through `t()` (add `common.habitat.saltwater` etc. and `common.today`, `common.yesterday`, `common.daysAgo`).

- [ ] **Step 2: Remove the legacy Material Symbols CSS**

Delete the `.material-symbols-outlined` block in `globals.css` once Step 1 shows no users.

- [ ] **Step 3: Design and accessibility check**

Run `/impeccable audit apps/web` and `/review-animations`. Fix every blocker they report. Then check by hand at 1440, 768 and 390 on Home, FishyDex, Community, New catch, Catch detail, Species, Profile and Login: no horizontal scroll, headings at most two lines, text contrast ≥ 4.5:1 (`--muted` on `--ground` is about 6:1; `--faint` is for non-essential captions only), visible focus on every control, and reduced motion removes the tile zoom.

- [ ] **Step 4: Full check**

Run: `npm run test -w @go-pesca/web && npm run lint -w @go-pesca/web && npm run build -w @go-pesca/web`
Expected: all pass.

- [ ] **Step 5: Docs**

Update `brain/Wiki/design-system.md` with the v3 tokens, the type roles (Playfair for names, titles and italic scientific names; Inter for UI) and the component patterns: top bar, footer, species plate, index row, magazine tile, preview card. Add a line to `brain/Wiki/features.md` under Web for the redesign.

- [ ] **Step 6: Commit and open the PR**

```bash
git add -A apps/web/src DESIGN.md brain/Wiki
git commit -m "chore(web): field guide sweep, remove legacy styles, update docs"
git push -u origin HEAD
gh pr create --base develop --title "Field guide redesign (web)" --body "$(cat <<'EOF'
Redesigns the web app in the approved "Guía de campo" direction.

- Light field-guide tokens, Playfair + Inter
- Top bar, editorial footer, phone nav with centre add button
- Home: latest species hero, FishyDex band, recent catches
- FishyDex: alphabetical index with species plate
- Community: magazine mosaic with monthly records
- New catch: steps with live preview and FishyDex insight
- Vitest added for pure data helpers

Mocks: https://claude.ai/artifact/YXYivDUfFHX9Tm9Yqk3JqJ · https://claude.ai/artifact/CDbYxfr6vULnBKhgRcruoG

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```
