# Code Review Guidelines — Go Pesca

## Project Context

Go Pesca is a Next.js App Router application (TypeScript) with Supabase as backend. It's a fishing social platform for Costa Rica with i18n support (Spanish primary, English secondary).

## Review Priorities (highest to lowest)

1. **Security** — No exposed secrets, SQL injection, XSS, or unsafe user input handling. Supabase RLS should be relied upon but not blindly trusted.
2. **Data integrity** — Mutations must handle errors gracefully. Never silently swallow errors that affect user data.
3. **Type safety** — Avoid `any` types. Use proper TypeScript types, especially for Supabase query results.
4. **Server/client boundary** — Server-only code (Supabase service role, `createClient` from `@/lib/supabase/server`) must never be imported in client components. Watch for `"use client"` directives.
5. **i18n completeness** — New user-facing strings must exist in both `src/messages/es.json` and `src/messages/en.json`.
6. **Performance** — Watch for N+1 queries, missing `loading="lazy"` on images, unnecessary re-renders, and large client bundles.

## Patterns to Enforce

- **Supabase imports**: Server components use `@/lib/supabase/server`, client components use `@/lib/supabase/client`. Never mix them.
- **Feed data**: Never expose `latitude` or `longitude` in feed queries.
- **Navigation**: Use `Link` from `@/i18n/navigation`, not from `next/link` directly.
- **Styling**: Tailwind CSS only. Use the project's design tokens (`text-primary`, `bg-surface`, `text-muted`, etc.). No inline `style` except for `fontFamily: var(--font-fredoka)`.
- **File naming**: Components use kebab-case filenames. One component per file.

## What NOT to Flag

- Missing unit tests (the project doesn't have a test suite yet)
- Missing JSDoc comments on internal functions
- Cosmetic Tailwind class ordering
