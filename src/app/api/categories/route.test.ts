/**
 * Integration tests for GET /api/categories
 *
 * Calls the route handler directly with a mocked in-memory DB.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createTestDb, seedTestDb } from '@/test/helpers';

// ── Mock DB & migrate ─────────────────────────────────────────────────────────
const testDb = createTestDb();
vi.mock('@/lib/db', () => ({ db: testDb }));
vi.mock('@/lib/migrate', () => ({ migrate: vi.fn() }));

// Import after mocks
const { GET } = await import('@/app/api/categories/route');

// ── Helpers ───────────────────────────────────────────────────────────────────
function makeRequest(url = 'http://localhost/api/categories') {
  return new Request(url) as unknown as import('next/server').NextRequest;
}

async function callGet(url?: string) {
  const res = await GET(makeRequest(url) as never);
  const body = await res.json();
  return { status: res.status, body };
}

// ── Fixtures ──────────────────────────────────────────────────────────────────
const CATEGORIES = [
  { id: 'fruits', name: 'Fruits & Vegetables', icon: '🍎', image_url: 'https://example.com/fruits.jpg', product_count: 32, sort_order: 1 },
  { id: 'breads', name: 'Breads & Sweets', icon: '🥖', image_url: 'https://example.com/breads.jpg', product_count: 24, sort_order: 2 },
  { id: 'seafood', name: 'Frozen Seafoods', icon: '🦀', image_url: null, product_count: 0, sort_order: 3 },
];

// ── Tests ─────────────────────────────────────────────────────────────────────
describe('GET /api/categories', () => {
  beforeEach(() => {
    testDb.exec(`DELETE FROM categories`);
  });

  it('returns 200 with an array of categories', async () => {
    seedTestDb(testDb, { categories: CATEGORIES });
    const { status, body } = await callGet();

    expect(status).toBe(200);
    expect(Array.isArray(body)).toBe(true);
    expect(body).toHaveLength(3);
  });

  it('returns an empty array when no categories exist', async () => {
    const { status, body } = await callGet();

    expect(status).toBe(200);
    expect(body).toEqual([]);
  });

  it('returns categories sorted by sort_order ASC', async () => {
    seedTestDb(testDb, {
      categories: [
        { id: 'z', name: 'Last', sort_order: 99 },
        { id: 'a', name: 'First', sort_order: 1 },
        { id: 'm', name: 'Middle', sort_order: 5 },
      ],
    });
    const { body } = await callGet();

    expect(body[0].id).toBe('a');
    expect(body[1].id).toBe('m');
    expect(body[2].id).toBe('z');
  });

  it('returns the correct shape for each category', async () => {
    seedTestDb(testDb, {
      categories: [
        {
          id: 'fruits',
          name: 'Fruits & Vegetables',
          icon: '🍎',
          image_url: 'https://example.com/fruits.jpg',
          product_count: 32,
          sort_order: 1,
        },
      ],
    });
    const { body } = await callGet();
    const cat = body[0];

    expect(cat).toMatchObject({
      id: 'fruits',
      name: 'Fruits & Vegetables',
      icon: '🍎',
      imageUrl: 'https://example.com/fruits.jpg',
      productCount: 32,
    });
    // Should not expose snake_case fields
    expect(cat).not.toHaveProperty('image_url');
    expect(cat).not.toHaveProperty('product_count');
    expect(cat).not.toHaveProperty('sort_order');
  });
});
