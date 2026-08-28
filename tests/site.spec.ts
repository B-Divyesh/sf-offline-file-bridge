import { expect, test } from "@playwright/test";

const routes = ["/", "/demo", "/app", "/privacy", "/terms", "/install", "/missing-page"];

for (const route of routes) {
  test(`${route} has one named page heading and landmarks`, async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
    await page.goto(route);
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page.locator("main")).toHaveCount(1);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("h1")).not.toBeEmpty();
    await expect(page).toHaveTitle(/Offline File Bridge/);
    await expect(page.locator("img:not([alt])")).toHaveCount(0);
    expect(errors).toEqual([]);
  });
}

test("mobile landing has no horizontal overflow", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const sizes = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, client: document.documentElement.clientWidth }));
  expect(sizes.scroll).toBeLessThanOrEqual(sizes.client);
  await expect(page.getByRole("link", { name: /Try it with sample data/ })).toBeVisible();
});

test("demo query opens the isolated sample", async ({ page }) => {
  await page.goto("/?demo=1");
  await expect(page.getByText("Demo — sample data, nothing is saved")).toBeVisible();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Open your offline folders");
});

test("keyboard navigation reaches the primary action", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to main content" })).toBeFocused();
  await page.keyboard.press("Enter");
  for (let index = 0; index < 8; index += 1) {
    if (await page.getByRole("link", { name: /Try it with sample data/ }).evaluate((element) => element === document.activeElement)) break;
    await page.keyboard.press("Tab");
  }
  await expect(page.getByRole("link", { name: /Try it with sample data/ })).toBeFocused();
});
