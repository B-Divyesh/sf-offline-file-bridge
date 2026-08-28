import { chromium } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const base = "https://offline-file-bridge.sociobot.in";
const browser = await chromium.launch({ headless: true });
const results = {};

async function routeAudit(viewport, colorScheme, label) {
  const context = await browser.newContext({ viewport, colorScheme, acceptDownloads: true });
  const routes = ["/", "/demo", "/app", "/privacy", "/terms", "/install", "/missing-page"];
  const audits = [];
  for (const route of routes) {
    const page = await context.newPage();
    const errors = [];
    page.on("console", (message) => { if (message.type() === "error") errors.push(`console: ${message.text()}`); });
    page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));
    const response = await page.goto(`${base}${route}`, { waitUntil: "networkidle" });
    const serious = (await new AxeBuilder({ page }).analyze()).violations
      .filter((item) => item.impact === "serious" || item.impact === "critical")
      .map((item) => item.id);
    audits.push(await page.evaluate(({ route, status, errors, serious }) => ({
      route,
      status,
      title: document.title,
      h1: [...document.querySelectorAll("h1")].map((item) => item.textContent?.trim()),
      h1Count: document.querySelectorAll("h1").length,
      mainCount: document.querySelectorAll("main").length,
      lang: document.documentElement.lang,
      canonical: document.querySelector('link[rel="canonical"]')?.href,
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      errors,
      axeSeriousCritical: serious
    }), { route, status: response?.status(), errors, serious }));
    await page.close();
  }
  await context.close();
  results[`routes-${label}`] = audits;
}

await routeAudit({ width: 1440, height: 900 }, "light", "desktop-light");
await routeAudit({ width: 390, height: 844 }, "dark", "mobile-dark");

{
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, colorScheme: "light" });
  const page = await context.newPage();
  await page.goto(`${base}/demo`, { waitUntil: "networkidle" });
  results.touchTargets = await page.evaluate(() => [...document.querySelectorAll("a,button,input")]
    .filter((element) => {
      const style = getComputedStyle(element);
      const box = element.getBoundingClientRect();
      return style.visibility !== "hidden" && style.display !== "none" && box.width > 0 && box.height > 0;
    })
    .map((element) => {
      const box = element.getBoundingClientRect();
      return { tag: element.tagName, text: element.textContent?.trim() || element.getAttribute("aria-label"), width: +box.width.toFixed(1), height: +box.height.toFixed(1) };
    }).filter((item) => item.width < 44 || item.height < 44));
  await context.close();
}

{
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, acceptDownloads: true });
  const page = await context.newPage();
  const foreign = [];
  const errors = [];
  page.on("request", (request) => { if (new URL(request.url()).origin !== base) foreign.push(request.url()); });
  page.on("console", (message) => { if (message.type() === "error") errors.push(`console: ${message.text()}`); });
  page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));
  await page.goto(`${base}/demo`, { waitUntil: "networkidle" });
  const initialFreshness = await page.locator(".status").innerText();
  await page.getByRole("button", { name: "Refresh local copy" }).click();
  const refreshed = await page.locator(".status").innerText();
  const opener = page.getByRole("button", { name: "Share / open" }).nth(2);
  await opener.click();
  await page.getByRole("dialog").waitFor({ state: "visible" });
  await page.getByRole("button", { name: "Close file" }).waitFor({ state: "visible" });
  const focusedOnOpen = await page.evaluate(() => ({ tag: document.activeElement?.tagName, text: document.activeElement?.textContent?.trim() }));
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Save sample" }).click();
  const download = await downloadPromise;
  await page.keyboard.press("Escape");
  await page.locator("dialog").waitFor({ state: "detached" });
  const focusReturned = await opener.evaluate((element) => element === document.activeElement);
  const storage = await page.evaluate(async () => ({ keys: Object.keys(localStorage), databases: (await indexedDB.databases()).map((item) => item.name) }));
  const registration = await page.evaluate(async () => {
    const item = await navigator.serviceWorker.ready;
    await item.update();
    return { controller: navigator.serviceWorker.controller?.scriptURL, active: item.active?.state, waiting: item.waiting?.state || null };
  });
  await context.setOffline(true);
  await page.reload({ waitUntil: "domcontentloaded" });
  const offlineText = await page.getByRole("status").first().innerText();
  await page.getByRole("button", { name: "Share / open" }).first().click();
  const offlineDialog = await page.getByRole("dialog").innerText();
  results.demoFlow = { initialFreshness, refreshed, focusedOnOpen, focusReturned, download: download.suggestedFilename(), storage, registration, offlineText, offlineDialogHasPdf: offlineDialog.includes("ridge-route.pdf"), foreign, errors };
  await context.close();
}

{
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  await page.goto(`${base}/app`, { waitUntil: "networkidle" });
  await page.locator("#folder-input").setInputFiles("tests/fixtures/bridge-folder");
  await page.locator(".file-name").first().waitFor({ state: "visible" });
  const added = { files: await page.locator(".file-name").allTextContents(), status: await page.locator(".status").innerText() };
  await page.reload({ waitUntil: "networkidle" });
  const afterReload = await page.locator(".file-name").allTextContents();
  await page.getByRole("button", { name: "Choose a folder" }).click();
  await page.locator(".notice.error").filter({ hasText: "The free version keeps one folder" }).waitFor({ state: "visible" });
  const limitError = await page.locator(".notice.error").innerText();
  await page.getByRole("button", { name: "Refresh local copy" }).click();
  await page.locator(".notice.error").filter({ hasText: "cannot reopen the folder" }).waitFor({ state: "visible" });
  const refreshError = await page.locator(".notice.error").innerText();
  page.once("dialog", async (dialog) => dialog.dismiss());
  await page.getByRole("button", { name: "Remove mirror" }).click();
  const remainsAfterCancel = await page.getByText("offline-note.txt").count();
  page.once("dialog", async (dialog) => dialog.accept());
  await page.getByRole("button", { name: "Remove mirror" }).click();
  await page.getByText("No folder bridges yet").waitFor({ state: "visible" });
  const emptyAfterRemove = await page.getByText("No folder bridges yet").count();
  results.realFlow = { added, afterReload, limitError, refreshError, remainsAfterCancel, emptyAfterRemove };
  await context.close();
}

{
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  const errors = [];
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
  await page.goto(`${base}/`, { waitUntil: "networkidle" });
  await page.keyboard.press("Tab");
  const skipFocus = await page.evaluate(() => {
    const element = document.activeElement;
    const style = element ? getComputedStyle(element) : null;
    return { text: element?.textContent?.trim(), outline: style?.outline, offset: style?.outlineOffset };
  });
  await page.keyboard.press("Enter");
  for (let i = 0; i < 8; i += 1) {
    if (await page.getByRole("link", { name: /Try it with sample data/ }).evaluate((item) => item === document.activeElement)) break;
    await page.keyboard.press("Tab");
  }
  const primaryFocused = await page.getByRole("link", { name: /Try it with sample data/ }).evaluate((item) => item === document.activeElement);
  await page.getByRole("link", { name: /Try it with sample data/ }).press("Enter");
  const focusAfterRoute = await page.evaluate(() => ({ tag: document.activeElement?.tagName, text: document.activeElement?.textContent?.trim() }));
  results.keyboard = { skipFocus, primaryFocused, urlAfterEnter: page.url(), focusAfterRoute, errors };
  await context.close();
}

{
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
  const page = await context.newPage();
  await page.goto(`${base}/demo`, { waitUntil: "networkidle" });
  results.reducedMotion = await page.locator(".sync-trace").evaluate((element) => {
    const style = getComputedStyle(element);
    return { matches: matchMedia("(prefers-reduced-motion: reduce)").matches, animationDuration: style.animationDuration, transitionDuration: style.transitionDuration };
  });
  await context.close();
}

{
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  const errors = [];
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
  await page.goto(`${base}/install`, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Check latest APK" }).click();
  const apk = page.getByRole("link", { name: /Download APK/ });
  results.install = { text: await apk.innerText(), href: await apk.getAttribute("href"), note: await page.locator("#release-note").innerText(), errors };
  await context.close();
}

await browser.close();
console.log(JSON.stringify(results, null, 2));
