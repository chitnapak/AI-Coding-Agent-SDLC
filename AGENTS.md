# Farmart — Project Instructions

## Stack

- **Framework**: Next.js 16 (App Router) + TypeScript
- **Database**: SQLite via `better-sqlite3` — `farmart.db` at repo root
- **Styling**: Tailwind CSS v4 — read `DESIGN.md` before writing any UI
- **Testing**: Vitest v4 — projects: `node` (backend), `storybook` (browser)

## Commands

```bash
npm run dev            # dev server → http://localhost:3000
npm run db:seed        # seed farmart.db
npx vitest run --project node   # backend tests (fast)
npx vitest run         # all tests
npm run lint           # check code style (ESLint + Prettier rules)
npm run lint:fix       # auto-fix lint errors and reformat with Prettier
npm run e2e            # Playwright E2E regression tests (requires dev server or auto-starts it)
npm run e2e:ui         # Playwright UI mode for interactive debugging
```

## Project layout

```
src/app/api/          # Route handlers (route.ts + route.test.ts per route)
src/lib/
  db.ts               # Singleton DB connection
  migrate.ts          # Idempotent schema (7 tables)
  seed.ts             # Demo data
  openapi.ts          # OpenAPI spec
src/components/ui/    # Button, Card, Badge, Dialog, Tabs, Input, …
src/test/helpers.ts   # createTestDb() + seedTestDb() for tests
```

## Key conventions

- Routes call `migrate()` at module top-level, return `NextResponse.json()`
- DB columns are snake_case; all API responses are **camelCase** (alias in SQL with `AS`)
- Pagination: `?page=1&pageSize=24` — pageSize capped at 100, returns `{ items, pageInfo }`
- Tests: `vi.mock('@/lib/db')` + `vi.mock('@/lib/migrate')` before dynamic import of route
- DB changes touch **4 files**: `migrate.ts`, `seed.ts`, `helpers.ts`, `openapi.ts`
- **Run `npm run lint` before finishing any feature** — all new code must pass with zero errors

## Skills

| Skill | When to use |
|---|---|
| `farmart-api-route` | Add or modify an API route + test |
| `farmart-ui-page` | Add or modify a UI page |
| `farmart-db-schema` | Add tables, columns, or relationships |
| `skill-creator` | Create or improve Kiro skills |

## Design (quick ref — full spec in DESIGN.md)

Dark-first. Canvas `bg-slate-950`, cards `bg-slate-900/90`, accent `cyan-500`.  
Text: `slate-50` → `slate-400` → `slate-500`. Buttons need `focus:ring-2 focus:ring-cyan-500/50`.  
Icons: `lucide-react` only. No pure black/white.

---

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
