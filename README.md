# LJDS Automation Hub (Next.js Rebuild)

This folder contains a full Next.js App Router rebuild of the original `ljds-automation-hub` portfolio.

## Stack

- Next.js 16.1.6 (App Router)
- React 19
- TypeScript
- Next Font (`Syne`, `Archivo`)
- Next Image with remote domain allowlist

## What Was Recreated

- Hero with rotating specialist titles and booking CTA
- Specialization section
- About section
- Tools section with click-to-filter behavior for projects
- Project gallery with tags, pagination, and modal video/details
- Certificates section with category filters and modal preview/details
- Contact section and footer

## Optimization Applied

- `cacheComponents: true` in `next.config.ts`
- Server-side cached data source via `"use cache"`, `cacheLife("hours")`, and `cacheTag("portfolio-data")`
- Server-first page composition with client islands only where interaction is needed
- `next/image` for local and remote media
- Metadata and Open Graph config in `app/layout.tsx`
- Theme initialization script to avoid theme-flash on hydration
- Reduced-motion support and responsive layout checks in global CSS

## Run Locally

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000`.

## Quality Checks

```bash
npm run lint
npm run build
```

`npm test` is currently not configured in this scaffold (no `test` script is defined).
