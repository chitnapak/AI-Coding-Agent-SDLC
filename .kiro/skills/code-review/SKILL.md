---
name: code-review
description: Review code for correctness, bugs, security vulnerabilities, and regressions. Use this skill whenever someone asks to review code, check a diff, audit a file or module, or find issues in the codebase. Also triggers on requests like "review this", "check my code", "find bugs", or "audit the API routes". Runs a structured multi-pass review and reports findings by severity.
---

# Code Review

Performs a structured review of code — a single file, a module, or the whole repo — and reports findings by severity. Focuses on correctness first: bugs that break behavior, security vulnerabilities, and regressions. Style and formatting are secondary.

## Severity levels

| Marker | Severity | Meaning |
|--------|----------|---------|
| 🔴 | **Important** | A bug that should be fixed — incorrect logic, security hole, data corruption risk |
| 🟡 | **Nit** | A minor issue, worth fixing but not blocking — naming, small inefficiency |
| 🟣 | **Pre-existing** | A bug that exists in the codebase but wasn't introduced by the current change |
| 💡 | **Suggestion** | An improvement opportunity — not a bug, but would make the code better |

## Review process

Run these passes in order. Each pass has a different focus so issues don't get missed.

### Pass 1 — Correctness
Look for bugs that would break production:
- Logic errors (off-by-one, wrong operator, inverted condition)
- Unhandled errors or edge cases (null/undefined, empty array, division by zero)
- Race conditions or async/await misuse
- Incorrect return values or missing `return`
- Type mismatches that TypeScript won't catch at runtime

### Pass 2 — Security
- SQL injection, XSS, CSRF, path traversal
- PII or secrets in logs, responses, or error messages
- Missing input validation or sanitization
- Authentication/authorization gaps (missing auth check, insecure direct object reference)
- Insecure dependencies or unsafe eval/exec calls

### Pass 3 — Data integrity (for DB-touching code)
- Missing transactions where multiple writes must be atomic
- Non-idempotent migrations
- Missing NOT NULL constraints or wrong defaults
- Query results used without checking for null/undefined

### Pass 4 — API contracts
- Response shape doesn't match documented schema
- Missing or wrong HTTP status codes
- Pagination edge cases (page=0, pageSize=0, beyond last page)
- camelCase vs snake_case consistency (API must return camelCase)

### Pass 5 — Test coverage
- Critical paths without a test
- Tests that mock so heavily they don't test real behavior
- Missing edge cases in existing tests

## Output format

Group findings by file. Within a file, order by line number. Cap nits at 5 per file — mention extra ones in a count.

```
## <filename>

🔴 **Line N — <one-line title>**
<explanation of why this is a bug and what would go wrong>
```suggestion
// fixed code
```

🟡 **Line N — <one-line title>**
<brief explanation>

---
```

End with a summary table:

```
## Summary

| File | 🔴 Important | 🟡 Nit | 🟣 Pre-existing | 💡 Suggestion |
|------|-------------|--------|-----------------|---------------|
| src/app/api/products/route.ts | 1 | 2 | 0 | 1 |
| **Total** | **1** | **2** | **0** | **1** |

**Verdict**: <one sentence — e.g. "One blocking bug in the products route, rest are minor.">
```

If no issues found in a file, skip it from the output. If no issues found anywhere, say so clearly.

## Farmart-specific checks

When reviewing this repo, apply these additional rules on top of the defaults:

**API routes** (`src/app/api/**/route.ts`):
- Route must call `migrate()` at module top-level (not inside the handler)
- Must return `NextResponse.json()` — not `Response.json()`
- DB columns are snake_case; API responses must alias to camelCase in SQL (`SELECT col AS camelCol`)
- Pagination responses must have shape `{ items, pageInfo }` with `pageSize` capped at 100
- Auth check must be present if the route writes data

**Tests** (`*.test.ts`):
- Must `vi.mock('@/lib/db')` and `vi.mock('@/lib/migrate')` before the dynamic import of the route
- Use `createTestDb()` + `seedTestDb()` from `src/test/helpers.ts` — not raw DB setup
- Each test should be independent (no shared mutable state between tests)

**DB schema** (`src/lib/migrate.ts`):
- Schema changes must be idempotent (`CREATE TABLE IF NOT EXISTS`, `ALTER TABLE … ADD COLUMN IF NOT EXISTS` via `PRAGMA table_info`)
- Every schema change must also update `seed.ts`, `helpers.ts`, and `openapi.ts`

**UI components** (`src/components/`, `src/app/**/page.tsx`):
- Dark-first: canvas `bg-slate-950`, cards `bg-slate-900/90`, accent `cyan-500`
- Buttons need `focus:ring-2 focus:ring-cyan-500/50`
- Icons: `lucide-react` only — no other icon libraries

## When reviewing a whole repo

1. List all files to review (`src/app/api/`, `src/lib/`, `src/components/`, `src/app/`)
2. Prioritize: API routes → DB layer → lib utilities → UI
3. Skip generated files, `node_modules`, `*.lock`, `farmart.db`
4. For large repos, review by module — report per-module, then a combined summary

## Checklist before finishing

- [ ] All four passes run on each file
- [ ] Farmart-specific checks applied to relevant files
- [ ] Findings grouped by file, ordered by line
- [ ] Nits capped at 5 per file
- [ ] Summary table included
- [ ] Verdict written — one sentence on overall health
