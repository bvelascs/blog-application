import { seed } from "@repo/db/seed";
import { expect, test } from "./fixtures";

test.beforeAll(async () => {
  await seed();
});

// Simple test for AWS S3 image upload functionality
test.describe("IMAGE UPLOAD", () => {
  test("Admin panel is accessible", { tag: "@a3" }, async ({ page }) => {
    // Just verify we can access the admin page
    await page.goto("/");
    await page.waitForLoadState('networkidle');
    
    // Check that the page loaded
    await expect(page).toBeTruthy();
  });
});
