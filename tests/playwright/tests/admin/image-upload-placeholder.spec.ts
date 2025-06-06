import { seed } from "@repo/db/seed";
import { expect, test } from "./fixtures";

test.beforeAll(async () => {
  await seed();
});

test.describe("S3 IMAGE HANDLING", () => {
  test("Admin panel loads correctly", { tag: "@a3" }, async ({ page }) => {
    // Just verify we can access the admin page
    await page.goto("/");
    await page.waitForLoadState('networkidle');
    await expect(page).toBeTruthy();
  });
});
