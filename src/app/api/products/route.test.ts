/**
 * Integration tests for GET /api/products
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { createTestDb, seedTestDb } from '@/test/helpers';

const testDb = createTestDb();
vi.mock('@/lib/db', () => ({ db: testDb }));
vi.mock('@/lib/migrate', () => ({ migrate: vi.fn() }));

const { GET } = await import('@/app/api/products/route');

// ── Helpers ───────────────────────────────────────────────────────────────────
function makeRequest(params: Record<string, string> = {}) {
  const url = new URL('http://localhost/api/products');
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  return new NextRequest(url);
}

async function callGet(params: Record<string, string> = {}) {
  const res = await GET(makeRequest(params));
  return { status: res.status, body: await res.json() };
}

// ── Fixtures ──────────────────────────────────────────────────────────────────
const CATEGORIES = [
  { id: 'fruits', name: 'Fruits', sort_order: 1 },
  { id: 'drinks', name: 'Drinks', sort_order: 2 },
];

function product(overrides: Record<string, unknown> = {}) {
  return {
    id: 'p1', sku: 'SK1', title: 'Apple', brand: 'FarmA',
    category_id: 'fruits', price: 5.99, sold_count: 10, is_active: 1,
    ...overrides,
  };
}

// ── Tests ─────────────────────────────────────────────────────────────────────
describe('GET /api/products', () => {
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

  it('returns 200 with items array and pageInfo', async () => {
    const { status, body } = await callGet();

    expect(status).toBe(200);
    expect(body).toHaveProperty('items');
    expect(body).toHaveProperty('pageInfo');
    expect(Array.isArray(body.items)).toBe(true);
  });

  it('returns only is_active=1 products', async () => {
    seedTestDb(testDb, {
      categories: CATEGORIES,
      products: [
        product({ id: 'active', sku: 'A', title: 'Active', is_active: 1 }),
        product({ id: 'inactive', sku: 'B', title: 'Inactive', is_active: 0 }),
      ],
    });
    const { body } = await callGet();

    expect(body.items).toHaveLength(1);
    expect(body.items[0].id).toBe('active');
  });

  it('filters by category param', async () => {
    seedTestDb(testDb, {
      categories: CATEGORIES,
      products: [
        product({ id: 'fruit1', sku: 'F1', title: 'Apple', category_id: 'fruits' }),
        product({ id: 'drink1', sku: 'D1', title: 'Juice', category_id: 'drinks' }),
      ],
    });
    const { body } = await callGet({ category: 'fruits' });

    expect(body.items).toHaveLength(1);
    expect(body.items[0].id).toBe('fruit1');
  });

  it('filters by collection param', async () => {
    seedTestDb(testDb, {
      categories: CATEGORIES,
      products: [
        product({ id: 'ts', sku: 'TS', title: 'Top Saver', collection: 'top-savers' }),
        product({ id: 'bs', sku: 'BS', title: 'Best Seller', collection: 'best-sellers' }),
      ],
    });
    const { body } = await callGet({ collection: 'top-savers' });

    expect(body.items).toHaveLength(1);
    expect(body.items[0].id).toBe('ts');
  });

  it('filters by q (title search)', async () => {
    seedTestDb(testDb, {
      categories: CATEGORIES,
      products: [
        product({ id: 'apple', sku: 'A', title: 'Fresh Apple', brand: 'Farm' }),
        product({ id: 'bread', sku: 'B', title: 'Whole Grain Bread', brand: 'Bakery' }),
      ],
    });
    const { body } = await callGet({ q: 'apple' });

    expect(body.items).toHaveLength(1);
    expect(body.items[0].id).toBe('apple');
  });

  it('filters by q (brand search)', async () => {
    seedTestDb(testDb, {
      categories: CATEGORIES,
      products: [
        product({ id: 'p1', sku: 'A', title: 'Item', brand: 'UniqueBrand' }),
        product({ id: 'p2', sku: 'B', title: 'Other', brand: 'OtherBrand' }),
      ],
    });
    const { body } = await callGet({ q: 'UniqueBrand' });

    expect(body.items).toHaveLength(1);
    expect(body.items[0].id).toBe('p1');
  });

  it('paginates correctly with page and pageSize', async () => {
    const products = Array.from({ length: 5 }, (_, i) => ({
      id: `p${i + 1}`, sku: `SK${i + 1}`, title: `Product ${i + 1}`,
      category_id: 'fruits', price: 1.0, sold_count: i,
    }));
    seedTestDb(testDb, { categories: CATEGORIES, products });

    const { body } = await callGet({ page: '2', pageSize: '2' });

    expect(body.items).toHaveLength(2);
    expect(body.pageInfo).toMatchObject({ page: 2, pageSize: 2, total: 5 });
  });

  it('returns correct pageInfo.total across filters', async () => {
    seedTestDb(testDb, {
      categories: CATEGORIES,
      products: [
        product({ id: 'f1', sku: 'F1', title: 'Fruit One', category_id: 'fruits' }),
        product({ id: 'f2', sku: 'F2', title: 'Fruit Two', category_id: 'fruits' }),
        product({ id: 'd1', sku: 'D1', title: 'Drink One', category_id: 'drinks' }),
      ],
    });
    const { body } = await callGet({ category: 'fruits' });

    expect(body.pageInfo.total).toBe(2);
  });

  it('returns correct camelCase field names', async () => {
    seedTestDb(testDb, {
      categories: CATEGORIES,
      products: [
        product({
          id: 'p1', sku: 'SK1', title: 'Test',
          compare_at_price: 10.0, image_url: 'https://example.com/img.jpg',
        }),
      ],
    });
    const { body } = await callGet();
    const item = body.items[0];

    expect(item).toHaveProperty('compareAtPrice', 10.0);
    expect(item).toHaveProperty('imageUrl', 'https://example.com/img.jpg');
    expect(item).not.toHaveProperty('compare_at_price');
    expect(item).not.toHaveProperty('image_url');
  });

  it('defaults pageSize to 24 when not provided', async () => {
    const { body } = await callGet();
    expect(body.pageInfo.pageSize).toBe(24);
  });

  it('caps pageSize at 100', async () => {
    const { body } = await callGet({ pageSize: '9999' });
    expect(body.pageInfo.pageSize).toBe(100);
  });

  it('orders by sold_count DESC', async () => {
    seedTestDb(testDb, {
      categories: CATEGORIES,
      products: [
        product({ id: 'low', sku: 'L', title: 'Low Sales', sold_count: 1 }),
        product({ id: 'high', sku: 'H', title: 'High Sales', sold_count: 999 }),
        product({ id: 'mid', sku: 'M', title: 'Mid Sales', sold_count: 50 }),
      ],
    });
    const { body } = await callGet();

    expect(body.items[0].id).toBe('high');
    expect(body.items[1].id).toBe('mid');
    expect(body.items[2].id).toBe('low');
  });
});
