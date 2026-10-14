/**
 * Integration tests for GET /api/products/[productId]/reviews
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { createTestDb, seedTestDb } from '@/test/helpers';

const testDb = createTestDb();
vi.mock('@/lib/db', () => ({ db: testDb }));
vi.mock('@/lib/migrate', () => ({ migrate: vi.fn() }));

const { GET } = await import('@/app/api/products/[productId]/reviews/route');

// ── Helpers ───────────────────────────────────────────────────────────────────
function makeContext(productId: string) {
  // The route does: const { productId } = params as unknown as { productId: string }
  // So we pass a plain object (not a Promise) to satisfy the cast
  return {
    params: { productId } as unknown as { params: Promise<{ productId: string }> },
  };
}

function makeRequest(productId: string, params: Record<string, string> = {}) {
  const url = new URL(`http://localhost/api/products/${productId}/reviews`);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  return new NextRequest(url);
}

async function callGet(productId: string, params: Record<string, string> = {}) {
  const req = makeRequest(productId, params);
  const res = await GET(req, makeContext(productId) as never);
  return { status: res.status, body: await res.json() };
}

// ── Fixtures ──────────────────────────────────────────────────────────────────
const PRODUCT = {
  id: 'prod-1', sku: 'SK1', title: 'Apple', price: 5.0, category_id: 'fruits',
};

const CATEGORY = { id: 'fruits', name: 'Fruits', sort_order: 1 };

function makeReview(overrides: Record<string, unknown> = {}) {
  return {
    id: 'r1',
    product_id: 'prod-1',
    author: 'Alice',
    rating: 5,
    comment: 'Great product!',
    verified: 0,
    ...overrides,
  };
}

// ── Tests ─────────────────────────────────────────────────────────────────────
describe('GET /api/products/[productId]/reviews', () => {
  beforeEach(() => {
    testDb.exec(`
      DELETE FROM reviews;
      DELETE FROM product_highlights;
      DELETE FROM product_variants;
      DELETE FROM product_images;
      DELETE FROM products;
      DELETE FROM categories;
    `);
    seedTestDb(testDb, {
      categories: [CATEGORY],
      products: [PRODUCT],
    });
  });

  it('returns 200 with items array and pageInfo', async () => {
    const { status, body } = await callGet('prod-1');

    expect(status).toBe(200);
    expect(body).toHaveProperty('items');
    expect(body).toHaveProperty('pageInfo');
    expect(Array.isArray(body.items)).toBe(true);
  });

  it('returns empty items for product with no reviews', async () => {
    const { body } = await callGet('prod-1');

    expect(body.items).toEqual([]);
    expect(body.pageInfo.total).toBe(0);
  });

  it('returns empty items for non-existent product', async () => {
    const { body } = await callGet('nonexistent');

    expect(body.items).toEqual([]);
    expect(body.pageInfo.total).toBe(0);
  });

  it('returns reviews for the given product only', async () => {
    // Add a second product (no category_id so no FK issue)
    seedTestDb(testDb, {
      products: [{ id: 'prod-2', sku: 'SK2', title: 'Bread', price: 3.0 }],
      reviews: [
        makeReview({ id: 'r1', product_id: 'prod-1' }),
        makeReview({ id: 'r2', product_id: 'prod-2' }),
      ],
    });
    const { body } = await callGet('prod-1');

    expect(body.items).toHaveLength(1);
    expect(body.items[0].id).toBe('r1');
  });

  it('returns reviews sorted by created_at DESC', async () => {
    seedTestDb(testDb, {
      reviews: [
        makeReview({ id: 'r1', comment: 'Old' }),
        makeReview({ id: 'r2', comment: 'New' }),
      ],
    });
    // Override created_at directly in DB after insert
    testDb.exec(`
      UPDATE reviews SET created_at = '2024-01-01T00:00:00' WHERE id = 'r1';
      UPDATE reviews SET created_at = '2024-06-01T00:00:00' WHERE id = 'r2';
    `);
    const { body } = await callGet('prod-1');

    expect(body.items[0].id).toBe('r2');
    expect(body.items[1].id).toBe('r1');
  });

  it('returns correct review shape', async () => {
    seedTestDb(testDb, {
      reviews: [
        makeReview({ id: 'r1', author: 'Alice', rating: 5, comment: 'Excellent', verified: 1 }),
      ],
    });
    const { body } = await callGet('prod-1');
    const review = body.items[0];

    expect(review).toHaveProperty('id', 'r1');
    expect(review).toHaveProperty('author', 'Alice');
    expect(review).toHaveProperty('rating', 5);
    expect(review).toHaveProperty('comment', 'Excellent');
    expect(review).toHaveProperty('verified', 1);
    expect(review).toHaveProperty('createdAt');
  });

  it('paginates correctly with page and pageSize', async () => {
    const reviews = Array.from({ length: 5 }, (_, i) =>
      makeReview({ id: `r${i + 1}`, author: `User${i + 1}`, comment: `Comment ${i + 1}` })
    );
    seedTestDb(testDb, { reviews });

    const { body } = await callGet('prod-1', { page: '2', pageSize: '2' });

    expect(body.items).toHaveLength(2);
    expect(body.pageInfo).toMatchObject({ page: 2, pageSize: 2, total: 5 });
  });

  it('defaults pageSize to 24', async () => {
    const { body } = await callGet('prod-1');
    expect(body.pageInfo.pageSize).toBe(24);
  });

  it('caps pageSize at 100', async () => {
    const { body } = await callGet('prod-1', { pageSize: '999' });
    expect(body.pageInfo.pageSize).toBe(100);
  });

  it('returns correct total count in pageInfo', async () => {
    const reviews = Array.from({ length: 7 }, (_, i) =>
      makeReview({ id: `r${i + 1}`, author: `User${i + 1}`, comment: `Comment ${i + 1}` })
    );
    seedTestDb(testDb, { reviews });

    const { body } = await callGet('prod-1', { pageSize: '3' });

    expect(body.pageInfo.total).toBe(7);
    expect(body.items).toHaveLength(3);
  });
});
