/**
 * Integration tests for GET /api/products/[productId]
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { createTestDb, seedTestDb } from '@/test/helpers';

const testDb = createTestDb();
vi.mock('@/lib/db', () => ({ db: testDb }));
vi.mock('@/lib/migrate', () => ({ migrate: vi.fn() }));

const { GET } = await import('@/app/api/products/[productId]/route');

// ── Helpers ───────────────────────────────────────────────────────────────────
function makeContext(productId: string) {
  // The route does: const { productId } = params as unknown as { productId: string }
  // So we pass a plain object (not a Promise) to satisfy the cast
  return {
    params: { productId } as unknown as { params: Promise<{ productId: string }> },
  };
}

async function callGet(productId: string) {
  const req = new NextRequest(`http://localhost/api/products/${productId}`);
  const res = await GET(req, makeContext(productId) as never);
  return { status: res.status, body: await res.json() };
}

// ── Fixtures ──────────────────────────────────────────────────────────────────
const CATEGORY = { id: 'fruits', name: 'Fruits', sort_order: 1 };

const BASE_PRODUCT = {
  id: 'prod-1',
  sku: 'SKU-001',
  title: 'Fresh Apple',
  brand: 'FarmA',
  category_id: 'fruits',
  description: 'Delicious apples',
  price: 4.99,
  compare_at_price: 7.99,
  image_url: 'https://example.com/apple.jpg',
  rating: 4.5,
  review_count: 10,
  sold_count: 100,
  is_active: 1,
};

// ── Tests ─────────────────────────────────────────────────────────────────────
describe('GET /api/products/[productId]', () => {
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

  it('returns 404 when product does not exist', async () => {
    const { status, body } = await callGet('nonexistent');

    expect(status).toBe(404);
    expect(body).toMatchObject({ code: 'not_found' });
  });

  it('returns 404 for inactive products', async () => {
    seedTestDb(testDb, {
      categories: [CATEGORY],
      products: [{ ...BASE_PRODUCT, id: 'inactive', sku: 'INACTIVE', is_active: 0 }],
    });
    const { status, body } = await callGet('inactive');

    expect(status).toBe(404);
    expect(body.code).toBe('not_found');
  });

  it('returns 200 with product details', async () => {
    seedTestDb(testDb, {
      categories: [CATEGORY],
      products: [BASE_PRODUCT],
    });
    const { status, body } = await callGet('prod-1');

    expect(status).toBe(200);
    expect(body).toMatchObject({
      id: 'prod-1',
      title: 'Fresh Apple',
      brand: 'FarmA',
      category: 'Fruits',
      description: 'Delicious apples',
      price: 4.99,
      compareAtPrice: 7.99,
      imageUrl: 'https://example.com/apple.jpg',
      rating: 4.5,
      reviewCount: 10,
      soldCount: 100,
    });
  });

  it('returns empty arrays when product has no images/variants/highlights', async () => {
    seedTestDb(testDb, {
      categories: [CATEGORY],
      products: [BASE_PRODUCT],
    });
    const { body } = await callGet('prod-1');

    expect(body.images).toEqual([]);
    expect(body.variants).toEqual([]);
    expect(body.highlights).toEqual([]);
    expect(body.relatedProducts).toEqual([]);
  });

  it('returns product images in sort_order', async () => {
    seedTestDb(testDb, {
      categories: [CATEGORY],
      products: [BASE_PRODUCT],
      productImages: [
        { product_id: 'prod-1', url: 'https://example.com/img2.jpg', sort_order: 2 },
        { product_id: 'prod-1', url: 'https://example.com/img1.jpg', sort_order: 1 },
      ],
    });
    const { body } = await callGet('prod-1');

    expect(body.images).toEqual([
      'https://example.com/img1.jpg',
      'https://example.com/img2.jpg',
    ]);
  });

  it('returns product variants', async () => {
    seedTestDb(testDb, {
      categories: [CATEGORY],
      products: [BASE_PRODUCT],
      productVariants: [
        { id: 'v1', product_id: 'prod-1', label: '500g', price: 4.99, in_stock: 1 },
        { id: 'v2', product_id: 'prod-1', label: '1kg', price: 8.99, compare_at_price: 11.0, in_stock: 0, available_quantity: null },
      ],
    });
    const { body } = await callGet('prod-1');

    expect(body.variants).toHaveLength(2);
    expect(body.variants[0]).toMatchObject({
      id: 'v1',
      label: '500g',
      price: 4.99,
      inStock: 1,
    });
    expect(body.variants[1]).toMatchObject({
      id: 'v2',
      label: '1kg',
      compareAtPrice: 11.0,
      inStock: 0,
    });
  });

  it('returns product highlights', async () => {
    seedTestDb(testDb, {
      categories: [CATEGORY],
      products: [BASE_PRODUCT],
      productHighlights: [
        { product_id: 'prod-1', title: 'Organic', description: '100% organic' },
        { product_id: 'prod-1', title: 'Fresh', description: 'Picked today' },
      ],
    });
    const { body } = await callGet('prod-1');

    expect(body.highlights).toHaveLength(2);
    expect(body.highlights[0]).toMatchObject({ title: 'Organic', description: '100% organic' });
  });

  it('returns related products from same category (max 6, excludes self)', async () => {
    const related = Array.from({ length: 7 }, (_, i) => ({
      id: `rel${i + 1}`,
      sku: `R${i + 1}`,
      title: `Related ${i + 1}`,
      category_id: 'fruits',
      price: 1.0,
    }));
    seedTestDb(testDb, {
      categories: [CATEGORY],
      products: [BASE_PRODUCT, ...related],
    });
    const { body } = await callGet('prod-1');

    // max 6, self excluded
    expect(body.relatedProducts).toHaveLength(6);
    const ids = body.relatedProducts.map((p: { id: string }) => p.id);
    expect(ids).not.toContain('prod-1');
  });

  it('does not expose snake_case fields in response', async () => {
    seedTestDb(testDb, {
      categories: [CATEGORY],
      products: [BASE_PRODUCT],
    });
    const { body } = await callGet('prod-1');

    expect(body).not.toHaveProperty('compare_at_price');
    expect(body).not.toHaveProperty('image_url');
    expect(body).not.toHaveProperty('review_count');
    expect(body).not.toHaveProperty('sold_count');
  });
});
