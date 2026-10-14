/**
 * Database migrations – run once at startup via the seed script.
 * Each statement is idempotent (CREATE TABLE IF NOT EXISTS, INSERT OR IGNORE).
 */
import { db } from "./db";

export function migrate() {
  db.exec(/* sql */ `
    -- ─────────────────────────────────────────────
    -- CATEGORIES
    -- ─────────────────────────────────────────────
    CREATE TABLE IF NOT EXISTS categories (
      id            TEXT PRIMARY KEY,
      name          TEXT NOT NULL,
      icon          TEXT,
      image_url     TEXT,
      product_count INTEGER NOT NULL DEFAULT 0,
      sort_order    INTEGER NOT NULL DEFAULT 0
    );

    -- ─────────────────────────────────────────────
    -- PRODUCTS
    -- ─────────────────────────────────────────────
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
      collection       TEXT,          -- 'best-sellers' | 'top-savers' | null
      is_active        INTEGER NOT NULL DEFAULT 1,
      created_at       TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
    CREATE INDEX IF NOT EXISTS idx_products_collection ON products(collection);

    -- ─────────────────────────────────────────────
    -- PRODUCT IMAGES
    -- ─────────────────────────────────────────────
    CREATE TABLE IF NOT EXISTS product_images (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
      url        TEXT NOT NULL,
      sort_order INTEGER NOT NULL DEFAULT 0
    );

    -- ─────────────────────────────────────────────
    -- PRODUCT VARIANTS
    -- ─────────────────────────────────────────────
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

    -- ─────────────────────────────────────────────
    -- PRODUCT HIGHLIGHTS
    -- ─────────────────────────────────────────────
    CREATE TABLE IF NOT EXISTS product_highlights (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id  TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
      title       TEXT NOT NULL,
      description TEXT NOT NULL
    );

    -- ─────────────────────────────────────────────
    -- FEATURED BRANDS (home-page banners)
    -- ─────────────────────────────────────────────
    CREATE TABLE IF NOT EXISTS featured_brands (
      id        TEXT PRIMARY KEY,
      brand     TEXT NOT NULL,
      title     TEXT NOT NULL,
      badge     TEXT,
      image_url TEXT,
      sort_order INTEGER NOT NULL DEFAULT 0
    );

    -- ─────────────────────────────────────────────
    -- REVIEWS
    -- ─────────────────────────────────────────────
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
}
