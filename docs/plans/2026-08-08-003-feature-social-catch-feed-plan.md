---
artifact_contract: ce-unified-plan/v1
artifact_readiness: implementation-ready
product_contract_source: ce-brainstorm
title: Social Catch Feed - Plan
type: feat
date: 2026-08-08
execution: code
---

# Social Catch Feed - Plan

## Goal Capsule

- **Objective:** Add the first social layer to Go Pesca — a public catch feed with emoji reactions that transforms the app from a solo logger into a community experience.
- **Product authority:** Kevin (sole developer/product owner)
- **Open blockers:** None
- **Execution profile:** Feature addition to existing Next.js + Supabase app. 5 implementation units, dependency-ordered.
- **Tail ownership:** Developer ships when all units pass verification and Definition of Done criteria are met.

---

## Product Contract

### Problem

Go Pesca is currently a solo experience. Users log catches and build their Pokedex in isolation. There's no way to see what others are catching, no reason to open the app when you're not fishing, and no social motivation to log more catches. A community feed creates visibility, engagement, and a reason to come back daily.

### Primary Actor

Recreational fishers in Costa Rica who already use Go Pesca to log catches.

### Desired Outcome

Users can browse a chronological feed of catches from the entire community, react with fishing-themed emojis, and feel part of a fishing community — driving engagement and retention.

### Key Decisions

1. **Public by default with opt-out** — Catches appear in the feed automatically. Users can toggle individual catches to private.
2. **General area, not exact GPS** — The feed shows `location_name` (user-entered text like "Playa Herradura" or "Lago Arenal"), never exact coordinates. No GPS-to-region mapping needed — the existing field already serves this purpose.
3. **Reactions only, no comments** — 5 fishing-themed emoji reactions keep interaction lightweight and fun.
4. **No public profiles yet** — Tapping a username does nothing. Profiles are a future feature.
5. **Chronological feed, no algorithm** — Simple reverse-chronological order with "Load more" pagination.

### User Stories

**US-1: Browse the community feed**
**US-2: Toggle catch visibility (public/private)**
**US-3: React to a catch (one reaction per user per catch)**
**US-4: See reactions on my catches (feed + catch detail)**
**US-5: Access feed from navigation (mobile bottom nav + desktop header)**

### Scope Boundaries

**In scope:** Community feed page, per-catch public/private toggle, location_name display (no GPS), 5 emoji reactions, reaction counts, mobile bottom nav tab, bilingual UI.

**Out of scope:** Comments, follows, public profiles, algorithmic ranking, push notifications, sharing outside app, feed for non-logged-in users.

---

## Planning Contract

### Key Technical Decisions

- KTD1. **`is_public` boolean on `catches` table** — defaults to `true`. A simple column addition with a migration. Existing catches become public automatically. RLS policy allows any authenticated user to read public catches.
- KTD2. **`catch_reactions` table** — stores `(user_id, catch_id, reaction_type)` with a unique constraint on `(user_id, catch_id)`. One reaction per user per catch; changing reaction = update, removing = delete.
- KTD3. **`location_name` for feed location** — use the existing user-entered `location_name` field directly. No GPS coordinate mapping needed. If `location_name` is null, show nothing for location. GPS coordinates are never sent to the client in feed queries.
- KTD4. **"Load more" pagination** — matches existing app patterns better than infinite scroll. Load 20 catches per page, cursor-based using `created_at`.
- KTD5. **Bottom nav reorganization** — Replace the Achievements tab with Community in the bottom nav (4 tabs + New Catch = 5 items). Achievements remains accessible from the user menu/header on desktop and from the profile/settings area. This avoids the 6-tab overflow problem.
- KTD6. **Profiles RLS update** — The feed needs to show `display_name` from other users' profiles. Add a new SELECT policy: "Anyone authenticated can read display_name" (limited columns via the query, not a blanket read policy — use a Postgres view or just select specific columns in the query).

### High-Level Technical Design

```
New tables/columns:
  catches.is_public (boolean, default true)
  catch_reactions (user_id, catch_id, reaction_type, created_at)

New RLS policies:
  catches: "Authenticated users can view public catches" (SELECT where is_public = true)
  catch_reactions: users can CRUD own reactions, read all reactions on public catches
  profiles: "Authenticated users can read display names" (SELECT on id, display_name)

New pages:
  /[locale]/community/page.tsx — feed page (server component for initial load)

New components:
  feed/feed-list.tsx — scrollable list with "load more"
  feed/feed-card.tsx — catch card for the feed (photo, species, angler, location, date, reactions)
  feed/reaction-bar.tsx — emoji reaction row with tap-to-react

Modified files:
  catch-form.tsx — add is_public toggle
  catch-edit-form.tsx — add is_public toggle
  bottom-nav.tsx — replace achievements with community
  header.tsx — add community link
  catches.ts — add is_public to submit/update, add feed queries
  en.json / es.json — new translation keys
  database.types.ts — regenerate with new schema
```

### Assumptions

- Supabase free tier handles the additional RLS queries without performance issues at current user scale.
- The `location_name` field contains meaningful location text in most catches (falls back to showing no location if null).

---

## Implementation Units

### U1. Database migration — is_public, catch_reactions, RLS policies

- **Goal:** Add the `is_public` column to catches, create the `catch_reactions` table, and set up all necessary RLS policies for the social feed.
- **Requirements:** Foundation for US-1 through US-4.
- **Dependencies:** None
- **Files:**
  - `supabase/migrations/008_social_feed.sql`
- **Approach:**
  1. Add `is_public boolean not null default true` to `catches` table.
  2. Create `catch_reactions` table:
     ```sql
     create table public.catch_reactions (
       id uuid primary key default gen_random_uuid(),
       user_id uuid not null references auth.users(id) on delete cascade,
       catch_id uuid not null references public.catches(id) on delete cascade,
       reaction_type text not null check (reaction_type in ('fish', 'fire', 'trophy', 'wow', 'respect')),
       created_at timestamptz default now(),
       unique (user_id, catch_id)
     );
     ```
  3. RLS on `catch_reactions`: authenticated users can read all reactions on public catches, CRUD their own reactions.
  4. New RLS policy on `catches`: "Authenticated users can view public catches" — `for select using (is_public = true and auth.uid() is not null)`. This coexists with the existing "Users can view own catches" policy (OR logic).
  5. New RLS policy on `profiles`: "Authenticated users can read any display name" — `for select using (auth.uid() is not null)`. This coexists with the existing "Users can view own profile" policy.
  6. Indexes: `catch_reactions(catch_id)`, `catches(is_public, created_at desc)`.
- **Test scenarios:**
  - Migration applies cleanly on top of existing schema (001-007)
  - User A can read User B's catch when `is_public = true`
  - User A cannot read User B's catch when `is_public = false`
  - User can insert/update/delete their own reactions
  - User cannot modify another user's reactions
  - Authenticated user can read any profile's display_name
  - Existing catches default to `is_public = true`
- **Verification:** `supabase db push` succeeds. Verify RLS with SQL test queries in Supabase dashboard.

---

### U2. Feed data layer and queries

- **Goal:** Create the server-side queries for fetching the community feed and managing reactions.
- **Requirements:** US-1, US-3, US-4.
- **Dependencies:** U1
- **Files:**
  - `src/lib/feed.ts`
  - `src/lib/database.types.ts` (regenerate)
  - `src/lib/catches.ts` (update submitCatch and updateCatch to include is_public)
- **Approach:**
  1. `fetchFeedCatches(cursor?: string, limit = 20)` — server-side query joining `catches` (where `is_public = true`) with `species` (for name) and `profiles` (for display_name). Returns: `id, photo_url, species_name, display_name, location_name, catch_date, created_at`. **Never returns `latitude` or `longitude`**. Ordered by `created_at DESC`. Cursor-based pagination using `created_at < cursor`.
  2. `fetchReactionsForCatches(catchIds: string[])` — batch fetch reaction counts grouped by `(catch_id, reaction_type)`, plus the current user's reaction per catch.
  3. `toggleReaction(catchId: string, reactionType: string)` — client-side function. If user has no reaction on this catch, insert. If same type, delete. If different type, update.
  4. Update `submitCatch` to accept and pass `isPublic` (default `true`).
  5. Update `updateCatch` to accept and pass `isPublic`.
- **Patterns to follow:** Existing query patterns in `catches.ts` and `pokedex.ts`. Server client via `createClient()` from `@/lib/supabase/server`.
- **Test scenarios:**
  - `fetchFeedCatches` returns only public catches from all users
  - `fetchFeedCatches` never returns latitude/longitude fields
  - `fetchFeedCatches` with cursor returns next page of results
  - `fetchReactionsForCatches` returns correct counts per emoji type
  - `toggleReaction` inserts when no existing reaction
  - `toggleReaction` deletes when same reaction type
  - `toggleReaction` updates when different reaction type
  - `submitCatch` with `isPublic: false` creates a private catch
- **Verification:** Call queries from a test page or server action and verify correct data shape and pagination.

---

### U3. Community feed page and components

- **Goal:** Build the feed page with catch cards, emoji reactions, and "Load more" pagination.
- **Requirements:** US-1, US-3, US-4.
- **Dependencies:** U2
- **Files:**
  - `src/app/[locale]/community/page.tsx`
  - `src/components/feed/feed-list.tsx`
  - `src/components/feed/feed-card.tsx`
  - `src/components/feed/reaction-bar.tsx`
  - `src/messages/es.json` (add `feed` section)
  - `src/messages/en.json` (add `feed` section)
- **Approach:**
  1. **`community/page.tsx`** — Server component. Fetches initial 20 catches + reactions. Passes to `FeedList`. Page title: "Comunidad" / "Community".
  2. **`FeedList`** — Client component. Renders list of `FeedCard`s. "Load more" button at bottom that fetches next page via client-side Supabase call. Shows empty state when no catches exist yet.
  3. **`FeedCard`** — Displays: catch photo (large, card-style), species name (locale-aware), angler display_name (plain text, not a link), location_name (if present), catch date, and `ReactionBar`. Card design similar to existing `CatchCard` but larger photo and horizontal layout for reactions.
  4. **`ReactionBar`** — Row of 5 emoji buttons with counts. Each button shows the emoji + count. User's active reaction is highlighted (filled/colored). Tap to toggle. Optimistic UI update on tap with rollback on error. Reaction types: `fish` 🐟, `fire` 🔥, `trophy` 🏆, `wow` 😮, `respect` 🎣.
  5. **Translations** — Add `feed` section to both message files:
     ```json
     "feed": {
       "title": "Comunidad",
       "empty": "Aún no hay capturas. ¡Sé el primero!",
       "loadMore": "Ver más",
       "reactions": {
         "fish": "Buena pesca",
         "fire": "Fuego",
         "trophy": "Trofeo",
         "wow": "Wow",
         "respect": "Respeto"
       }
     }
     ```
- **Patterns to follow:** Existing card designs in `catch-card.tsx` and `pokedex-card.tsx`. Tailwind styling consistent with current theme (cyan accents, rounded-2xl cards, dark mode support).
- **Test scenarios:**
  - Feed page renders with initial batch of public catches
  - "Load more" loads additional catches and appends to list
  - Empty state shown when no public catches exist
  - FeedCard displays all required fields (photo, species, angler, location, date)
  - FeedCard does NOT display GPS coordinates anywhere
  - ReactionBar shows correct counts per emoji
  - Tapping an emoji adds the user's reaction (optimistic update)
  - Tapping the same emoji removes the reaction
  - Tapping a different emoji switches the reaction
  - User's active reaction is visually highlighted
  - All text is bilingual (switch locale and verify)
- **Verification:** Browse the feed, react to catches, switch locales, verify reactions persist after page reload.

---

### U4. Privacy toggle on catch form

- **Goal:** Add the is_public toggle to both the new catch form and the edit catch form.
- **Requirements:** US-2.
- **Dependencies:** U2
- **Files:**
  - `src/components/catches/catch-form.tsx` (update)
  - `src/app/[locale]/catches/[id]/page.tsx` (update edit form if inline)
  - `src/messages/es.json` (add keys)
  - `src/messages/en.json` (add keys)
- **Approach:**
  1. Add `isPublic` state to `CatchForm`, defaulting to `true`.
  2. Add a toggle/switch in the form, placed after the optional fields section (before the submit button). Label: "Visible en comunidad" / "Visible in community". Small helper text: "Tu captura aparecerá en el feed de la comunidad" / "Your catch will appear in the community feed".
  3. Pass `isPublic` to `submitCatch()`.
  4. For the edit flow: load the current `is_public` value and allow toggling. Pass to `updateCatch()`.
  5. Style as a simple toggle switch consistent with the app's design.
- **Translations:**
  ```json
  "catches": {
    ...existing keys...
    "isPublic": "Visible en comunidad",
    "isPublicHelp": "Tu captura aparecerá en el feed"
  }
  ```
- **Test scenarios:**
  - New catch form shows toggle defaulting to ON (public)
  - Toggling OFF and submitting creates a catch with `is_public = false`
  - Catch does not appear in community feed when private
  - Edit form loads current is_public state
  - Toggling in edit form updates the catch visibility
- **Verification:** Create a public catch (verify it appears in feed), create a private catch (verify it doesn't), edit a public catch to private (verify it disappears from feed).

---

### U5. Navigation update — add Community tab

- **Goal:** Add the Community tab to mobile bottom nav and desktop header navigation.
- **Requirements:** US-5.
- **Dependencies:** U3
- **Files:**
  - `src/components/layout/bottom-nav.tsx` (update)
  - `src/components/layout/header.tsx` (update)
  - `src/messages/es.json` (add nav key)
  - `src/messages/en.json` (add nav key)
- **Approach:**
  1. **Bottom nav:** Replace the `achievements` tab with `community` (href: `/community`, icon: a people/globe icon). This keeps the nav at 4 tabs + New Catch = 5 items, avoiding overflow. Achievements is still accessible from the header on desktop and can be linked from the user menu or profile area.
  2. **Header:** Add "Comunidad" / "Community" link to the desktop navigation alongside existing links.
  3. **Translations:** Add `"community": "Comunidad"` to `nav` section in `es.json`, `"community": "Community"` in `en.json`.
  4. Bottom nav tab order: Pokedex, Catches, Community, Species, + New Catch.
- **Patterns to follow:** Existing tab structure in `bottom-nav.tsx`. Same icon style (Heroicons outline/fill toggle).
- **Test scenarios:**
  - Mobile bottom nav shows Community tab with icon
  - Tapping Community tab navigates to `/community`
  - Community tab highlights when active
  - Desktop header shows Community link
  - Achievements is no longer in bottom nav but still accessible
  - No overflow or layout issues on mobile with the 5 items
- **Verification:** Test on mobile viewport: all 5 items fit without overflow. Desktop header includes Community link. Navigation works correctly in both locales.

---

## Verification Contract

| Gate | Command / Check | Applies to |
|---|---|---|
| Migration | `supabase db push` — no errors | U1 |
| Dev server | `npm run dev` — no errors, pages load | All units |
| TypeScript | `npx tsc --noEmit` — no type errors | All units |
| Build | `npm run build` — production build succeeds | All units |
| RLS | Verify public catch reads, private catch blocks, reaction CRUD | U1 |
| Feed | Browse feed, verify cards render with correct data | U3 |
| Reactions | Add/change/remove reactions, verify persistence | U3 |
| Privacy | Toggle catch visibility, verify feed inclusion/exclusion | U4 |
| GPS privacy | Verify no latitude/longitude in feed API responses | U2, U3 |
| Navigation | Bottom nav shows Community, no overflow on mobile | U5 |
| i18n | Toggle locale on all new UI — all text switches | U3, U4, U5 |

---

## Definition of Done

- All 5 implementation units complete and pass verification
- TypeScript compiles with no errors (`npx tsc --noEmit`)
- Production build succeeds (`npm run build`)
- Community feed shows public catches from all users with correct data
- Reactions work: add, change, remove, counts update correctly
- Privacy toggle works: private catches never appear in feed
- No GPS coordinates exposed in feed (only location_name)
- Bottom nav fits 5 items without overflow on mobile
- All new UI text available in both Spanish and English
- Existing functionality (Pokedex, catches, achievements) unaffected
