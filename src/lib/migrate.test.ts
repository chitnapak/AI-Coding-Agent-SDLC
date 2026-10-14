/**
 * Unit tests for src/lib/migrate.ts
 *
 * Strategy: mock @/lib/db with an in-memory Database instance so migrate()
 * never touches farmart.db on disk.
 */
import Database from 'better-sqlite3';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Create a fresh in-memory DB for every test module load
const testDb = new Database(':memory:');
testDb.pragma('journal_mode = WAL');
testDb.pragma('foreign_keys = ON');

// Mock @/lib/db BEFORE importing migrate
vi.mock('@/lib/db', () => ({ db: testDb }));

// Import after mock is set up
const { migrate } = await import('@/lib/migrate');

// Helper: list all user tables in the DB
function getTables(): string[] {
  return (
    testDb
      .prepare(
        `SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name`
      )
      .all() as { name: string }[]
  ).map((r) => r.name);
}

// Helper: list all indexes
function getIndexes(): string[] {
  return (
    testDb
      .prepare(
        `SELECT name FROM sqlite_master WHERE type='index' AND name NOT LIKE 'sqlite_%'`
      )
      .all() as { name: string }[]
  ).map((r) => r.name);
}

describe('migrate()', () => {
  beforeEach(() => {
    // Drop everything and re-run so each test starts clean
    testDb.exec(`
      DROP TABLE IF EXISTS reviews;
      DROP TABLE IF EXISTS product_highlights;
      DROP TABLE IF EXISTS product_variants;
      DROP TABLE IF EXISTS product_images;
      DROP TABLE IF EXISTS products;
      DROP TABLE IF EXISTS featured_brands;
      DROP TABLE IF EXISTS categories;
    `);
    migrate();
  });

  it('creates all 7 expected tables', () => {
    const tables = getTables().sort();
    expect(tables).toEqual([
      'categories',
      'featured_brands',
      'product_highlights',
      'product_images',
      'product_variants',
      'products',
      'reviews',
    ]);
  });

  it('creates required indexes', () => {
    const indexes = getIndexes();
    expect(indexes).toContain('idx_products_category');
    expect(indexes).toContain('idx_products_collection');
    expect(indexes).toContain('idx_reviews_product');
  });

  it('is idempotent – calling migrate() twice does not throw', () => {
    expect(() => migrate()).not.toThrow();
    const tables = getTables().sort();
    expect(tables).toHaveLength(7);
  });

  describe('categories table', () => {
    it('has correct columns', () => {
      const cols = (
        testDb.prepare(`PRAGMA table_info(categories)`).all() as {
          name: string;
        }[]
      ).map((c) => c.name);
      expect(cols).toEqual(
        expect.arrayContaining(['id', 'name', 'icon', 'image_url', 'product_count', 'sort_order'])
      );
    });

    it('enforces PRIMARY KEY on id', () => {
      testDb
        .prepare(
          `INSERT INTO categories (id, name) VALUES ('c1', 'Test')`
        )
        .run();
      expect(() =>
        testDb
          .prepare(
            `INSERT INTO categories (id, name) VALUES ('c1', 'Duplicate')`
          )
          .run()
      ).toThrow();
    });
  });

  describe('products table', () => {
    it('has correct columns', () => {
      const cols = (
        testDb.prepare(`PRAGMA table_info(products)`).all() as {
          name: string;
        }[]
      ).map((c) => c.name);
      expect(cols).toEqual(
        expect.arrayContaining([
          'id', 'sku', 'title', 'brand', 'category_id',
          'description', 'price', 'compare_at_price', 'currency',
          'unit', 'rating', 'review_count', 'sold_count', 'badge',
          'image_url', 'collection', 'is_active', 'created_at',
        ])
      );
    });

    it('has is_active DEFAULT 1', () => {
      testDb
        .prepare(
          `INSERT INTO products (id, sku, title, price) VALUES ('p1', 'S1', 'Test', 9.99)`
        )
        .run();
      const row = testDb
        .prepare(`SELECT is_active FROM products WHERE id = 'p1'`)
        .get() as { is_active: number };
      expect(row.is_active).toBe(1);
    });
  });

  describe('reviews table', () => {
    it('enforces rating CHECK (1–5)', () => {
      // Insert a category and product first to satisfy FK
      testDb
        .prepare(`INSERT INTO categories (id, name) VALUES ('cat1', 'Cat')`)
        .run();
      testDb
        .prepare(
          `INSERT INTO products (id, sku, title, price, category_id)
           VALUES ('prod1', 'SK1', 'Prod', 1.0, 'cat1')`
        )
        .run();

      expect(() =>
        testDb
          .prepare(
            `INSERT INTO reviews (id, product_id, author, rating, comment)
             VALUES ('r1', 'prod1', 'Alice', 6, 'too high')`
          )
          .run()
      ).toThrow();

      expect(() =>
        testDb
          .prepare(
            `INSERT INTO reviews (id, product_id, author, rating, comment)
             VALUES ('r2', 'prod1', 'Bob', 0, 'too low')`
          )
          .run()
      ).toThrow();
    });
  });

  describe('product_variants table', () => {
    it('has composite PRIMARY KEY (id, product_id)', () => {
      testDb
        .prepare(`INSERT INTO categories (id, name) VALUES ('cat2', 'Cat2')`)
        .run();
      testDb
        .prepare(
          `INSERT INTO products (id, sku, title, price) VALUES ('p2', 'SK2', 'P2', 5.0)`
        )
        .run();

      testDb
        .prepare(
          `INSERT INTO product_variants (id, product_id, label, price)
           VALUES ('v1', 'p2', '500g', 5.0)`
        )
        .run();

      // Same (id, product_id) → should fail
      expect(() =>
        testDb
          .prepare(
            `INSERT INTO product_variants (id, product_id, label, price)
             VALUES ('v1', 'p2', '1kg', 9.0)`
          )
          .run()
      ).toThrow();
    });
  });
});
