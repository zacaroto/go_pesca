---
name: "Go Pesca Design System"
version: "3.0.0"
theme: "Field Guide — paper, ink and cobalt"
description: "Light field-guide design system for Go Pesca — a social fishing log and digital FishyDex for anglers in Costa Rica. Paper ground, ink text, one cobalt hue."

tokens:
  # Source of truth: apps/web/src/app/globals.css
  elevation:
    ground:   "#f7f7f5"   # --ground  — page background
    surface:  "#ffffff"   # --surface — cards, sheets
    raised:   "#ececea"   # --raised  — inputs, hover, tabs

  borders:
    border:   "#e6e6e3"   # --border
    rule:     "#e6e6e3"   # --rule

  text:
    text:     "#121314"   # --text
    muted:    "#5c5f63"   # --muted
    faint:    "#8a8d91"   # --faint

  accent:
    accent:      "#1d4ed8"  # --accent      — actions, active states, main data element
    accent-hi:   "#1a43bd"  # --accent-hi   — hover/pressed
    accent-soft: "#eef2fd"  # --accent-soft — selected backgrounds
    accent-ink:  "#1a3a99"  # --accent-ink

  silhouette: "#c9cac6"     # --silhouette — uncaught species outlines

  status:
    positive: "#15803d"
    negative: "#c4242a"

  habitat-pills:
    salt:  { bg: "#eef2fd", ink: "#1a3a99" }
    fresh: { bg: "#e8f5ec", ink: "#14532d" }
    brack: { bg: "#fdf6e3", ink: "#7a4b0b" }

  footer:
    footer-bg: "#121314"
    footer-text: "#e8e8e6"
    footer-muted: "#9a9c9f"
    footer-link-hover: "#9db7ff"

  shape:
    r-card: "4px"
    r-pill: "999px"
    r-control: "6px"
    gap: "16px"
    pad: "24px"

  typography:
    heading: "Playfair Display, Georgia, serif"   # --font-serif — species names, page titles
    body:    "Inter, system-ui, sans-serif"        # --font-sans  — all UI text
    mono:    "ui-monospace, monospace"
    weights:
      normal:   400
      medium:   500
      semibold: 600
      bold:     700
      black:    900
    numeric: "tabular-nums"   # always on numbers

  motion:
    # Emil Kowalski philosophy — fast, physical, intentional
    ease-out:    "cubic-bezier(0.22, 1, 0.36, 1)"
    ease-spring: "cubic-bezier(0.34, 1.56, 0.64, 1)"
    t-press:  "120ms"   # button/tap press feedback
    t-ui:     "180ms"   # hover, state transitions
    t-enter:  "280ms"   # card/modal enter

  keyframes:
    card-in:   "opacity 0→1, translateY 8px→0"   # catch cards, feed cards
    badge-pop: "opacity 0→1, scale 0→1 (spring)" # FishyDex caught badge
---

# Go Pesca Design System v3 — Field Guide

## Identity

Go Pesca is a **professional, dark-themed** fishing log and social platform for anglers in Costa Rica. The design is inspired by high-end outdoor/fishing apps — dark, focused, and premium — not the cartoonish tropical aesthetic of v1.

**Aesthetic:** Obsidian surfaces + cobalt accent + warm typography. Like a carbon-fiber fishing reel: functional, precise, satisfying.

---

## Rules (Hard Constraints)

- **Light only; one hue (cobalt) on actions, active states and the main data element.** No `dark:` prefixes, no conditional themes.
- **One accent hue: cobalt.** `var(--accent)` for interactive elements, `var(--accent-hi)` for hover/pressed states. No coral, no amber, no secondary hues except habitat pills.
- **No hardcoded color values.** Always `var(--token)` — never `#hex` or `rgb()` inline.
- **No Material Symbols font.** Removed in redesign. All icons must be inline SVGs (`aria-hidden="true"`, `w-5 h-5` default).
- **No Fredoka, no Nunito.** Playfair Display for headings/species names, Inter for all UI.
- **`tabular-nums` on all numbers** — weights, dates, counts.
- **`overflow-wrap: anywhere`** on location and species text (long names on mobile).
- **`:active` feedback** on every tappable surface — `active:opacity-75` or `scale(0.95)` on `mousedown`.
- **`transition` — specify exact properties, never `transition-all`.**
- **All user-visible strings via `t()` from next-intl.** No hardcoded Spanish or English literals.

---

## House rules (v3)

- Playfair Display (species names, page and section titles, scientific names in italic) + Inter (all UI). No other faces.
- No gradients, no shadows on resting surfaces (shadows only on floating menus and sheets).
- No tiny uppercase letter-spaced labels, no pill badges above headings, no icon-in-tinted-square tiles.
- Icons are inline SVGs with `aria-hidden="true"`; no emoji in UI.
- Numbers use `font-variant-numeric: tabular-nums`; missing values show `—`, zero shows `0`.
- `transition` lists exact properties, never `transition-all`.
- Every tappable surface has hover, `:active` and `:focus-visible` states; honour `prefers-reduced-motion`.
- User-visible strings go through `t()` with keys in both es.json and en.json.
- The footer is the only dark surface and uses its own `--footer-*` tokens.

## Elevation System

Three levels, always light:

```
Ground  #f7f7f5  → page background
Surface #ffffff  → cards, sheets, modals
Raised  #ececea  → inputs, hover states, pills, tabs
```

Cards use `background: var(--surface)`, `border: 1px solid var(--border)`, `borderRadius: var(--r-card)`.

---

## Typography Scale

| Role | Font | Size | Weight |
|------|------|------|--------|
| Page title | Playfair Display | 28px | 900 |
| Species name | Playfair Display | 22px | 700 |
| Section heading | Playfair Display | 18px | 700 |
| Body text | Inter | 14–15px | 400 |
| Label (all-caps) | Inter | 10–11px | 500 uppercase |
| Caption / timestamp | Inter | 11–12px | 400 |
| Numbers | Inter | varies | 700 tabular-nums |

---

## Component Patterns

### Cards
```
background: var(--surface)
border: 1px solid var(--border)
borderRadius: var(--r-card)  /* 4px */
```

### Inputs / Text Fields
```
background: var(--raised)
border: 1px solid var(--border)
color: var(--text)
borderRadius: 8px
padding: 10px 12px
focus → borderColor: var(--accent)
```

### Primary Button (CTA)
```
background: var(--accent)
color: white
borderRadius: var(--r-card)
onMouseDown → scale(0.95), var(--t-press)
```

### Ghost Button
```
background: var(--raised)
color: var(--text)
border: 1px solid var(--border)
borderRadius: var(--r-card)
active → opacity-75
```

### Destructive Button
```
background: rgba(239,68,68,0.1)
color: #ef4444
border: 1px solid rgba(239,68,68,0.3)
borderRadius: var(--r-card)
```

### Selected State (weather/tide chips, toggles)
```
selected:   background: var(--accent-soft), border: 1px solid var(--accent), color: var(--accent-hi)
unselected: background: var(--raised), color: var(--muted)
```

### Error State
```
background: rgba(239,68,68,0.1)
border: 1px solid rgba(239,68,68,0.3)
color: #ef4444
```

---

## Habitat Pills

Use CSS classes from globals.css:

```html
<span class="pill-salt">  Saltwater  </span>  <!-- cobalt tint -->
<span class="pill-fresh"> Freshwater </span>  <!-- green tint  -->
<span class="pill-brack"> Brackish   </span>  <!-- amber tint  -->
```

Style all pills: `borderRadius: var(--r-pill)`, `padding: 2px 8px`, `fontSize: 11px`, `fontWeight: 600`.

---

## Icons

All icons are **inline SVGs**. No icon font, no external icon library required.
- Default size: `className="w-5 h-5"` (`20px`)
- Always add: `aria-hidden="true"`
- Reference pattern: `apps/web/src/components/layout/bottom-nav.tsx`

---

## Animations (Emil Kowalski Philosophy)

- **Press:** `scale(0.95)` on `mousedown`, restore on `mouseup` — `var(--t-press)` 120ms
- **Enter:** `card-in` keyframe — `opacity 0→1, translateY 8px→0` — `var(--t-enter)` 280ms
- **Badge pop:** `badge-pop` keyframe — `scale 0→1` with spring — `var(--ease-spring)`
- **Hover/state:** `var(--t-ui)` 180ms, `var(--ease-out)`
- Every transition must specify exact properties: `transition: background var(--t-ui) var(--ease-out)` ✓, `transition: all` ✗

---

## App Structure

```
/[locale]/             → Home feed + quick stats
/[locale]/catches      → Personal catch log (list)
/[locale]/catches/new  → Multi-step catch wizard
/[locale]/catches/[id] → Catch detail + map
/[locale]/pokedex      → FishyDex species grid
/[locale]/community    → Social feed
/[locale]/groups       → Fishing groups
/[locale]/species/[id] → Species encyclopedia
/[locale]/profile      → Angler profile + stats
```

---

## What Changed from v1 (Tropical Collector Voyage)

| v1 | v2 |
|----|-----|
| Fredoka + Nunito | Playfair Display + Inter |
| Light background `#FEF9F2` | Paper ground `#f7f7f5` (v3) |
| Ocean blue + coral + amber accents | Cobalt only |
| `chunky-border`, `gradient-sunset` | Clean borders, no gradients |
| Glassmorphism, shadows | Flat elevation |
| Material Symbols font | Inline SVGs |
| Gamified cartoon feel | Professional outdoor tool |
| Emoji in buttons | Text + SVG icons |
