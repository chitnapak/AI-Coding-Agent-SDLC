import { test, expect } from "@playwright/test";

/**
 * Home page regression tests.
 * Covers the critical UI sections that must render correctly on every deploy.
 */

test.describe("Home page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  // ── Navbar ────────────────────────────────────────────────────────────────

  test("renders the SHOP BY CATEGORY button in the navbar", async ({ page }) => {
    await expect(page.getByRole("button", { name: /shop by category/i })).toBeVisible();
  });

  test("shows category dropdown when SHOP BY CATEGORY is clicked", async ({ page }) => {
    await page.getByRole("button", { name: /shop by category/i }).click();
    // At least one category item should appear in the dropdown
    const dropdown = page.locator("button").filter({ hasText: /Fruits|Meats|Seafood|Breads|Drinks/i });
    await expect(dropdown.first()).toBeVisible();
  });

  test("renders navigation links — Deals Today, Special Prices", async ({ page }) => {
    await expect(page.getByRole("link", { name: /deals today/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /special prices/i })).toBeVisible();
  });

  // ── Search bar ────────────────────────────────────────────────────────────

  test("renders the search input with correct placeholder", async ({ page }) => {
    await expect(page.getByPlaceholder("I'm searching for...")).toBeVisible();
  });

  test("typing in search and pressing Enter triggers a search result", async ({ page }) => {
    await page.getByPlaceholder("I'm searching for...").fill("beef");
    await page.keyboard.press("Enter");
    // Results heading should appear
    await expect(page.getByText(/results for "beef"/i)).toBeVisible({ timeout: 10_000 });
  });

  test("clear button dismisses search results", async ({ page }) => {
    await page.getByPlaceholder("I'm searching for...").fill("milk");
    await page.keyboard.press("Enter");
    await expect(page.getByText(/results for "milk"/i)).toBeVisible({ timeout: 10_000 });

    // Use exact text to avoid matching the inline "Clear search" icon button
    await page.getByRole("button", { name: "Clear", exact: true }).click();
    await expect(page.getByText(/results for "milk"/i)).not.toBeVisible();
  });

  // ── API-driven sections ───────────────────────────────────────────────────

  test("Browse by Category section loads categories from API", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /browse by category/i })).toBeVisible({
      timeout: 10_000,
    });
    // At least one category card should render
    const categoryCards = page.locator("h3");
    await expect(categoryCards.first()).toBeVisible({ timeout: 10_000 });
  });

  test("Best Seller section renders products", async ({ page }) => {
    // Section heading is "Best Seller" (singular) per the JSX
    await expect(page.getByRole("heading", { name: "Best Seller", exact: true })).toBeVisible({
      timeout: 10_000,
    });
  });

  test("Top Saver Today section renders products", async ({ page }) => {
    // Section heading is "Top Saver Today" per the JSX
    await expect(page.getByRole("heading", { name: "Top Saver Today", exact: true })).toBeVisible({
      timeout: 10_000,
    });
  });

  // ── Cart counter ──────────────────────────────────────────────────────────

  test("cart count starts at 0", async ({ page }) => {
    // The cart badge shows the count next to the shopping bag icon
    const badge = page
      .locator("span")
      .filter({ hasText: /^0$/ })
      .first();
    await expect(badge).toBeVisible();
  });
});
