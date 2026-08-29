import { expect, test } from "@playwright/test";

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
  await page.goto("/?demo=1");
  await expect(page.getByText("Demo — sample data, nothing is saved")).toBeVisible();
  await expect(page.getByRole("button", { name: "Reset demo" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Start for real" })).toBeVisible();
  const keys = await page.evaluate(() => Object.keys(localStorage));
  expect(keys.length).toBeGreaterThan(0);
  expect(keys.every((key) => key.startsWith("demo:") || key.startsWith("sb_license:"))).toBe(true);
  const databases = await page.evaluate(async () => (await indexedDB.databases()).map((database) => database.name));
  expect(databases).not.toContain("offline-file-bridge-real");
});

test("@claim:demo-ready-sample opens a ready, isolated sample in one click", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("link", { name: /Try it with sample data/ }).click();
  await expect(page).toHaveURL(/\/\?demo=1$/);
  await expect(page.getByText("Demo — sample data, nothing is saved")).toBeVisible();
  await expect(page.getByRole("heading", { level: 2, name: "Field notes" })).toBeVisible();
  await expect(page.getByText("Ready · synced 12 min ago")).toBeVisible();
  await expect(page.getByRole("button", { name: "Preview ridge-route.pdf" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Preview specimen-log.csv" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Preview handoff-notes.md" })).toBeVisible();
  const firstFilename = page.locator(".file-name", { hasText: "ridge-route.pdf" });
  const visibleAboveFold = await Promise.all([
    page.getByRole("heading", { level: 2, name: "Field notes" }).boundingBox(),
    firstFilename.boundingBox()
  ]);
  for (const box of visibleAboveFold) {
    expect(box).not.toBeNull();
    expect(box!.y).toBeGreaterThanOrEqual(0);
    expect(box!.y + box!.height).toBeLessThanOrEqual(844);
  }
  expect(await firstFilename.evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(true);
  expect(await page.evaluate(() => window.scrollY)).toBe(0);
  const databases = await page.evaluate(async () => (await indexedDB.databases()).map((database) => database.name));
  expect(databases).not.toContain("offline-file-bridge-real");
});

test("@claim:demo-reset restores the displayed seed without a reload", async ({ page }) => {
  await page.goto("/demo");
  await page.getByRole("button", { name: "Refresh folder mirror" }).click();
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
  await page.getByRole("button", { name: "Refresh folder mirror" }).click();
  await page.getByRole("button", { name: "Preview specimen-log.csv" }).click();
  await expect(page.getByRole("dialog")).toContainText("specimen-log.csv");
  await page.goto("/app");
  await page.locator("#folder-input").setInputFiles("tests/fixtures/bridge-folder");
  await page.getByRole("button", { name: "Preview offline-note.txt" }).click();
  expect(foreignRequests).toEqual([]);
});

test("@claim:freshness shows the last successful refresh", async ({ page }) => {
  await page.goto("/demo");
  const mirror = page.locator("article").filter({ has: page.getByRole("heading", { level: 2, name: "Field notes" }) });
  await expect(mirror).toContainText("3 files");
  await expect(mirror).toContainText("280.0 KB");
  await page.getByRole("button", { name: "Refresh folder mirror" }).click();
  await expect(mirror.getByText("Ready · synced just now")).toBeVisible();
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

test("@claim:free-tier keeps one folder and verifies the Bridge Pro billing outcome", async ({ page, request }) => {
  const checkout = await request.get("https://api.sociobot.in/api/v1/products/offline-file-bridge/checkout", { maxRedirects: 0 });
  expect(checkout.status()).toBe(303);
  const checkoutUrl = checkout.headers().location;
  expect(checkoutUrl).toMatch(/^https:\/\/checkout\.dodopayments\.com\/session\//);
  const order = await request.get(checkoutUrl!);
  expect(order.status()).toBe(200);
  const orderSummary = await order.text();
  expect(orderSummary).toContain("Offline File Bridge Pro");
  expect(orderSummary).toMatch(/Pay in\s*(?:<!--\s*-->)?\s*USD/);
  expect(orderSummary).toContain("One-time unlock for Offline File Bridge.");
  const price = orderSummary.match(/Offline File Bridge Pro[\s\S]{0,600}?\$(\d+\.\d{2})/);
  expect(price?.[1]).toBe("14.00");
  expect(Math.round(Number.parseFloat(price![1]) * 100)).toBe(1400);

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
  for (let index = 0; index < 31; index += 1) await page.getByRole("button", { name: "Refresh folder mirror" }).click();
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
  await page.getByLabel("Restore a Bridge Pro license").fill("fixture-token");
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

test("@claim:browser-mirror-removal deletes a browser mirror and its saved file records", async ({ page }) => {
  await page.goto("/app");
  await page.locator("#folder-input").setInputFiles("tests/fixtures/bridge-folder");
  await expect(page.getByText("offline-note.txt", { exact: true })).toBeVisible();
  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "Remove folder mirror" }).click();
  await expect(page.getByText("No folder mirrors yet")).toBeVisible();
  const saved = await page.evaluate(async () => new Promise<unknown[]>((resolve, reject) => {
    const request = indexedDB.open("offline-file-bridge-real", 1);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const database = request.result;
      const transaction = database.transaction("mirrors", "readonly");
      const records = transaction.objectStore("mirrors").getAll();
      records.onsuccess = () => resolve(records.result);
      records.onerror = () => reject(records.error);
      transaction.oncomplete = () => database.close();
    };
  }));
  expect(saved).toEqual([]);
});

test("@claim:browser-storage-clearing removes saved browser folder mirrors", async ({ page, context }) => {
  await page.goto("/app");
  await page.locator("#folder-input").setInputFiles("tests/fixtures/bridge-folder");
  await expect(page.getByText("offline-note.txt", { exact: true })).toBeVisible();
  const client = await context.newCDPSession(page);
  await client.send("Storage.clearDataForOrigin", { origin: "http://127.0.0.1:4173", storageTypes: "all" });
  const databases = await page.evaluate(async () => (await indexedDB.databases()).map((database) => database.name));
  expect(databases).not.toContain("offline-file-bridge-real");
  await page.reload();
  await expect(page.getByText("No folder mirrors yet")).toBeVisible();
});
