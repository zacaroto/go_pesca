---
artifact_contract: ce-unified-plan/v1
artifact_readiness: requirements-only
product_contract_source: ce-brainstorm
title: Mobile Bottom Navigation Bar - Plan
type: feat
date: 2026-08-07
---

# Mobile Bottom Navigation Bar - Plan

## Goal Capsule

- **Objective:** Add a fixed bottom tab bar on mobile screens so authenticated users can navigate between the app's core sections without relying on the hidden desktop nav.
- **Product authority:** Kevin Santamaria
- **Open blockers:** None

---

## Product Contract

### Summary

The mobile navigation is currently absent — the desktop nav links in the header use `hidden sm:flex` and nothing replaces them on smaller screens. This adds a fixed bottom tab bar visible on mobile viewports (`< 640px`) for authenticated users, providing one-tap access to Pokedex, Catches, Species, and a prominent "New Catch" action.

### Problem

On mobile, logged-in users have no visible navigation. The only way to switch sections is typing URLs or using the browser back button. For an app used primarily on phones (fishermen out on the water), this makes core features unreachable.

### Target User

Authenticated Go Pesca users on mobile devices.

### Requirements

- R1. A fixed bottom tab bar appears on screens below the `sm` breakpoint (< 640px) for authenticated users only.
- R2. The bar contains 4 tabs: Pokedex, Catches, Species, and "+ New Catch."
- R3. Each tab displays an icon and a short label.
- R4. The active tab is visually highlighted based on the current route.
- R5. The "+ New Catch" tab is visually distinct (accent color, filled style) as the primary action.
- R6. The bar does not appear on auth pages (login, register) or when the user is not logged in.
- R7. Page content has sufficient bottom padding so the bar does not obscure content.
- R8. The bar is hidden on `sm` and larger viewports where the existing header nav is visible.
- R9. Tab labels are translated via the existing i18n setup (es/en).

### Key Decisions

- **Bottom tab bar over hamburger menu** — the app has exactly 3 destinations + 1 action, which is the sweet spot for a tab bar. A hamburger hides navigation behind an extra tap, adding friction for an app used outdoors on the water.
- **Mobile-only complement** — the existing desktop header nav (`hidden sm:flex`) remains unchanged. The bottom bar is its mobile counterpart, not a replacement.
- **"+ New Catch" as a tab, not a FAB** — keeping it inline with tabs is simpler and avoids z-index/overlap issues. It's visually distinct through color and styling.

### Acceptance Criteria

- AE1. On a mobile viewport (< 640px), an authenticated user sees a fixed bottom bar with 4 tabs: Pokedex, Catches, Species, + New Catch.
- AE2. Tapping each tab navigates to the correct route.
- AE3. The current section's tab is visually highlighted.
- AE4. The "+ New Catch" tab stands out with accent styling.
- AE5. On desktop (>= 640px), the bottom bar is not visible.
- AE6. Unauthenticated users and auth pages do not show the bottom bar.
- AE7. No page content is hidden behind the bar — scrolling reaches the bottom.
- AE8. Tab labels display in the active locale (Spanish or English).

### Scope Boundaries

#### Out of Scope

- Redesigning the desktop header nav
- Swipe gestures or tab transition animations
- Badge counts or notification indicators on tabs
- Haptic feedback or advanced mobile interactions
