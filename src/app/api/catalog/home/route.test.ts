/**
 * Integration tests for GET /api/catalog/home
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createTestDb, seedTestDb } from '@/test/helpers';

const testDb = createTestDb();
vi.mock('@/lib/db', () => ({ db: testDb }));
vi.mock('@/lib/migrate', () => ({ migrate: vi.fn() }));

const { GET } = await import('@/app/api/catalog/home/route');

async function callGet() {
  const res = await GET();
  return { status: res.status, body: await res.json() };
}

// ── Shared fixtures ───────────────────────────────────────────────────────────
const BASE_CATEGORIES = [
  { id: 'fruits', name: 'Fruits', sort_order: 1 },
  { id: 'breads', name: 'Breads', sort_order: 2 },
];

const BASE_BRANDS = [
  { id: 'fb-1', brand: 'BrandA', title: 'Title A', sort_order: 1 },
  { id: 'fb-2', brand: 'BrandB', title: 'Title B', sort_order: 2 },
];

function makeProduct(overrides: Partial<Parameters<typeof seedTestDb>[1]['products']>[number] = {}) {
  return {
    id: 'p1',
    sku: 'SK1',
    title: 'Product 1',
    price: 9.99,
    category_id: 'fruits',
    ...overrides,
  };
}

// ── Tests ─────────────────────────────────────────────────────────────────────
describe('GET /api/catalog/home', () => {
  beforeEach(() => {
    testDb.exec(`
      DELETE FROM reviews;
      DELETE FROM product_highlights;
      DELETE FROM product_variants;
      DELETE FROM product_images;
      DELETE FROM products;
      DELETE FROM featured_brands;
      DELETE FROM categories;
    `);
  });

  it('returns 200 with the correct top-level keys', async () => {
    const { status, body } = await callGet();

    expect(status).toBe(200);
    expect(body).toHaveProperty('categories');
    expect(body).toHaveProperty('featuredBrands');
    expect(body).toHaveProperty('topSavers');
    expect(body).toHaveProperty('bestSellers');
  });

  it('returns categories sorted by sort_order', async () => {
    seedTestDb(testDb, {
      categories: [
        { id: 'z', name: 'ZCat', sort_order: 99 },
        { id: 'a', name: 'ACat', sort_order: 1 },
      ],
    });
    const { body } = await callGet();

    expect(body.categories[0].id).toBe('a');
    expect(body.categories[1].id).toBe('z');
  });

  it('returns featuredBrands sorted by sort_order', async () => {
    seedTestDb(testDb, {
      featuredBrands: [
        { id: 'fb-9', brand: 'Z', title: 'Z', sort_order: 9 },
        { id: 'fb-1', brand: 'A', title: 'A', sort_order: 1 },
      ],
    });
    const { body } = await callGet();

    expect(body.featuredBrands[0].id).toBe('fb-1');
    expect(body.featuredBrands[1].id).toBe('fb-9');
  });

  it('returns only top-savers products in topSavers', async () => {
    seedTestDb(testDb, {
      categories: BASE_CATEGORIES,
      products: [
        makeProduct({ id: 'ts1', sku: 'TS1', title: 'Top Saver 1', collection: 'top-savers' }),
        makeProduct({ id: 'bs1', sku: 'BS1', title: 'Best Seller 1', collection: 'best-sellers' }),
        makeProduct({ id: 'none', sku: 'NONE', title: 'No Collection', collection: null }),
      ],
    });
    const { body } = await callGet();

    expect(body.topSavers).toHaveLength(1);
    expect(body.topSavers[0].id).toBe('ts1');
  });

  it('returns only best-sellers products in bestSellers', async () => {
    seedTestDb(testDb, {
      categories: BASE_CATEGORIES,
      products: [
        makeProduct({ id: 'ts1', sku: 'TS1', title: 'Top Saver', collection: 'top-savers' }),
        makeProduct({ id: 'bs1', sku: 'BS1', title: 'Best Seller', collection: 'best-sellers' }),
      ],
    });
    const { body } = await callGet();

    expect(body.bestSellers).toHaveLength(1);
    expect(body.bestSellers[0].id).toBe('bs1');
  });

  it('excludes inactive products from topSavers and bestSellers', async () => {
    seedTestDb(testDb, {
      categories: BASE_CATEGORIES,
      products: [
        makeProduct({ id: 'ts-active', sku: 'A', title: 'Active', collection: 'top-savers', is_active: 1 }),
        makeProduct({ id: 'ts-inactive', sku: 'B', title: 'Inactive', collection: 'top-savers', is_active: 0 }),
      ],
    });
    const { body } = await callGet();

    expect(body.topSavers).toHaveLength(1);
    expect(body.topSavers[0].id).toBe('ts-active');
  });

  it('returns correct camelCase field names in products', async () => {
    seedTestDb(testDb, {
      categories: BASE_CATEGORIES,
      products: [
        makeProduct({
          id: 'ts1',
          sku: 'TS1',
          title: 'Top Saver',
          collection: 'top-savers',
          compare_at_price: 15.99,
          image_url: 'https://example.com/img.jpg',
        }),
      ],
    });
    const { body } = await callGet();
    const product = body.topSavers[0];

    expect(product).toHaveProperty('compareAtPrice', 15.99);
    expect(product).toHaveProperty('imageUrl', 'https://example.com/img.jpg');
    expect(product).not.toHaveProperty('compare_at_price');
    expect(product).not.toHaveProperty('image_url');
  });

  it('returns empty arrays when no data exists', async () => {
    const { body } = await callGet();

    expect(body.categories).toEqual([]);
    expect(body.featuredBrands).toEqual([]);
    expect(body.topSavers).toEqual([]);
    expect(body.bestSellers).toEqual([]);
  });

  it('returns all 4 sections populated correctly', async () => {
    seedTestDb(testDb, {
      categories: BASE_CATEGORIES,
      featuredBrands: BASE_BRANDS,
      products: [
        makeProduct({ id: 'ts1', sku: 'TS1', title: 'Top Saver', collection: 'top-savers' }),
        makeProduct({ id: 'bs1', sku: 'BS1', title: 'Best Seller', collection: 'best-sellers' }),
      ],
    });
    const { body } = await callGet();

    expect(body.categories).toHaveLength(2);
    expect(body.featuredBrands).toHaveLength(2);
    expect(body.topSavers).toHaveLength(1);
    expect(body.bestSellers).toHaveLength(1);
  });
});
