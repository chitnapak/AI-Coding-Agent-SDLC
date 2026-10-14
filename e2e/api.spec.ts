import { test, expect } from "@playwright/test";

/**
 * API regression tests — called directly via fetch (no browser UI needed).
 * Verifies that every public endpoint keeps its contract: status, shape, types.
 */

test.describe("GET /api/catalog/home", () => {
  test("returns 200 with correct top-level shape", async ({ request }) => {
    const res = await request.get("/api/catalog/home");
    expect(res.status()).toBe(200);

    const body = await res.json();
    expect(body).toHaveProperty("categories");
    expect(body).toHaveProperty("featuredBrands");
    expect(body).toHaveProperty("topSavers");
    expect(body).toHaveProperty("bestSellers");
  });

  test("categories is a non-empty array with id, name, productCount", async ({ request }) => {
    const res = await request.get("/api/catalog/home");
    const { categories } = await res.json();

    expect(Array.isArray(categories)).toBe(true);
    expect(categories.length).toBeGreaterThan(0);

    const first = categories[0];
    expect(first).toHaveProperty("id");
    expect(first).toHaveProperty("name");
    expect(first).toHaveProperty("productCount");
  });

  test("topSavers items have required product fields", async ({ request }) => {
    const res = await request.get("/api/catalog/home");
    const { topSavers } = await res.json();

    expect(Array.isArray(topSavers)).toBe(true);
    if (topSavers.length > 0) {
      const item = topSavers[0];
      expect(item).toHaveProperty("id");
      expect(item).toHaveProperty("title");
      expect(item).toHaveProperty("price");
    }
  });
});

test.describe("GET /api/categories", () => {
  test("returns 200 with an array of categories", async ({ request }) => {
    const res = await request.get("/api/categories");
    expect(res.status()).toBe(200);

    const body = await res.json();
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThan(0);
  });

  test("each category has id, name, productCount", async ({ request }) => {
    const res = await request.get("/api/categories");
    const categories = await res.json();

    for (const cat of categories) {
      expect(cat).toHaveProperty("id");
      expect(cat).toHaveProperty("name");
      expect(cat).toHaveProperty("productCount");
    }
  });
});

test.describe("GET /api/products", () => {
  test("returns 200 with paginated shape", async ({ request }) => {
    const res = await request.get("/api/products");
    expect(res.status()).toBe(200);

    const body = await res.json();
    expect(body).toHaveProperty("items");
    expect(body).toHaveProperty("pageInfo");
    expect(Array.isArray(body.items)).toBe(true);
  });

  test("pageInfo contains page, pageSize, total", async ({ request }) => {
    const res = await request.get("/api/products?page=1&pageSize=5");
    const { pageInfo } = await res.json();

    expect(pageInfo).toHaveProperty("page", 1);
    expect(pageInfo).toHaveProperty("pageSize", 5);
    expect(pageInfo).toHaveProperty("total");
    expect(typeof pageInfo.total).toBe("number");
  });

  test("respects pageSize param — returns at most pageSize items", async ({ request }) => {
    const res = await request.get("/api/products?pageSize=3");
    const { items } = await res.json();
    expect(items.length).toBeLessThanOrEqual(3);
  });

  test("free-text search with q= filters results", async ({ request }) => {
    const res = await request.get("/api/products?q=beef");
    expect(res.status()).toBe(200);

    const { items } = await res.json();
    // Every returned item should mention "beef" in title or brand (case-insensitive)
    for (const item of items) {
      const combined = `${item.title} ${item.brand ?? ""}`.toLowerCase();
      expect(combined).toContain("beef");
    }
  });

  test("category filter returns only products in that category", async ({ request }) => {
    // Get a valid category id first
    const catRes = await request.get("/api/categories");
    const categories = await catRes.json();
    expect(categories.length).toBeGreaterThan(0);

    const firstCat = categories[0];
    const res = await request.get(`/api/products?category=${firstCat.id}`);
    expect(res.status()).toBe(200);

    const { items } = await res.json();
    for (const item of items) {
      expect(item.category).toBe(firstCat.name);
    }
  });

  test("pageSize is capped at 100", async ({ request }) => {
    const res = await request.get("/api/products?pageSize=999");
    expect(res.status()).toBe(200);
    const { pageInfo } = await res.json();
    expect(pageInfo.pageSize).toBeLessThanOrEqual(100);
  });
});

test.describe("GET /api/products/:productId", () => {
  test("returns 200 for a valid product id", async ({ request }) => {
    // Fetch any product from the list first
    const listRes = await request.get("/api/products?pageSize=1");
    const { items } = await listRes.json();
    expect(items.length).toBeGreaterThan(0);

    const id = items[0].id;
    const res = await request.get(`/api/products/${id}`);
    expect(res.status()).toBe(200);

    const body = await res.json();
    expect(body).toHaveProperty("id", id);
    expect(body).toHaveProperty("title");
    expect(body).toHaveProperty("price");
  });

  test("returns 404 for an unknown product id", async ({ request }) => {
    const res = await request.get("/api/products/does-not-exist-xyz");
    expect(res.status()).toBe(404);
  });
});
