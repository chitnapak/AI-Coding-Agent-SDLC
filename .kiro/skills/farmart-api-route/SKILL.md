---
name: farmart-api-route
description: Create a new Next.js API route for the Farmart project following the established pattern — including the paired test file. Use this skill whenever someone asks to add an API endpoint, create a new route, or build a new backend resource for Farmart. Also use it when modifying or extending an existing route.
---

# Farmart API Route

Every new route follows the same structure. The goal is consistency: any developer or agent reading a new route should find no surprises.

## Route file structure

```ts
// src/app/api/<resource>/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { migrate } from "@/lib/migrate";

migrate(); // always at module top-level — idempotent, safe

export function GET(request: NextRequest) {
  // ...
  return NextResponse.json(data);
}
```

Key rules:
- `migrate()` is called at module top-level, never inside the handler
- Import `NextRequest` only when you need query params or path params; simple routes can omit it
- Return `NextResponse.json(payload)` — always JSON, never plain Response
- HTTP 404: `NextResponse.json({ code: "not_found", message: "..." }, { status: 404 })`

## camelCase convention

SQL columns use snake_case. The API always returns camelCase. Do the conversion in SQL using `AS` aliases — never in TypeScript:

```sql
SELECT
  image_url        AS imageUrl,
  compare_at_price AS compareAtPrice,
  review_count     AS reviewCount,
  created_at       AS createdAt
FROM products
```

Never do `result.imageUrl = result.image_url` in code.

## Pagination pattern

When a route supports pagination, use this exact pattern:

```ts
const page     = Math.max(1, parseInt(searchParams.get("page")     ?? "1",  10));
const pageSize = Math.min(100, Math.max(1, parseInt(searchParams.get("pageSize") ?? "24", 10)));
const offset   = (page - 1) * pageSize;

// query with LIMIT @pageSize OFFSET @offset
// count with SELECT COUNT(*) AS total

return NextResponse.json({
  items,
  pageInfo: { page, pageSize, total },
});
```

`pageSize` is always capped at 100. Default is 24.

## Dynamic route params

Next.js 15+ passes params as a Promise. The existing routes cast around it:

```ts
export function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  const { productId } = params as unknown as { productId: string };
  // ...
}
```

Use this exact pattern for any `[param]` route.

## Test file structure

Every route file gets a paired test file at the same path, named `route.test.ts`.

```ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { createTestDb, seedTestDb } from '@/test/helpers';

// 1. Create test DB
const testDb = createTestDb();

// 2. Mock BEFORE importing the route
vi.mock('@/lib/db',      () => ({ db: testDb }));
vi.mock('@/lib/migrate', () => ({ migrate: vi.fn() }));

// 3. Dynamic import AFTER mocks
const { GET } = await import('@/app/api/<resource>/route');

// 4. Helper to build requests
function makeRequest(params: Record<string, string> = {}) {
  const url = new URL('http://localhost/api/<resource>');
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  return new NextRequest(url);
}

// 5. Clear tables in beforeEach — order matters (FK children first)
beforeEach(() => {
  testDb.exec(`
    DELETE FROM reviews;
    DELETE FROM product_highlights;
    DELETE FROM product_variants;
    DELETE FROM product_images;
    DELETE FROM products;
    DELETE FROM categories;
  `);
});
```

For dynamic routes, the `makeContext` helper looks like:

```ts
function makeContext(productId: string) {
  return { params: { productId } as unknown as { params: Promise<{ productId: string }> } };
}
```

## What to test

Cover these cases for every new route:

1. **Happy path** — correct status (200) and response shape
2. **camelCase fields** — snake_case fields must NOT appear in response
3. **Empty state** — empty array / 404 when no data
4. **Filters** — each query param in isolation
5. **Pagination** — page/pageSize/total are correct; pageSize capped at 100
6. **Edge cases specific to the resource** — 404 for unknown ID, etc.

## Checklist before finishing

- [ ] `migrate()` called at top-level (not inside handler)
- [ ] All snake_case columns aliased to camelCase in SQL
- [ ] Pagination returns `{ items, pageInfo: { page, pageSize, total } }`
- [ ] Test file exists at same path as route file
- [ ] `vi.mock` calls come before the dynamic `import` of the route
- [ ] `beforeEach` clears all affected tables in FK-safe order
- [ ] `npx vitest run --project node` passes
