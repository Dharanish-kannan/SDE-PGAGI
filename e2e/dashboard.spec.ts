import { test, expect } from "@playwright/test";

test.describe("Personalized Content Dashboard E2E", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("loads the personalized dashboard header and feed cards", async ({ page }) => {
    await expect(page.locator("header")).toBeVisible();
    await expect(page.locator("#global-search-input")).toBeVisible();
    
    // Check that feed items are rendered
    const cards = page.locator('[data-testid="content-card"]');
    await expect(cards.first()).toBeVisible();
  });

  test("filters content using the debounced search bar", async ({ page }) => {
    const searchInput = page.locator("#global-search-input");
    await searchInput.fill("Quantum");
    
    // Wait for 300ms debounce
    await page.waitForTimeout(400);

    // Verify filtered card headline contains query
    await expect(page.locator("text=Next-Gen Quantum Processors")).toBeVisible();
  });

  test("allows user to toggle dark / light / system themes", async ({ page }) => {
    const themeBtn = page.locator("#theme-toggle-btn");
    await expect(themeBtn).toBeVisible();

    const html = page.locator("html");
    const initialClass = await html.getAttribute("class");

    await themeBtn.click();
    const updatedClass = await html.getAttribute("class");
    expect(updatedClass).not.toBe(initialClass);
  });

  test("bookmarks an item to favorites and navigates to favorites section", async ({ page }) => {
    // Click favorite on first card
    const firstFavBtn = page.locator('[aria-label="Add to favorites"]').first();
    await firstFavBtn.click();

    // Navigate to Favorites section from sidebar
    await page.locator("#nav-item-favorites").click();

    // Expect saved card to appear in favorites view
    await expect(page.locator("text=Your personal vault of bookmarked stories")).toBeVisible();
    await expect(page.locator('[data-testid="content-card"]').first()).toBeVisible();
  });

  test("opens settings modal and configures category preferences", async ({ page }) => {
    const settingsBtn = page.locator("#open-settings-btn");
    await settingsBtn.click();

    // Expect modal to appear
    await expect(page.locator("#settings-modal-title")).toBeVisible();

    // Toggle category
    const catTech = page.locator("#pref-cat-technology");
    await catTech.click();

    // Close modal
    await page.locator("#close-settings-modal-btn").click();
    await expect(page.locator("#settings-modal-title")).not.toBeVisible();
  });

  test("allows profile modal interaction and mock authentication", async ({ page }) => {
    const profileBtn = page.locator("#user-profile-btn");
    await profileBtn.click();

    await expect(page.locator("#auth-modal-title")).toBeVisible();
    
    // Sign out button
    const authBtn = page.locator("#auth-toggle-btn");
    await authBtn.click();

    // Sign in again
    await authBtn.click();

    // Close auth modal
    await page.locator("#close-auth-modal-btn").click();
    await expect(page.locator("#auth-modal-title")).not.toBeVisible();
  });
});
