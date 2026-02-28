# Portfolio Data Utilities

## Overview

The portfolio reads data from Supabase tables:

- `ljds_hero_titles`
- `ljds_specializations`
- `ljds_tools`
- `ljds_projects`
- `ljds_certificates`

The utilities live in `lib/portfolio-data.ts` and expose:

- `getPortfolioData()` for cached public-site reads
- `getPortfolioDataUncached()` for live admin-dashboard reads

## Caching Behavior

`getPortfolioData()` uses Next.js Cache Components:

- `"use cache"`
- `cacheTag("portfolio-data-v2")`
- `cacheLife("hours")`

Admin mutation server actions call `updateTag("portfolio-data-v2")` to refresh cached public content.

## Tool Icons

`lib/portfolio-data.ts` now uses `ljds_tools.logo` directly from Supabase as the source of truth.

- If a tool logo URL is missing or empty, it falls back to `/media/tools/prompt.svg`.
- Update icon URLs in `ljds_tools` to control displayed tool branding.

## Supabase Clients

Server-side Supabase setup is in `lib/supabase.ts`:

- `supabase` for read operations (anon/public scope)
- `supabaseAdmin` for privileged server actions (service role when configured)

Required environment variables:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` (minimum)

## Database Privileges

For public portfolio reads under RLS, `anon`/`authenticated` roles must have:

- `USAGE` on schema `public`
- `SELECT` grants on the `ljds_*` tables
- matching `SELECT` RLS policies

For `/admin` writes, only authenticated users should be allowed:

- `INSERT`, `UPDATE`, `DELETE` grants for `authenticated` on:
  - `public.ljds_projects`
  - `public.ljds_certificates`
- matching `INSERT` / `UPDATE` / `DELETE` RLS policies scoped to `authenticated`
