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
  await page.getByRole("button", { name: "Preview ridge-route.pdf" }).click();
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

test("@claim:demo-ready-sample opens a ready, isolated sample in one click", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: /Try it with sample data/ }).click();
  await expect(page).toHaveURL(/\/demo$/);
  await expect(page.getByText("Demo — sample data, nothing is saved")).toBeVisible();
  await expect(page.getByRole("heading", { level: 2, name: "Field notes" })).toBeVisible();
  await expect(page.getByText("Ready · synced 12 min ago")).toBeVisible();
  await expect(page.getByRole("button", { name: "Preview ridge-route.pdf" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Preview specimen-log.csv" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Preview handoff-notes.md" })).toBeVisible();
  const databases = await page.evaluate(async () => (await indexedDB.databases()).map((database) => database.name));
  expect(databases).not.toContain("offline-file-bridge-real");
});

test("@claim:demo-reset restores the displayed seed without a reload", async ({ page }) => {
  await page.goto("/demo");
  await page.getByRole("button", { name: "Refresh local copy" }).click();
  await expect(page.getByText("Ready · synced just now")).toBeVisible();
  await page.getByRole("button", { name: "Reset demo" }).click();
  await expect(page.getByText("Sample data was reset.")).toBeVisible();
  await expect(page.getByText("Ready · synced 12 min ago")).toBeVisible();
  await expect(page.getByText("Ready · synced just now")).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Reset demo" })).toBeFocused();
});

test("@claim:local-only sends no selected or demo file data off-device", async ({ page }) => {
  const foreignRequests: string[] = [];
  page.on("request", (request) => {
    const url = new URL(request.url());
    if (url.origin !== "http://127.0.0.1:4173") foreignRequests.push(request.url());
  });
  await page.goto("/demo");
  await page.getByRole("button", { name: "Refresh local copy" }).click();
  await page.getByRole("button", { name: "Preview specimen-log.csv" }).click();
  await expect(page.getByRole("dialog")).toContainText("specimen-log.csv");
  await page.goto("/app");
  await page.locator("#folder-input").setInputFiles("tests/fixtures/bridge-folder");
  await page.getByRole("button", { name: "Preview offline-note.txt" }).click();
  expect(foreignRequests).toEqual([]);
});

test("@claim:freshness shows the last successful refresh", async ({ page }) => {
  await page.goto("/demo");
  await page.getByRole("button", { name: "Refresh local copy" }).click();
  await expect(page.getByText("Ready · synced just now")).toBeVisible();
  await expect(page.getByText("3", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("280.0 KB", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("Field notes was removed.")).toHaveCount(0);
});

test("@claim:file-handoff opens and saves a ready sample file", async ({ page }) => {
  await page.goto("/demo");
  await page.getByRole("button", { name: "Preview handoff-notes.md" }).click();
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
  await expect(page.getByText("Bridge Pro adds up to eight folder mirrors and keeps 30 refresh records per folder.")).toBeVisible();
  const buy = page.getByRole("link", { name: "Buy Bridge Pro" });
  await expect(buy).toHaveAttribute("href", "https://api.sociobot.in/api/v1/products/offline-file-bridge/checkout");
  await page.goto("/app");
  await page.locator("#folder-input").setInputFiles("tests/fixtures/bridge-folder");
  await page.getByRole("button", { name: "Choose a folder" }).click();
  await expect(page.getByText("The free version keeps one folder mirror. Remove it first or add a Bridge Pro license.")).toBeVisible();
  await page.evaluate(async () => {
    const token = "test-pro";
    localStorage.setItem("sb_license:offline-file-bridge", token);
    localStorage.setItem("sb_license:offline-file-bridge:verdict", JSON.stringify({ token, valid: true, checkedAt: Date.now() }));
    const database = await new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open("offline-file-bridge-real", 1);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    const transaction = database.transaction("mirrors", "readwrite");
    for (let index = 2; index <= 8; index += 1) transaction.objectStore("mirrors").put({ id: `seed-${index}`, name: `Folder ${index}`, source: "test", createdAt: Date.now(), syncedAt: Date.now(), files: [], history: [] });
    await new Promise<void>((resolve) => { transaction.oncomplete = () => resolve(); });
    database.close();
  });
  await page.reload();
  await page.getByRole("button", { name: "Choose a folder" }).click();
  await expect(page.getByText("Bridge Pro keeps up to eight folder mirrors. Remove one before adding another.")).toBeVisible();

  await page.goto("/demo");
  for (let index = 0; index < 31; index += 1) await page.getByRole("button", { name: "Refresh local copy" }).click();
  await expect(page.getByText("Refresh history: 30 / 30 records")).toBeVisible();
});

test("@claim:checkout opens the registered hosted checkout", async ({ request }) => {
  const response = await request.get("https://api.sociobot.in/api/v1/products/offline-file-bridge/checkout", { maxRedirects: 0 });
  expect(response.status()).toBe(303);
  expect(response.headers().location).toMatch(/^https:\/\/checkout\.dodopayments\.com\/session\//);
});

test("@claim:license-verification-privacy sends a fixture token only to Sociobot", async ({ page }) => {
  const foreignRequests: string[] = [];
  page.on("request", (request) => {
    const url = new URL(request.url());
    if (url.origin !== "http://127.0.0.1:4173") foreignRequests.push(request.url());
  });
  await page.route("**/api/v1/products/offline-file-bridge/verify*", async (route) => {
    await route.fulfill({ json: { valid: false } });
  });
  await page.goto("/");
  await page.getByLabel("License token").fill("fixture-token");
  const verification = page.waitForResponse((response) => response.url() === "https://api.sociobot.in/api/v1/products/offline-file-bridge/verify?license=fixture-token");
  await page.getByRole("button", { name: "Verify license" }).click();
  await verification;
  expect(foreignRequests).toEqual(["https://api.sociobot.in/api/v1/products/offline-file-bridge/verify?license=fixture-token"]);
});

test("@claim:browser-persistence keeps selected files after reload", async ({ page }) => {
  await page.goto("/app");
  await page.locator("#folder-input").setInputFiles("tests/fixtures/bridge-folder");
  await expect(page.getByText("offline-note.txt", { exact: true })).toBeVisible();
  await expect(page.getByText("2", { exact: true }).first()).toBeVisible();
  await page.reload();
  await expect(page.getByText("offline-note.txt", { exact: true })).toBeVisible();
  await expect(page.getByText("route.csv", { exact: true })).toBeVisible();
});
