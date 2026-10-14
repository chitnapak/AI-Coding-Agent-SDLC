/**
 * Test helpers – in-memory SQLite database.
 *
 * Usage:
 *   import { createTestDb, seedTestDb } from '@/test/helpers';
 *
 *   const db = createTestDb();   // creates tables
 *   seedTestDb(db, { ... });     // insert fixtures
 */
import Database from 'better-sqlite3';

// ── Schema ────────────────────────────────────────────────────────────────────

export function createTestDb(): Database.Database {
  const db = new Database(':memory:');
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');

  db.exec(/* sql */ `
    CREATE TABLE IF NOT EXISTS categories (
      id            TEXT PRIMARY KEY,
      name          TEXT NOT NULL,
      icon          TEXT,
      image_url     TEXT,
      product_count INTEGER NOT NULL DEFAULT 0,
      sort_order    INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS products (
      id               TEXT PRIMARY KEY,
      sku              TEXT NOT NULL,
      title            TEXT NOT NULL,
      brand            TEXT,
      category_id      TEXT REFERENCES categories(id),
      description      TEXT,
      price            REAL NOT NULL,
      compare_at_price REAL,
      currency         TEXT NOT NULL DEFAULT 'USD',
      unit             TEXT,
      rating           REAL DEFAULT 0,
      review_count     INTEGER DEFAULT 0,
      sold_count       INTEGER DEFAULT 0,
      badge            TEXT,
      image_url        TEXT,
      collection       TEXT,
      is_active        INTEGER NOT NULL DEFAULT 1,
      created_at       TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
    CREATE INDEX IF NOT EXISTS idx_products_collection ON products(collection);

    CREATE TABLE IF NOT EXISTS product_images (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
      url        TEXT NOT NULL,
      sort_order INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS product_variants (
      id                 TEXT NOT NULL,
      product_id         TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
      label              TEXT NOT NULL,
      price              REAL NOT NULL,
      compare_at_price   REAL,
      in_stock           INTEGER NOT NULL DEFAULT 1,
      available_quantity INTEGER,
      PRIMARY KEY (id, product_id)
    );

    CREATE TABLE IF NOT EXISTS product_highlights (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id  TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
      title       TEXT NOT NULL,
      description TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS featured_brands (
      id         TEXT PRIMARY KEY,
      brand      TEXT NOT NULL,
      title      TEXT NOT NULL,
      badge      TEXT,
      image_url  TEXT,
      sort_order INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS reviews (
      id         TEXT PRIMARY KEY,
      product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
      author     TEXT NOT NULL,
      rating     INTEGER NOT NULL CHECK(rating BETWEEN 1 AND 5),
      comment    TEXT NOT NULL,
      verified   INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_reviews_product ON reviews(product_id);
  `);

  return db;
}

// ── Fixture types ─────────────────────────────────────────────────────────────

export interface CategoryFixture {
  id: string;
  name: string;
  icon?: string;
  image_url?: string;
  product_count?: number;
  sort_order?: number;
}

export interface ProductFixture {
  id: string;
  sku: string;
  title: string;
  brand?: string;
  category_id?: string;
  description?: string;
  price: number;
  compare_at_price?: number | null;
  currency?: string;
  unit?: string;
  rating?: number;
  review_count?: number;
  sold_count?: number;
  badge?: string | null;
  image_url?: string;
  collection?: string | null;
  is_active?: number;
}

export interface ReviewFixture {
  id: string;
  product_id: string;
  author: string;
  rating: number;
  comment: string;
  verified?: number;
}

export interface FeaturedBrandFixture {
  id: string;
  brand: string;
  title: string;
  badge?: string;
  image_url?: string;
  sort_order?: number;
}

export interface TestFixtures {
  categories?: CategoryFixture[];
  products?: ProductFixture[];
  reviews?: ReviewFixture[];
  featuredBrands?: FeaturedBrandFixture[];
  productImages?: { product_id: string; url: string; sort_order?: number }[];
  productVariants?: {
    id: string;
    product_id: string;
    label: string;
    price: number;
    compare_at_price?: number | null;
    in_stock?: number;
    available_quantity?: number | null;
  }[];
  productHighlights?: { product_id: string; title: string; description: string }[];
}

// ── Seed helper ───────────────────────────────────────────────────────────────

export function seedTestDb(db: Database.Database, fixtures: TestFixtures): void {
  if (fixtures.categories) {
    const stmt = db.prepare(
      `INSERT INTO categories (id, name, icon, image_url, product_count, sort_order)
       VALUES (@id, @name, @icon, @image_url, @product_count, @sort_order)`
    );
    for (const c of fixtures.categories) {
      stmt.run({ icon: null, image_url: null, product_count: 0, sort_order: 0, ...c });
    }
  }

  if (fixtures.products) {
    const stmt = db.prepare(
      `INSERT INTO products
         (id, sku, title, brand, category_id, description, price, compare_at_price,
          currency, unit, rating, review_count, sold_count, badge, image_url,
          collection, is_active)
       VALUES
         (@id, @sku, @title, @brand, @category_id, @description, @price, @compare_at_price,
          @currency, @unit, @rating, @review_count, @sold_count, @badge, @image_url,
          @collection, @is_active)`
    );
    for (const p of fixtures.products) {
      stmt.run({
        brand: null, category_id: null, description: null,
        compare_at_price: null, currency: 'USD', unit: null,
        rating: 0, review_count: 0, sold_count: 0,
        badge: null, image_url: null, collection: null, is_active: 1,
        ...p,
      });
    }
  }

  if (fixtures.productImages) {
    const stmt = db.prepare(
      `INSERT INTO product_images (product_id, url, sort_order)
       VALUES (@product_id, @url, @sort_order)`
    );
    for (const img of fixtures.productImages) {
      stmt.run({ sort_order: 0, ...img });
    }
  }

  if (fixtures.productVariants) {
    const stmt = db.prepare(
      `INSERT INTO product_variants
         (id, product_id, label, price, compare_at_price, in_stock, available_quantity)
       VALUES
         (@id, @product_id, @label, @price, @compare_at_price, @in_stock, @available_quantity)`
    );
    for (const v of fixtures.productVariants) {
      stmt.run({
        compare_at_price: null, in_stock: 1, available_quantity: null,
        ...v,
      });
    }
  }

  if (fixtures.productHighlights) {
    const stmt = db.prepare(
      `INSERT INTO product_highlights (product_id, title, description)
       VALUES (@product_id, @title, @description)`
    );
    for (const h of fixtures.productHighlights) stmt.run(h);
  }

  if (fixtures.featuredBrands) {
    const stmt = db.prepare(
      `INSERT INTO featured_brands (id, brand, title, badge, image_url, sort_order)
       VALUES (@id, @brand, @title, @badge, @image_url, @sort_order)`
    );
    for (const b of fixtures.featuredBrands) {
      stmt.run({ badge: null, image_url: null, sort_order: 0, ...b });
    }
  }

  if (fixtures.reviews) {
    const stmt = db.prepare(
      `INSERT INTO reviews (id, product_id, author, rating, comment, verified)
       VALUES (@id, @product_id, @author, @rating, @comment, @verified)`
    );
    for (const r of fixtures.reviews) {
      stmt.run({ verified: 0, ...r });
    }
  }
}
