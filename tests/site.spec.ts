import { expect, test } from "@playwright/test";
import { readFile } from "node:fs/promises";

const routes = ["/", "/demo", "/app", "/privacy", "/terms", "/install", "/missing-page"];
const titles: Record<string, string> = {
  "/": "Offline File Bridge — keep folders ready offline",
  "/demo": "Demo — Offline File Bridge",
  "/app": "Folder mirrors — Offline File Bridge",
  "/privacy": "Privacy — Offline File Bridge",
  "/terms": "Terms — Offline File Bridge",
  "/install": "Install — Offline File Bridge",
  "/missing-page": "Page not found — Offline File Bridge"
};

for (const route of routes) {
  test(`${route} has one named page heading and landmarks`, async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
    await page.goto(route);
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page.locator("main")).toHaveCount(1);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("h1")).not.toBeEmpty();
    await expect(page).toHaveTitle(titles[route]);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /.+/);
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute("content", titles[route]);
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

test("known routes have their own canonical URL and an unknown URL has none", async ({ page }) => {
  await page.goto("/privacy");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://offline-file-bridge.sociobot.in/privacy");
  await page.goto("/missing-page");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Page not found");
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
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
  await page.keyboard.press("Enter");
  await expect(page.getByRole("heading", { level: 1 })).toBeFocused();
});

test("the browser folder input is not a hidden keyboard stop", async ({ page }) => {
  await page.goto("/app");
  await expect(page.locator("#folder-input")).toHaveAttribute("tabindex", "-1");
  await page.getByRole("button", { name: "Choose a folder" }).focus();
  await page.keyboard.press("Tab");
  await expect(page.locator("#folder-input")).not.toBeFocused();
});

test("mobile controls have 44px targets and 200% text reflows", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const route of ["/", "/demo"]) {
    await page.goto(route);
    const targets = await page.locator("a, button, input").evaluateAll((elements) => elements
      .filter((element) => {
        const style = getComputedStyle(element);
        const rect = element.getBoundingClientRect();
        return style.display !== "none" && style.visibility !== "hidden" && rect.width > 0 && rect.height > 0;
      })
      .map((element) => {
        const rect = element.getBoundingClientRect();
        return { text: element.textContent?.trim() || element.getAttribute("aria-label"), width: rect.width, height: rect.height };
      }));
    expect(targets.filter((target) => target.width < 44 || target.height < 44)).toEqual([]);
    await page.evaluate(() => { document.documentElement.style.fontSize = "200%"; });
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
  }
});

test("mobile secondary labels keep the 16px reading baseline", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const route of ["/", "/demo"]) {
    await page.goto(route);
    const sizes = await page.locator(".site-nav a, .action-note, .site-footer, .folder-header p, .file-meta, .status").evaluateAll((elements) => elements.map((element) => ({
      text: element.textContent?.trim(),
      size: Number.parseFloat(getComputedStyle(element).fontSize)
    })));
    expect(sizes).not.toEqual([]);
    expect(sizes.filter((item) => item.size < 16)).toEqual([]);
  }
});

test("landing exposes a direct latest-APK action", async ({ page }) => {
  const identity = JSON.parse(await readFile("dist/build-identity.json", "utf8")) as { commit: string };
  await page.route("https://api.github.com/repos/B-Divyesh/sf-offline-file-bridge/releases/latest", async (route) => {
    await route.fulfill({ json: {
      tag_name: "v0.1.2",
      assets: [
        { name: "offline-file-bridge-v0.1.2.apk", browser_download_url: "https://example.test/offline-file-bridge-v0.1.2.apk" },
        { name: "SHA256SUMS", browser_download_url: "https://example.test/SHA256SUMS" },
        { name: "BUILD-PROVENANCE.json", browser_download_url: "https://example.test/BUILD-PROVENANCE.json" }
      ]
    } });
  });
  await page.route("https://api.github.com/repos/B-Divyesh/sf-offline-file-bridge/git/ref/tags/v0.1.2", async (route) => {
    await route.fulfill({ json: { object: { type: "commit", sha: identity.commit } } });
  });
  await page.goto("/");
  await page.getByRole("button", { name: "Download the latest APK" }).click();
  await expect(page.getByRole("link", { name: "Download APK v0.1.2" })).toHaveAttribute("href", "https://example.test/offline-file-bridge-v0.1.2.apk");
  await expect(page.getByText("This APK matches this site.")).toBeVisible();
});

test("landing refuses an APK from an older candidate", async ({ page }) => {
  await page.route("https://api.github.com/repos/B-Divyesh/sf-offline-file-bridge/releases/latest", async (route) => {
    await route.fulfill({ json: {
      tag_name: "v0.1.1",
      assets: [{ name: "offline-file-bridge-v0.1.1.apk", browser_download_url: "https://example.test/stale.apk" }]
    } });
  });
  await page.goto("/");
  await page.getByRole("button", { name: "Download the latest APK" }).click();
  await expect(page.getByRole("button", { name: "APK v0.1.2 is being published" })).toBeDisabled();
  await expect(page.getByText("A matching APK is not ready yet. The PWA is ready to install now.")).toBeVisible();
  await expect(page.locator('a[href="https://example.test/stale.apk"]')).toHaveCount(0);
});
