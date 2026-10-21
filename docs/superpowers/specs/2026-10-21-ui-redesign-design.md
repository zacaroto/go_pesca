# Go Pesca — UI Redesign Design Spec
**Date:** 2026-10-21
**Branch:** `develop`
**Status:** Approved by Kevin Santamaria

---

## Goal

Replace the current "Tropical Collector's Voyage" design system (gamified gradients, glassmorphism, holographic borders, rainbow palettes) with a disciplined, human-feeling UI that does not read as AI-generated. The new look is outdoor/rugged, monocromo with a single cobalt blue accent, editorial serif typography for key content, and Inter for the interface.

---

## Design Direction

**Style:** True-black flat (dark) — from `design-taste-frontend` direction sheet
**Kind:** Community app screens
**Skills applied:** `design-taste-frontend`, `impeccable bolder`, `impeccable delight`, `find-animation-opportunities`, `emil-design-eng`

**The idea:** On this app, *the weight of the fish* — the bragging number every angler carries in their head — becomes the hero of every card.

---

## Design Tokens

```css
:root {
  --ground:    #09090b;    /* warm near-black */
  --surface:   #141416;    /* cards */
  --raised:    #222225;    /* nested panels, hover states */
  --border:    #1e1e21;
  --rule:      #19191c;    /* row rules inside lists */
  --text:      #f4f4f5;
  --muted:     #a1a1aa;
  --faint:     #71717a;
  --accent:    #2563EB;    /* cobalt — the only hue */
  --accent-hi: #3B82F6;    /* accent on data, active states */
  --positive:  #22c55e;
  --negative:  #ef4444;

  /* Habitat pills */
  --pill-salt-bg:   rgba(37,99,235,0.14);
  --pill-salt-ink:  #93bbfd;
  --pill-fresh-bg:  rgba(34,197,94,0.12);
  --pill-fresh-ink: #4ade80;
  --pill-brack-bg:  rgba(245,158,11,0.13);
  --pill-brack-ink: #fbbf24;

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
}
```

---

## Typography

| Role | Font | Size | Weight | Notes |
|---|---|---|---|---|
| Wordmark | Playfair Display | 17px | 900 | With cobalt dot separator |
| Greeting headline | Playfair Display | 28px | 900 | Name in italic accent color |
| Species name (card) | Playfair Display | 22px | 900 | On photo, with text-shadow |
| Species name (list/dex) | Playfair Display | 13px | 700 | Hero of each row/card |
| Rank name | Playfair Display | 16px | 700 | — |
| Catch weight (hero) | Inter | 28px | 700 | `tabular-nums`, letter-spacing -0.02em |
| KPI numbers | Inter | 26px | 700 | `tabular-nums` |
| Body / UI | Inter | 14px | 400/500 | — |
| Labels / chips | Inter | 10–12px | 500–600 | `letter-spacing: 0.06–0.12em`, uppercase |
| Meta / faint | Inter | 10–11px | 400/500 | Color: `--faint` |

**Rule:** No font sizes above Inter 600 weight for UI elements. Serif (Playfair Display) is reserved for content — species names, rank names, greeting.

---

## Shell & Navigation

**Mobile-first.** Bottom tab bar with 4 destinations: Inicio · Feed · FishyDex · Perfil.

**Active nav indicator:** 2px top border (cobalt) + icon/label color shift. Not just a color change — a structural signal.

**Top bar:** 52px, wordmark left, actions right. Wordmark: "Go·Pesca" with a 6px cobalt dot separator (Playfair Display 900).

**FAB:** Cobalt circle (+), 50px, positioned above bottom nav at `right: 18px`. Spring press feedback (scale 0.92 on `:active`), shadow that "breathes" (more at rest, less on press).

---

## Screens

### 1. Community Feed

**Pattern:** Filter chips → Catch cards (list)

**Filter chips:** No border on inactive. `background: transparent`. Active: `rgba(37,99,235,0.15)` fill + `--accent-hi` color. Transition: `color 180ms, background 180ms` (not `all`).

**Catch card layout:**
- Full-width photo (200px) with habitat gradient background
- Gradient fade overlay (bottom 85% → top 0%) on photo
- **Species name** (22px Playfair 900) overlaid on photo
- **Weight** (28px Inter 700) as the bragging number — protagonist, not metadata
- Habitat pill (salt/fresh/brack) inline with weight
- Below photo: location + time meta row, then user + reactions footer

**Catch card animation:** `card-in` — `opacity: 0; transform: translateY(8px)` → settled, `280ms ease-out`. Stagger: +60ms per card.

**Reaction buttons:** `height: 26px`, pill shape, `:active { transform: scale(0.90) }`, `transition: transform 120ms, background 120ms`.

---

### 2. FishyDex

**Pattern:** KPI strip → Rank card → Filter chips → 2-column species grid

**KPI strip:** 3-cell grid (capturadas / total / % completado). 26px tabular numbers. Accent color on "capturadas" count only.

**Rank card:** Icon emblem (star, cobalt outline) + rank name (Playfair 700) + progress bar. Progress bar animates from 0 to actual value on mount (`400ms ease-out`).

**Species grid:** 2 columns, 105px photo. Caught species: habitat gradient bg, cobalt `border: 1px solid rgba(37,99,235,0.3)`, cobalt badge (check icon). Uncaught: desaturated `filter: saturate(0) brightness(0.4)`, name = "Sin capturar" in italic faint color.

**Caught badge animation (delight):** `badge-pop` — spring-in from `scale(0) opacity(0)` → settled, `400ms ease-spring`. Fires only on first unlock (controlled by state, not on every mount).

**Dex card press:** `transform: scale(0.97)`, `transition: transform 120ms ease-out`.

---

### 3. Home — Mis Capturas

**Pattern:** Greeting → KPI strip → Recent catches list → Rank card → FAB

**Greeting:**
```
[Temporada lluviosa · Guanacaste]   ← 11px uppercase faint
Hola,
Kevin.                               ← "Kevin" in accent-hi italic
```
Uses Playfair Display 900, 28px, letter-spacing -0.02em.

**Recent catches list:** Card container (`--surface` bg, `--r-card` radius). Rows at 11px pitch. Each row: 42px habitat-gradient thumb + species name (Playfair 700 13px) + location + pill + weight (14px tabular) + relative time. Row `:active` → `background: --raised`.

**Section label:** Uppercase 10px faint + inline "Ver todas →" action in accent-hi. No empty ghost button.

---

## Animation Inventory (from `find-animation-opportunities`)

All passed the 4-question gate (Frequency / Purpose / Speed / Function):

| # | Element | Purpose | Duration | Notes |
|---|---|---|---|---|
| 1 | Catch card entrance | Preventing jarring change | 280ms ease-out | translateY(8px) + opacity stagger |
| 2 | Progress bar fill | State indication | 400ms ease-out | From 0 to actual % on mount |
| 3 | Dex badge pop | Delight (rare: first unlock) | 400ms ease-spring | Spring bounce, fires once |
| 4 | Reaction button press | Feedback | 120ms ease-out | scale(0.90) :active |
| 5 | Filter chip selection | State indication | 180ms ease-out | background + color crossfade |

**Rejected (failed gate):**
- Tab switch transition — too frequent (tens/day), would feel sluggish
- KPI number count-up animation — functional data being read; decoration hinders
- Bottom nav icon bounce — 100+/day, never animate per Emil's rule

---

## House Rules (from `impeccable` + `design-taste-frontend`)

**Never:**
- Gradients on UI chrome (only on content photo areas)
- Glows, neon borders, or drop shadows on cards at rest
- The accent on buttons, nav tabs, or general-purpose UI elements (only on data, active states, the caught badge)
- `transition: all` — always specify exact properties
- Emoji as placeholder photos in production
- `border-radius` 11–12px — use tight (4–8px controls) or soft (14–18px cards)

**Always:**
- `font-variant-numeric: tabular-nums` on every number that updates or aligns
- `:active` feedback on every tappable surface
- `min-width: 0` on text columns inside flex/grid to prevent overflow
- `white-space: nowrap; flex-shrink: 0` on badges and pills
- Species names in Playfair Display — the only non-Inter text in the UI
- `overflow-wrap: anywhere` on long strings (locations, usernames)

---

## What Changes vs. Current Design

| Current | New |
|---|---|
| Fredoka (rounded, playful heading font) | Playfair Display (editorial serif) |
| Nunito (rounded body) | Inter (precise, neutral) |
| Rainbow palettes (primary blue, accent orange, secondary mint, coral) | Single cobalt accent on black |
| Glassmorphism header | Solid `--surface` with 1px rule |
| Holographic card borders on caught species | `rgba(37,99,235,0.3)` border + cobalt badge |
| Gradient everything | Gradients only on catch photo areas (content) |
| Gamified color tokens | 2-tone elevation (ground → surface → raised) |
| Wave animations, glow effects | Functional animations only (see inventory above) |
| `FEF9F2` warm cream background (light) | `#09090b` near-black (dark, single theme) |

---

## Mockup Reference

Located at:
`.superpowers/brainstorm/66952-1792601606/content/screens-v2.html`

Covers: Community Feed, FishyDex, Home screens.

---

## Out of Scope

- Catch form / new catch flow
- Species detail page
- Achievements screen
- Profile/edit profile
- Groups feature
- Auth screens (login/register)
- Mobile app (Expo) — separate effort

These screens will be redesigned in follow-up branches using the same token set defined here.
