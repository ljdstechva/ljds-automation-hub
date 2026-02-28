# Admin Authentication

## Overview

`/admin` is protected by Supabase Auth email/password login.

- Login page: `/admin/login`
- Session storage: HTTP-only cookies
- Protected area: `/admin`

## Server Utilities

Authentication helpers are split between:

- `lib/admin-auth-actions.ts` for server actions:
  - `loginAdmin()` validates Supabase credentials and sets cookies
  - `logoutAdmin()` clears cookies
- `lib/admin-auth.ts` for server utilities:
- `requireAdminUserForPage()` redirects unauthenticated requests to `/admin/login`
- `requireAdminUserForAction()` blocks unauthenticated server actions
- `createAuthenticatedSupabase()` creates a Supabase client scoped to the current authenticated user JWT

## Cookies

The admin session uses two HTTP-only cookies:

- `ljds_admin_access_token`
- `ljds_admin_refresh_token`

Cookies are `SameSite=Lax`, `path=/`, and `secure` in production.

## Database Policy Alignment

Admin mutations are executed with the authenticated user access token.

Required DB setup for admin-managed tables:

- `INSERT`, `UPDATE`, `DELETE` grants for role `authenticated`
- matching RLS policies scoped to `authenticated`

`anon` should retain read-only access for public portfolio rendering.

## Environment Requirements

Admin auth requires:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

If either variable is missing, admin auth routes/actions remain build-safe but login/action execution returns a clear runtime configuration error instead of crashing deployment.
