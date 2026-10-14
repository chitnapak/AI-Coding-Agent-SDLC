import { test, expect } from "@playwright/test";

/**
 * Product detail page regression tests.
 * Uses the static demo product "british-beef-mince" which is always available.
 */

const PRODUCT_URL = "/products/british-beef-mince";

test.describe("Product detail page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PRODUCT_URL);
  });

  // ── Core product info ─────────────────────────────────────────────────────

  test("renders the product title as a heading", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: /British Beef Mince/i, level: 1 })
    ).toBeVisible();
  });

  test("renders the product price in the price box", async ({ page }) => {
    // Target the price <span> inside the price box (not the Add to Cart button text)
    const priceSpan = page.locator("span.font-mono").filter({ hasText: "$39.50" }).first();
    await expect(priceSpan).toBeVisible();
  });

  test("renders the SALE badge", async ({ page }) => {
    await expect(page.getByText(/SALE -12%/i)).toBeVisible();
  });

  test("renders the brand name", async ({ page }) => {
    await expect(page.getByText(/Farmart Fresh Farm/i)).toBeVisible();
  });

  // ── Gallery ───────────────────────────────────────────────────────────────

  test("main product image is visible", async ({ page }) => {
    const mainImage = page.locator("img").first();
    await expect(mainImage).toBeVisible();
  });

  test("thumbnail carousel has 4 images", async ({ page }) => {
    // Thumbnails are rendered as buttons inside the grid
    const thumbButtons = page.locator('button[class*="rounded-lg"][class*="h-20"]');
    await expect(thumbButtons).toHaveCount(4);
  });

  // ── Purchase controls ─────────────────────────────────────────────────────

  test("renders Add To Cart button", async ({ page }) => {
    await expect(
      page.getByRole("button", { name: /add to cart/i })
    ).toBeVisible();
  });

  test("renders Buy Now — Instant Checkout button", async ({ page }) => {
    await expect(
      page.getByRole("button", { name: /buy now/i })
    ).toBeVisible();
  });

  test("weight selector has three options: 500g, 1kg, 2kg Value Pack", async ({ page }) => {
    await expect(page.getByRole("button", { name: "500g" })).toBeVisible();
    await expect(page.getByRole("button", { name: "1kg" })).toBeVisible();
    await expect(page.getByRole("button", { name: "2kg Value Pack" })).toBeVisible();
  });

  test("selecting a different weight updates the price", async ({ page }) => {
    const addToCart = page.getByRole("button", { name: /add to cart/i });
    const before = await addToCart.innerText();

    await page.getByRole("button", { name: "1kg" }).click();
    const after = await addToCart.innerText();

    expect(before).not.toBe(after);
  });

  // ── Navigation ────────────────────────────────────────────────────────────

  test("breadcrumb contains a Home link that navigates back", async ({ page }) => {
    const homeLink = page.getByRole("link", { name: /home/i }).first();
    await expect(homeLink).toBeVisible();
    await homeLink.click();
    await expect(page).toHaveURL("/");
  });

  // ── Tabs / content sections ───────────────────────────────────────────────
  // TabsTrigger renders as a <button>, not role=tab. Match by visible text.

  test("product tab buttons are visible (Description, Nutrition, Reviews)", async ({ page }) => {
    await expect(
      page.getByRole("button", { name: /description.*chef tips/i })
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: /nutrition facts/i })
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: /reviews/i })
    ).toBeVisible();
  });

  test("clicking the Reviews tab shows customer reviews", async ({ page }) => {
    await page.getByRole("button", { name: /reviews/i }).click();
    await expect(page.getByText(/David Harrison/i)).toBeVisible();
  });
});
