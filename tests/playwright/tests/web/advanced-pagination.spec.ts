import { seed } from "@repo/db/seed";
import { expect, test } from "./fixtures";

test.describe("WEB PAGINATION", () => {
  test.beforeEach(async () => {
    await seed();
  });

  test("Infinite scrolling loads more posts", async ({ page }) => {
    // Visit the home page
    await page.goto("/");
    
    // Count initial posts
    const initialPostsCount = await page.locator("article").count();
    
    // Scroll to the bottom to trigger infinite loading
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    
    // Wait for more posts to load
    await page.waitForTimeout(1000);
    
    // Count posts after scrolling
    const updatedPostsCount = await page.locator("article").count();
    
    // Verify more posts were loaded
    expect(updatedPostsCount).toBeGreaterThan(initialPostsCount);
  });

  test("Post filtering by category updates URL and content", async ({ page }) => {
    // Visit the home page
    await page.goto("/");
    
    // Get the first category link and its text
    const categoryLink = page.locator(".rounded-full.bg-blue-100").first();
    const categoryText = await categoryLink.textContent();
    
    // Click the category
    await categoryLink.click();
    
    // Verify URL contains the category
    await expect(page).toHaveURL(/\/category\/.+/);
    
    // Verify page title contains the category
    await expect(page.locator("h1")).toContainText(categoryText || "");
    
    // Verify all displayed posts have the correct category
    const posts = page.locator("article");
    const count = await posts.count();
    
    for (let i = 0; i < count; i++) {
      const postCategory = await posts.nth(i).locator(".rounded-full.bg-blue-100").textContent();
      expect(postCategory).toBe(categoryText);
    }
  });
});
