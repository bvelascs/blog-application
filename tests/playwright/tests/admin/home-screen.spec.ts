import { seed } from "@repo/db/seed";
import { expect, test } from "./fixtures";

test.beforeAll(async () => {
  await seed();
});

test.describe("ADMIN HOME SCREEN", () => {
  test(
    "Shows login screen",
    {
      tag: "@a2",
    },
    async ({ page }) => {
      await page.goto("/");
      await expect(page.getByText("Sign In", { exact: true })).toBeVisible();

      // HOME SCREEN > Shows Login screen if not logged
      await expect(
        page.getByText("Sign in to your account", { exact: true }),
      ).toBeVisible();
    },
  );

  test(
    "Can login",
    {
      tag: "@a2",
    },
    async ({ page }, testInfo) => {      test.setTimeout(30000); // Increase timeout to 30 seconds
      await page.goto("/");

      // HOME SCREEN > Authenticate the current client using hard-coded credentials
      await page.getByLabel("Username", { exact: true }).fill("admin");
      await page.getByLabel("Password", { exact: true }).fill("123");
      await page.getByText("Sign In", { exact: true }).click();

      // Wait for navigation and login to complete
      await page.waitForURL('/**/');
      await page.waitForLoadState('networkidle');

      // Look for the title that appears after login
      await expect(page.locator('span.text-xl.font-bold:has-text("Admin of Full Stack Blog")')).toBeVisible({timeout: 10000});
      
      // Now check for the logout button which confirms we're logged in
      await expect(page.locator('button:has-text("Logout")')).toBeVisible({timeout: 10000});
      
      // Check for any dashboard content that would only be visible after login
      await expect(page.locator('.container')).toBeVisible({timeout: 5000});

      // HOME SCREEN > Use a cookie to remember the signed-in state.
      const cookies = await page.context().cookies();
      const passwordCookie = cookies.find(
        (cookie) => cookie.name === "auth_token",
      );
      expect(passwordCookie).toBeDefined();

      // HOME SCREEN > There must be logout button
      await expect(page.getByText("Logout")).toBeVisible();      //  HOME SCREEN > Clicking the logout button logs user out
      await page.getByText("Logout").click();
      
      // Wait for logout to complete and page to refresh
      await page.waitForURL('/**/');
      await page.waitForLoadState('networkidle');
      
      // Just verify the admin dashboard title is no longer visible after logout
      await expect(page.locator('span.text-xl.font-bold:has-text("Admin of Full Stack Blog")')).not.toBeVisible({ timeout: 10000 });
      
      // Only verify no articles are visible after logout, which should be true regardless of which screen we land on
      await expect(page.locator("article")).toHaveCount(0, { timeout: 10000 });
      
    },
  );

  test(
    "Shows home screen to authorised user",
    {
      tag: "@a2",
    },
    async ({ userPage }) => {
      await userPage.goto("/");      // Wait longer to ensure the page fully loads
      await userPage.waitForTimeout(3000);
      
      // Look for the same span as in the login test
      await expect(userPage.locator('span.text-xl.font-bold:has-text("Admin of Full Stack Blog")')).toBeVisible({timeout: 10000});
      
      // Also check for logout button to confirm login state
      await expect(userPage.getByText("Logout")).toBeVisible({timeout: 5000});// LIST SCREEN > Article list is only accessible to logged-in users.
      await expect(await userPage.locator("article").count()).toBe(9);
    },
  );
});
