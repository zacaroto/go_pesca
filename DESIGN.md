---
name: "Go Pesca Design System"
version: "3.0.0"
theme: "Field Guide — paper, ink and cobalt"
description: "Light field-guide design system for Go Pesca — a social fishing log and digital FishyDex for anglers in Costa Rica. Paper ground, ink text, one cobalt hue."

tokens:
  # Source of truth: apps/web/src/app/globals.css
  elevation:
    ground:   "#f4f5f7"   # --ground  — page background
    surface:  "#ffffff"   # --surface — cards, sheets
    raised:   "#e9ebf0"   # --raised  — inputs, hover, tabs

  borders:
    border:   "#e2e4ea"   # --border
    rule:     "#e2e4ea"   # --rule

  text:
    text:     "#0e1424"   # --text
    muted:    "#545b6b"   # --muted
    faint:    "#858b99"   # --faint

  accent:
    accent:      "#0f2f6b"  # --accent      — deep navy: actions, links, active states only
    accent-hi:   "#0b2455"  # --accent-hi   — hover/pressed
    accent-soft: "#e6ecf7"  # --accent-soft — selected backgrounds
    accent-ink:  "#0f2f6b"  # --accent-ink
    progress:    "#14b8a6"  # --progress    — turquoise: rank ring, carousel, bars (never text)

  silhouette: "#c5c9d3"     # --silhouette — uncaught species outlines

  status:
    positive: "#15803d"
    negative: "#c4242a"

  habitat-pills:
    salt:  { bg: "#e0eef5", ink: "#0e4f6e" }
    fresh: { bg: "#e8f5ec", ink: "#14532d" }
    brack: { bg: "#f1ede2", ink: "#6b5320" }
    trophy: { bg: "#fbefc8", ink: "#7a5300", soft: "#fdf8e8" }

  footer:
    footer-bg: "#0e1424"
    footer-text: "#e8e8e6"
    footer-muted: "#9a9c9f"
    footer-link-hover: "#5eead4"

  shape:
    r-card: "4px"
    r-pill: "999px"
    r-control: "6px"
    gap: "16px"
    pad: "24px"

  typography:
    display: "Libre Caslon Display, Georgia, serif"  # h1 and .font-display — titles, big names (400 only)
    heading: "Libre Caslon Text, Georgia, serif"      # .font-serif-display — names, numbers, sci names (400/700)
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

Go Pesca is a **light, field-guide** fishing log and social platform for anglers in Costa Rica. It reads like a printed naturalist's guide: calm, precise and trustworthy.

**Aesthetic:** Cool paper ground, navy ink, deep navy for actions only, turquoise for progress and gold for trophies. Libre Caslon Display carries page titles and big names, Libre Caslon Text carries names, numbers and italic scientific names; Inter carries all UI.

---

## Rules (Hard Constraints)

- **Light only; one hue (cobalt) on actions, active states and the main data element.** No `dark:` prefixes, no conditional themes (`dark:` classes are neutralized by `@custom-variant dark` in globals.css and must not be added).
- **One accent hue: cobalt.** `var(--accent)` for interactive elements, `var(--accent-hi)` for hover/pressed states. No coral, no amber, no secondary hues except habitat pills.
- **No hardcoded color values.** Always `var(--token)` — never `#hex` or `rgb()` inline.
- **No Material Symbols font.** Removed in redesign. All icons must be inline SVGs (`aria-hidden="true"`, `w-5 h-5` default).
- **No Fredoka, no Nunito.** Libre Caslon (Display + Text) for headings/species names, Inter for all UI. No Playfair.
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
| Label | Inter | 12–13px | 500, sentence case, `--muted` |
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
borderRadius: var(--r-control)
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
background: var(--negative)
color: white
borderRadius: var(--r-control)
```

### Selected State (weather/tide chips, toggles)
```
selected:   background: var(--accent-soft), border: 1px solid var(--accent), color: var(--accent-hi)
unselected: background: var(--raised), color: var(--muted)
```

### Error State
```
background: color-mix(in srgb, var(--negative) 10%, var(--surface))
color: var(--negative)
border: 1px solid color-mix(in srgb, var(--negative) 30%, var(--surface))
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

## What Changed (v1 to v2 to v3)

| v1 | v2 | v3 |
|----|-----|-----|
| Fredoka + Nunito | Playfair Display + Inter | Same, adds 500 weight and italic |
| Light background `#FEF9F2` | Obsidian ground `#09090b` | Paper ground `#f7f7f5` |
| Ocean blue + coral + amber accents | Cobalt only | Cobalt `#1d4ed8` on actions and main data |
| `chunky-border`, `gradient-sunset` | Clean borders, no gradients | Same; 4px cards, 6px controls |
| Glassmorphism, shadows | Flat dark elevation | Flat light elevation; shadows only on floating menus |
| Material Symbols font | Inline SVGs | Same |
| Gamified cartoon feel | Professional outdoor tool | Printed field guide |
| Emoji in buttons | Text + SVG icons | Same; no uppercase tracked labels |
