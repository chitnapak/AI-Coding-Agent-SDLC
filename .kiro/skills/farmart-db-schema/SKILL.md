---
name: farmart-db-schema
description: Add or modify database tables and columns in the Farmart project. Use this skill whenever someone asks to add a new table, add a column to an existing table, change a relationship, or extend the data model. Schema changes always touch four files together — missing any one of them will break tests or the OpenAPI spec.
---

# Farmart DB Schema

A schema change is never just one file. Every change must update **four files together**:

| File | What to update |
|---|---|
| `src/lib/migrate.ts` | `CREATE TABLE` / `ALTER TABLE` / new index |
| `src/lib/seed.ts` | Insert demo rows for the new table/column |
| `src/test/helpers.ts` | Mirror the same DDL so tests use the new schema |
| `src/lib/openapi.ts` | Add/update the corresponding JSON Schema component |

Skipping any of these will cause either test failures or a stale API spec.

## 1. migrate.ts — adding a table

All statements inside `db.exec()` must be idempotent:

```ts
// src/lib/migrate.ts
db.exec(/* sql */ `
  -- ─────────────────────────────────────────────
  -- YOUR_TABLE
  -- ─────────────────────────────────────────────
  CREATE TABLE IF NOT EXISTS your_table (
    id         TEXT PRIMARY KEY,
    product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    name       TEXT NOT NULL,
    value      REAL NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE INDEX IF NOT EXISTS idx_your_table_product ON your_table(product_id);
`);
```

Rules:
- Always `CREATE TABLE IF NOT EXISTS` — never plain `CREATE TABLE`
- Always `CREATE INDEX IF NOT EXISTS`
- Foreign keys to `products` should include `ON DELETE CASCADE`
- Use `TEXT` for IDs (not INTEGER), `REAL` for prices/decimals, `INTEGER` for booleans (0/1) and counts

## 2. seed.ts — inserting demo data

Add a seed block after the relevant table's existing seed code:

```ts
// src/lib/seed.ts
const yourRows = [
  { id: 'row-1', product_id: 'product-id-here', name: 'Example', value: 9.99 },
  // 3–5 realistic rows minimum
];

const insertRow = db.prepare(`
  INSERT OR IGNORE INTO your_table (id, product_id, name, value)
  VALUES (@id, @product_id, @name, @value)
`);

const insertRows = db.transaction(() => {
  for (const row of yourRows) insertRow.run(row);
});
insertRows();
console.log('✅ YourTable seeded');
```

Use `INSERT OR IGNORE` — never plain `INSERT`.

## 3. helpers.ts — mirroring schema for tests

`createTestDb()` in `src/test/helpers.ts` builds an in-memory DB that tests use. It must contain the exact same DDL as `migrate.ts`. Add your new table inside the `db.exec()` call:

```ts
// src/test/helpers.ts — inside createTestDb()'s db.exec()
CREATE TABLE IF NOT EXISTS your_table (
  id         TEXT PRIMARY KEY,
  product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  name       TEXT NOT NULL,
  value      REAL NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
```

Also update `seedTestDb()` if tests need fixture data for the new table:

```ts
export function seedTestDb(db: Database.Database, fixtures: {
  // ...existing types...
  yourTable?: Array<{ id: string; product_id: string; name: string; value?: number }>;
}) {
  // ...existing inserts...
  for (const row of fixtures.yourTable ?? []) {
    db.prepare(`INSERT OR IGNORE INTO your_table (id, product_id, name, value)
                VALUES (@id, @product_id, @name, @value)`)
      .run({ value: 0, ...row });
  }
}
```

## 4. openapi.ts — JSON Schema component

Add a new component under `components.schemas` in `src/lib/openapi.ts`:

```ts
YourModel: {
  type: "object",
  properties: {
    id:        { type: "string" },
    productId: { type: "string" },
    name:      { type: "string" },
    value:     { type: "number" },
    createdAt: { type: "string", format: "date-time" },
  },
  required: ["id", "productId", "name", "value"],
},
```

If a new route exposes this table, add it to `paths` as well.

## camelCase reminder

SQL columns are snake_case. The API (and OpenAPI spec) always use camelCase. In `openapi.ts`, use `productId` not `product_id`. In route queries, alias with `AS`:

```sql
SELECT product_id AS productId, created_at AS createdAt FROM your_table
```

## Checklist before finishing

- [ ] `migrate.ts` uses `CREATE TABLE IF NOT EXISTS` and `CREATE INDEX IF NOT EXISTS`
- [ ] `seed.ts` uses `INSERT OR IGNORE` with 3+ realistic rows
- [ ] `helpers.ts` `createTestDb()` has the same DDL as `migrate.ts`
- [ ] `helpers.ts` `seedTestDb()` accepts fixtures for the new table
- [ ] `openapi.ts` has a new schema component (camelCase fields)
- [ ] `npx vitest run --project node` passes after all changes
