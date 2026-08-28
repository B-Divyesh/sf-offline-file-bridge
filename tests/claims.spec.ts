import { expect, test } from "@playwright/test";
import { readFile } from "node:fs/promises";

test("@claim:offline-reload works offline after the first visit", async ({ page, context }) => {
  await page.goto("/demo");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Open your offline folders");
  await expect(page.getByText("Field notes", { exact: true })).toBeVisible();
  await page.waitForFunction(() => navigator.serviceWorker?.controller !== null);
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByText("Offline — ready files still open")).toBeVisible();
  await page.getByRole("button", { name: "Share / open" }).first().click();
  await expect(page.getByRole("dialog")).toContainText("ridge-route.pdf");
});

test("@claim:demo-sandbox uses only its demo storage namespace", async ({ page }) => {
  await page.goto("/demo");
  await expect(page.getByText("Demo — sample data, nothing is saved")).toBeVisible();
  const keys = await page.evaluate(() => Object.keys(localStorage));
  expect(keys.length).toBeGreaterThan(0);
  expect(keys.every((key) => key.startsWith("demo:") || key.startsWith("sb_license:"))).toBe(true);
  const databases = await page.evaluate(async () => (await indexedDB.databases()).map((database) => database.name));
  expect(databases).not.toContain("offline-file-bridge-real");
});

test("@claim:local-only sends no demo file data off-device", async ({ page }) => {
  const foreignRequests: string[] = [];
  page.on("request", (request) => {
    const url = new URL(request.url());
    if (url.origin !== "http://127.0.0.1:4173") foreignRequests.push(request.url());
  });
  await page.goto("/demo");
  await page.getByRole("button", { name: "Refresh local copy" }).click();
  await page.getByRole("button", { name: "Share / open" }).nth(1).click();
  await expect(page.getByRole("dialog")).toContainText("specimen-log.csv");
  expect(foreignRequests).toEqual([]);
});

test("@claim:freshness shows the last successful refresh", async ({ page }) => {
  await page.goto("/demo");
  await page.getByRole("button", { name: "Refresh local copy" }).click();
  await expect(page.getByText("Ready · synced just now")).toBeVisible();
  await expect(page.getByText("3", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("Field notes was removed.")).toHaveCount(0);
});

test("@claim:file-handoff opens and saves a ready sample file", async ({ page }) => {
  await page.goto("/demo");
  await page.getByRole("button", { name: "Share / open" }).nth(2).click();
  await expect(page.getByRole("dialog")).toContainText("handoff-notes.md");
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Save sample" }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe("handoff-notes.md");
});

test("@claim:scoped-folder-access requests no broad Android storage permission", async () => {
  const manifest = await readFile("android/app/src/main/AndroidManifest.xml", "utf8");
  const plugin = await readFile("android/app/src/main/java/in/sociobot/offline_file_bridge/OfflineBridgePlugin.java", "utf8");
  expect(manifest).not.toContain("READ_EXTERNAL_STORAGE");
  expect(manifest).not.toContain("MANAGE_EXTERNAL_STORAGE");
  expect(plugin).toContain("ACTION_OPEN_DOCUMENT_TREE");
  expect(plugin).toContain("takePersistableUriPermission");
});

test("@claim:free-tier keeps one folder and lists the Pro price", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("One folder is free.")).toBeVisible();
  await expect(page.getByText("$14")).toBeVisible();
  const buy = page.getByRole("link", { name: "Buy Bridge Pro" });
  await expect(buy).toHaveAttribute("href", "https://api.sociobot.in/api/v1/products/offline-file-bridge/checkout");
});
