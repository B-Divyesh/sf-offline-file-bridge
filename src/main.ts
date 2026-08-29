import { Capacitor, registerPlugin } from "@capacitor/core";
import "./style.css";
import { loadMirrors, removeMirror, saveMirror } from "./storage";
import type { LicenseState, Mirror, MirrorFile } from "./types";

type NativeFolderResult = { id: string; name: string; syncedAt: number; files: Array<Omit<MirrorFile, "blob">> };
interface OfflineBridgePlugin {
  chooseFolder(): Promise<NativeFolderResult>;
  syncFolder(options: { id: string }): Promise<NativeFolderResult>;
  openFile(options: { id: string; path: string }): Promise<void>;
  removeFolder(options: { id: string }): Promise<void>;
}

const NativeBridge = registerPlugin<OfflineBridgePlugin>("OfflineBridge");
const root = document.querySelector<HTMLDivElement>("#app")!;
const PRODUCT = "offline-file-bridge";
const CHECKOUT = `https://api.sociobot.in/api/v1/products/${PRODUCT}/checkout`;
const LICENSE_KEY = `sb_license:${PRODUCT}`;
const VERDICT_KEY = `${LICENSE_KEY}:verdict`;
const RELEASE_TAG = `v${__APP_VERSION__}`;
const RELEASE_API = "https://api.github.com/repos/B-Divyesh/sf-offline-file-bridge";
const SITE_URL = "https://offline-file-bridge.sociobot.in";
const isNative = Capacitor.isNativePlatform();
let mirrors: Mirror[] = [];
let isDemo = false;
let notice = "";
let noticeType: "success" | "error" | "" = "";
let loading = false;
let online = navigator.onLine;
let storageEstimate = { used: 0, quota: 0 };
let license: LicenseState | null = null;
let lastFocused: HTMLElement | null = null;
let licenseFeedback = "";

const demoSeed = (): Mirror[] => [{
  id: "demo-field-notes",
  name: "Field notes",
  source: "OpenCloud / Research",
  createdAt: Date.now() - 4 * 86400000,
  syncedAt: Date.now() - 12 * 60000,
  files: [
    makeDemoFile("ridge-route.pdf", "Maps/ridge-route.pdf", "PDF route sheet\n\nMeet at North Gate. Offline checkpoint grid: D7.\nEmergency return path follows the blue trail.", "application/pdf", 284000),
    makeDemoFile("specimen-log.csv", "Logs/specimen-log.csv", "date,site,sample,status\n2026-08-24,Ridge North,RN-044,packed\n2026-08-25,Creek Bend,CB-018,packed\n", "text/csv", 1804),
    makeDemoFile("handoff-notes.md", "Notes/handoff-notes.md", "# Handoff notes\n\n- Batteries are in the top case.\n- Open the ridge route before leaving Wi-Fi.\n- Return samples before 18:00.\n", "text/markdown", 932)
  ],
  history: [{ at: Date.now() - 12 * 60000, count: 3, bytes: 286736, result: "ready" }]
}];

function makeDemoFile(name: string, path: string, content: string, type: string, shownSize: number): MirrorFile {
  return { id: path, name, path, size: shownSize, type, modifiedAt: Date.now() - 86400000, blob: new Blob([content], { type }) };
}

function esc(value: string): string {
  return value.replace(/[&<>"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[char]!));
}

function formatBytes(bytes: number): string {
  if (!bytes) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${(bytes / 1024 ** index).toFixed(index ? 1 : 0)} ${units[index]}`;
}

function relativeTime(timestamp: number | null): string {
  if (!timestamp) return "Not synced yet";
  const minutes = Math.max(0, Math.floor((Date.now() - timestamp) / 60000));
  if (minutes < 1) return "synced just now";
  if (minutes < 60) return `synced ${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `synced ${hours} hr ago`;
  return `synced ${Math.floor(hours / 24)} days ago`;
}

function header(path: string): string {
  const current = (route: string) => path === route ? ' aria-current="page"' : "";
  return `<header class="site-header">
    <a class="wordmark" href="/" data-link aria-label="Offline File Bridge home">
      <svg viewBox="0 0 64 64" aria-hidden="true"><path d="M7 21h19l6 7h25v27H7z" fill="var(--yellow)" stroke="var(--ink)" stroke-width="4" stroke-linejoin="round"/><path d="M12 47c9-16 31-16 40 0M17 47h30" fill="none" stroke="var(--accent)" stroke-width="5" stroke-linecap="round"/></svg>
      <span>Offline File Bridge</span>
    </a>
    <nav class="site-nav" aria-label="Main navigation">
      <a href="/demo" data-link${current("/demo")}>Demo</a>
      <a href="/app" data-link${current("/app")}>Open folders</a>
      <a href="/install" data-link${current("/install")}>Install</a>
      <a href="/privacy" data-link${current("/privacy")}>Privacy</a>
    </nav>
  </header>`;
}

function footer(): string {
  return `<footer class="site-footer">
    <span>Keep approved folders ready offline.</span>
    <nav class="footer-links" aria-label="Footer navigation">
      <a href="/privacy" data-link>Privacy</a><a href="/terms" data-link>Terms</a>
      <a href="https://sociobot.in" rel="external">Built by Param Factory <span class="sr-only">(external site)</span></a>
    </nav>
    <span>v${esc(__APP_VERSION__)} · Generated artwork</span>
  </footer>`;
}

function layout(content: string, path: string, demoBar = false): string {
  return `${demoBar ? `<aside class="demo-bar" aria-label="Demo mode"><div class="demo-bar-inner"><strong>Demo — sample data, nothing is saved</strong><span class="demo-actions"><button class="plain-button" data-action="reset-demo">Reset demo</button><a href="/app" data-link data-action="leave-demo">Start for real</a></span></div></aside>` : ""}${header(path)}${content}${footer()}`;
}

function landing(): string {
  return layout(`<main id="main" class="page">
    <section class="hero" aria-labelledby="hero-title">
      <div>
        <h1 id="hero-title" tabindex="-1">Keep approved folders ready offline</h1>
        <p class="lede">For Android users who need cloud files in another app when the network disappears.</p>
        <div class="hero-actions">
          <a class="button" href="/demo" data-link>Try it with sample data <span aria-hidden="true">→</span></a>
          <span class="action-note">A ready folder opens. Nothing is saved.</span>
        </div>
        <ul class="facts"><li>One folder is free.</li><li>Files stay on your device.</li><li>Works after the first visit.</li></ul>
        <p><span data-release-action><button class="plain-button" data-action="check-release">Check latest APK</button></span> · <a href="/install" data-link>Install steps</a></p>
        <p id="release-note" class="sr-only" role="status"></p>
      </div>
      <figure class="hero-art">
        <img src="/assets/bridge-notebook.webp" width="1200" height="800" alt="A paper folder crosses a small bridge into a phone-shaped tray." fetchpriority="high" decoding="async" />
        <figcaption>approved folder → folder mirror → another app</figcaption>
      </figure>
    </section>

    <section class="section" aria-labelledby="preview-title">
      <h2 class="ruled-heading" id="preview-title">See what is ready before you leave</h2>
      <div class="preview-shell">
        <div class="preview-note"><p>Every folder mirror shows its last successful refresh. A failed Android refresh keeps that date.</p><a href="/demo" data-link>Open the working sample →</a></div>
        <div class="preview-panel">${previewFolder()}</div>
      </div>
    </section>

    <section class="section" aria-labelledby="how-title">
      <h2 class="ruled-heading" id="how-title">How to keep a folder ready offline</h2>
      <ol class="step-list">
        <li><h3>Choose a folder</h3><p>Android asks which folder this app may read. No broad storage permission is requested.</p></li>
        <li><h3>Refresh the folder mirror</h3><p>The folder mirror records its successful refresh time, file count, and storage size.</p></li>
        <li><h3>Open a ready file</h3><p>Pick the local app that should receive the file, even while offline.</p></li>
      </ol>
    </section>

    <section class="section" aria-labelledby="limits-title">
      <div class="split-note">
        <div><h2 id="limits-title">Your folder stays under your control</h2><ul class="check-list"><li>You approve each source folder.</li><li>Folder mirror files stay in app storage.</li><li>On Android, you can remove a folder mirror at any time.</li></ul></div>
        <div><h3>What it does not do</h3><ul class="cross-list"><li>It does not replace your storage service.</li><li>It does not crawl unapproved folders.</li><li>After a failed Android refresh, it keeps the last ready time.</li></ul><p><a href="/privacy" data-link>Read the privacy note</a></p></div>
      </div>
    </section>

    <section class="section" aria-labelledby="pro-title">${pricing()}</section>
  </main>`, "/");
}

function previewFolder(): string {
  return `<article class="folder-card" aria-label="Sample folder status"><div class="folder-header"><div><h3>Field notes</h3><p>OpenCloud / Research · 3 files · 280.0 KB</p></div><span class="status">Ready · synced 12 min ago</span></div><ul class="file-list"><li class="file-row"><span class="file-name">ridge-route.pdf</span><span class="file-meta">277.3 KB</span><span>Ready</span></li><li class="file-row"><span class="file-name">specimen-log.csv</span><span class="file-meta">1.8 KB</span><span>Ready</span></li></ul><div class="folder-actions"><a class="button small secondary" href="/demo" data-link>Open sample</a></div></article>`;
}

function pricing(): string {
  const active = isPro();
  const revoked = license && license.checkedAt > 0 && !license.valid ? `<p class="notice">This license is no longer active. Buy a new license or restore another.</p>` : "";
  return `<div class="price-note"><div><div class="price">$14<small>one-time purchase</small></div></div><div><h2 id="pro-title">Keep more folder mirrors</h2><p>Bridge Pro adds up to eight folder mirrors and keeps 30 refresh records per folder. The free version keeps one folder mirror.</p>${revoked}${active ? `<p class="notice success">Bridge Pro is active on this device.</p>` : `<p><a class="button" href="${CHECKOUT}">Buy Bridge Pro <span class="sr-only">at the Sociobot checkout (external site)</span></a></p><form class="license-form" data-license-form novalidate><label class="license-label" for="license-token">Restore a Bridge Pro license</label><div class="license-controls"><input id="license-token" name="license" autocomplete="off" placeholder="Paste your license token" aria-describedby="license-help license-feedback" required><button class="button small secondary" type="submit">Verify license</button></div><p id="license-help" class="field-help">Paste the token from your purchase email. Spaces alone are not a token.</p><p id="license-feedback" class="field-feedback" aria-live="polite">${esc(licenseFeedback)}</p></form>`}</div></div>`;
}

function demoPage(): string { return appPage(true); }

function appPage(demo: boolean): string {
  const totalFiles = mirrors.reduce((sum, mirror) => sum + mirror.files.length, 0);
  const totalBytes = mirrors.reduce((sum, mirror) => sum + mirror.files.reduce((fileSum, file) => fileSum + file.size, 0), 0);
  const storage = storageEstimate.quota ? `${formatBytes(storageEstimate.used)} of ${formatBytes(storageEstimate.quota)}` : "Checked on device";
  const content = `<main id="main" class="page app-page">
    <div class="app-head"><div><p class="eyebrow">${demo ? "Sample field log" : "Your local field log"}</p><h1 tabindex="-1">Open your offline folders</h1></div><span class="network-state ${online ? "" : "offline"}" role="status">${online ? "Online" : "Offline — ready files still open"}</span></div>
    <p class="lede">Choose a folder, refresh the folder mirror, then hand a ready file to another app.</p>
    <div class="storage-strip" aria-label="Folder mirror storage summary"><div class="storage-stat"><strong>${mirrors.length}</strong><span>folder ${mirrors.length === 1 ? "mirror" : "mirrors"}</span></div><div class="storage-stat"><strong>${totalFiles}</strong><span>ready files</span></div><div class="storage-stat"><strong>${formatBytes(totalBytes)}</strong><span>mirrored · ${storage}</span></div></div>
    ${notice ? `<div class="notice ${noticeType}" role="status">${esc(notice)}</div>` : ""}
    <div class="app-toolbar"><button class="button" data-action="add-folder" ${loading ? "disabled" : ""}>${loading ? "Reading folder…" : "Choose a folder"}</button>${!demo && !window.showDirectoryPicker && !isNative ? `<span class="action-note">Your browser will ask for the folder files.</span>` : ""}</div>
    <input class="visually-hidden-input" id="folder-input" type="file" multiple webkitdirectory tabindex="-1" aria-hidden="true" />
    ${loading ? loadingState() : mirrors.length ? `<section class="folder-stack" aria-label="Folder mirrors">${mirrors.map(folderCard).join("")}</section>` : emptyState()}
    ${!demo ? `<section class="section" aria-label="Bridge Pro license">${pricing()}</section>` : ""}
  </main>`;
  return layout(content, demo ? "/demo" : "/app", demo);
}

function loadingState(): string {
  return `<div class="empty-note" aria-busy="true"><div class="loading-lines" aria-label="Reading approved folder"><span></span><span></span><span></span></div></div>`;
}

function emptyState(): string {
  return `<section class="empty-note"><div><div class="empty-mark" aria-hidden="true">↝</div><h2>No folder mirrors yet</h2><p>Your approved folders will appear here with file counts and refresh times.</p><button class="button secondary" data-action="add-folder">Choose your first folder</button></div></section>`;
}

function folderCard(mirror: Mirror): string {
  const bytes = mirror.files.reduce((sum, file) => sum + file.size, 0);
  return `<article class="folder-card" data-mirror="${esc(mirror.id)}"><div class="folder-header"><div><h2>${esc(mirror.name)}</h2><p>${esc(mirror.source)} · ${mirror.files.length} files · ${formatBytes(bytes)}</p><p class="refresh-history">Refresh history: ${mirror.history.length} / 30 records</p></div><span class="status">Ready · ${relativeTime(mirror.syncedAt)}</span></div><div class="sync-trace" aria-hidden="true"></div><ul class="file-list">${mirror.files.length ? mirror.files.map((file) => `<li class="file-row"><span class="file-name" title="${esc(file.path)}">${esc(file.name)}</span><span class="file-meta">${formatBytes(file.size)}</span><button class="plain-button" data-action="open-file" data-mirror-id="${esc(mirror.id)}" data-file-id="${esc(file.id)}">Preview ${esc(file.name)}</button></li>`).join("") : `<li class="file-row"><span>No files were found. Add a file to the source, then refresh.</span></li>`}</ul><div class="folder-actions"><button class="button small secondary" data-action="refresh" data-id="${esc(mirror.id)}">Refresh folder mirror</button><button class="plain-button" data-action="remove" data-id="${esc(mirror.id)}">Remove folder mirror</button><span class="action-note">Last success stays visible if refresh fails.</span></div></article>`;
}

function privacyPage(): string {
  return layout(`<main id="main" class="page legal"><p class="eyebrow">Plain privacy note</p><h1 tabindex="-1">Your files stay on your device</h1><p>Offline File Bridge stores approved files and refresh records in local app storage. The website stores real data in your browser database. Demo data uses a separate <code>demo:</code> namespace.</p><h2>What leaves the device</h2><p>Your folder names and files are not sent to us. License verification sends a token only to the Sociobot billing API. The install page asks GitHub for public release details.</p><h2>Permissions</h2><p>Android asks you to choose a folder. The app keeps access to that folder until you remove the folder mirror or revoke access in Android settings.</p><h2>Deletion</h2><p>In a browser, remove a folder mirror to delete its saved files. Clearing this site's browser data removes browser folder mirrors. On Android, remove a folder mirror to delete its private files and release folder access.</p><h2>Contact</h2><p>Questions can be sent to <a href="mailto:privacy@sociobot.in">privacy@sociobot.in</a>.</p><p>Effective: 29 August 2026.</p></main>`, "/privacy");
}

function termsPage(): string {
  return layout(`<main id="main" class="page legal"><p class="eyebrow">Use terms</p><h1 tabindex="-1">Terms for Offline File Bridge</h1><p>Offline File Bridge is provided under the MIT License. You remain responsible for the folders and local apps you choose.</p><h2>Freshness</h2><p>A ready time records the last successful refresh. It does not promise that the source stayed unchanged afterward.</p><h2>Bridge Pro</h2><p>Bridge Pro costs $14 once. It adds up to eight folder mirrors and 30 refresh records per folder.</p><h2>Purchase</h2><p>Buying Bridge Pro opens the Sociobot checkout.</p><h2>No warranty</h2><p>The software is provided “as is,” without warranty. Keep another copy of important files. This tool is not a backup service.</p><h2>Contact</h2><p>Questions can be sent to <a href="mailto:support@sociobot.in">support@sociobot.in</a>.</p><p>Effective: 29 August 2026.</p></main>`, "/terms");
}

function installPage(): string {
  return layout(`<main id="main" class="page install"><p class="eyebrow">Android v${esc(__APP_VERSION__)}</p><h1 tabindex="-1">Install Offline File Bridge</h1><p>Check for the current Android app download.</p><p data-release-action><button class="button" data-action="check-release">Check latest APK</button></p><div id="release-note" class="notice" role="status">Check for a matching APK before you download.</div><h2>Install in three steps</h2><ol class="install-steps"><li>Download the APK from the latest release.</li><li>Open the download and allow installs from your browser when Android asks.</li><li>Open Offline File Bridge, then choose the folder Android may read.</li></ol><h2>Short walkthrough</h2><div class="walkthrough" aria-label="Three-screen app walkthrough"><div class="phone-frame"><b>1. Choose a folder</b><span>Android shows its folder picker. You approve one location.</span></div><div class="phone-frame"><b>2. Check the ready time</b><span>The file count, size, and last successful refresh remain visible.</span></div><div class="phone-frame"><b>3. Share or open</b><span>The Android chooser hands a ready private file to your selected app.</span></div></div></main>`, "/install");
}

function notFoundPage(): string {
  return layout(`<main id="main" class="page not-found"><p class="eyebrow">404</p><h1 tabindex="-1">Page not found</h1><p>The address may be old or incomplete.</p><p><a class="button" href="/" data-link>Return home</a></p></main>`, "/404");
}

function isPro(): boolean { return Boolean(license?.valid); }

function routeTitle(path: string): string {
  const titles: Record<string, string> = {
    "/": "Offline File Bridge — keep folders ready offline",
    "/demo": "Demo — Offline File Bridge",
    "/app": "Folder mirrors — Offline File Bridge",
    "/privacy": "Privacy — Offline File Bridge",
    "/terms": "Terms — Offline File Bridge",
    "/install": "Install — Offline File Bridge",
    "/404": "Page not found — Offline File Bridge"
  };
  return titles[path] || titles["/404"];
}

async function navigate(path: string, push = true): Promise<void> {
  if (push) history.pushState({}, "", path);
  await renderRoute(true);
  window.scrollTo(0, 0);
}

async function renderRoute(focusHeading = false): Promise<void> {
  const requestedPath = normalizePath(location.pathname);
  isDemo = requestedPath === "/demo" || new URLSearchParams(location.search).get("demo") === "1";
  const path = isDemo ? "/demo" : requestedPath;
  const isKnownPage = ["/", "/demo", "/app", "/privacy", "/terms", "/install", "/404"].includes(path);
  if (isDemo) {
    const saved = localStorage.getItem("demo:offline-file-bridge");
    mirrors = saved ? reviveDemo(JSON.parse(saved) as Mirror[]) : demoSeed();
    saveDemo();
  } else if (path === "/app") {
    try { mirrors = await loadMirrors(); } catch { notice = "Local storage could not be read. Check browser storage access, then reload."; noticeType = "error"; }
  }
  await refreshStorageEstimate();
  document.title = routeTitle(path);
  updateCanonical(path, isKnownPage);
  updateMetadata(path, isKnownPage);
  if (path === "/") root.innerHTML = landing();
  else if (path === "/demo") root.innerHTML = demoPage();
  else if (path === "/app") root.innerHTML = appPage(false);
  else if (path === "/privacy") root.innerHTML = privacyPage();
  else if (path === "/terms") root.innerHTML = termsPage();
  else if (path === "/install") root.innerHTML = installPage();
  else root.innerHTML = notFoundPage();
  bindEvents();
  const h1 = document.querySelector<HTMLHeadingElement>("h1");
  const announcer = document.querySelector<HTMLDivElement>("#route-announcer");
  if (announcer && h1) announcer.textContent = h1.textContent;
  if (focusHeading && h1) h1.focus();
}

function normalizePath(path: string): string {
  if (path.length > 1 && path.endsWith("/")) return path.slice(0, -1);
  return path;
}

function updateCanonical(path: string, isKnownPage: boolean): void {
  const existing = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!isKnownPage || path === "/404") {
    existing?.remove();
    return;
  }
  const link = existing || document.head.appendChild(document.createElement("link"));
  link.rel = "canonical";
  link.href = `${SITE_URL}${path}`;
}

function updateMetadata(path: string, isKnownPage: boolean): void {
  const descriptions: Record<string, string> = {
    "/": "Keep an approved folder ready offline, check its freshness, and open files in other Android apps.",
    "/demo": "Try a ready sample folder mirror. Demo data is separate from your real files.",
    "/app": "Choose approved folders, refresh folder mirrors, and preview ready files.",
    "/privacy": "Read how Offline File Bridge stores folder mirrors and handles license checks.",
    "/terms": "Read the terms for Offline File Bridge and its one-time Bridge Pro license.",
    "/install": "Check for a matching Android APK and install Offline File Bridge in three steps.",
    "/404": "The requested Offline File Bridge page could not be found."
  };
  const description = descriptions[isKnownPage ? path : "/404"];
  document.querySelector<HTMLMetaElement>('meta[name="description"]')?.setAttribute("content", description);
  document.querySelector<HTMLMetaElement>('meta[property="og:title"]')?.setAttribute("content", document.title);
  document.querySelector<HTMLMetaElement>('meta[property="og:description"]')?.setAttribute("content", description);
  document.querySelector<HTMLMetaElement>('meta[name="twitter:title"]')?.setAttribute("content", document.title);
  document.querySelector<HTMLMetaElement>('meta[name="twitter:description"]')?.setAttribute("content", description);
  const ogUrl = document.querySelector<HTMLMetaElement>('meta[property="og:url"]');
  if (ogUrl) ogUrl.content = `${SITE_URL}${isKnownPage ? path : "/404"}`;
}

function reviveDemo(items: Mirror[]): Mirror[] {
  const seed = demoSeed();
  return items.map((mirror) => ({ ...mirror, files: mirror.files.map((file) => {
    const seeded = seed.flatMap((item) => item.files).find((candidate) => candidate.id === file.id);
    return { ...file, blob: seeded?.blob || new Blob([`Sample file: ${file.name}`], { type: file.type }) };
  }) }));
}

function saveDemo(): void {
  const serializable = mirrors.map((mirror) => ({ ...mirror, files: mirror.files.map(({ blob: _blob, ...file }) => file) }));
  localStorage.setItem("demo:offline-file-bridge", JSON.stringify(serializable));
}

async function refreshStorageEstimate(): Promise<void> {
  if (navigator.storage?.estimate) {
    const estimate = await navigator.storage.estimate();
    storageEstimate = { used: estimate.usage || 0, quota: estimate.quota || 0 };
  }
}

function bindEvents(): void {
  document.querySelectorAll<HTMLAnchorElement>("a[data-link]").forEach((link) => link.addEventListener("click", (event) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    void navigate(new URL(link.href).pathname);
  }));
  document.querySelectorAll<HTMLElement>("[data-action]").forEach((element) => element.addEventListener("click", handleAction));
  document.querySelectorAll<HTMLFormElement>("[data-license-form]").forEach((form) => form.addEventListener("submit", handleLicenseSubmit));
  document.querySelector<HTMLInputElement>("#folder-input")?.addEventListener("change", handleFolderInput);
}

async function handleAction(event: Event): Promise<void> {
  const target = event.currentTarget as HTMLElement;
  const action = target.dataset.action;
  if (action === "add-folder") await addFolder();
  if (action === "reset-demo") {
    localStorage.removeItem("demo:offline-file-bridge");
    mirrors = demoSeed();
    saveDemo();
    notice = "Sample data was reset.";
    noticeType = "success";
    await renderRoute();
    document.querySelector<HTMLButtonElement>('[data-action="reset-demo"]')?.focus();
  }
  if (action === "leave-demo") localStorage.removeItem("demo:offline-file-bridge");
  if (action === "refresh") await refreshMirror(target.dataset.id!);
  if (action === "remove") await deleteMirror(target.dataset.id!);
  if (action === "open-file") await openFile(target.dataset.mirrorId!, target.dataset.fileId!, target);
  if (action === "check-release") await loadRelease();
}

async function addFolder(): Promise<void> {
  const limit = isPro() ? 8 : 1;
  if (mirrors.length >= limit && !isDemo) {
    setNotice(isPro() ? "Bridge Pro keeps up to eight folder mirrors. Remove one before adding another." : "The free version keeps one folder mirror. Remove it first or add a Bridge Pro license.", "error");
    document.querySelector("[data-license-form]")?.scrollIntoView({ behavior: "smooth" });
    return;
  }
  if (isDemo) {
    setNotice("The sample already shows a complete folder. Start for real to choose one from your device.", "success");
    return;
  }
  if (isNative) {
    loading = true; await renderRoute();
    try {
      const result = await NativeBridge.chooseFolder();
      const mirror = nativeResultToMirror(result);
      mirrors = [...mirrors.filter((item) => item.id !== mirror.id), mirror];
      await saveMirror(mirror);
      setNotice(`${mirror.files.length} files are ready from ${mirror.name}.`, "success");
    } catch (error) { setNotice(readError(error, "The folder was not added. Choose a folder and allow access."), "error"); }
    finally { loading = false; await renderRoute(); }
    return;
  }
  if (window.showDirectoryPicker) {
    loading = true; await renderRoute();
    try {
      const handle = await window.showDirectoryPicker({ mode: "read" });
      const files = await readDirectory(handle);
      const mirror = buildWebMirror(handle.name, files, handle);
      mirrors.push(mirror); await saveMirror(mirror);
      setNotice(`${files.length} files are ready from ${handle.name}.`, "success");
    } catch (error) {
      if ((error as DOMException).name !== "AbortError") setNotice(readError(error, "The folder could not be read. Choose it again and allow access."), "error");
    } finally { loading = false; await renderRoute(); }
  } else {
    document.querySelector<HTMLInputElement>("#folder-input")?.click();
  }
}

async function handleFolderInput(event: Event): Promise<void> {
  const input = event.currentTarget as HTMLInputElement;
  if (!input.files?.length) return;
  loading = true; await renderRoute();
  try {
    const selected = Array.from(input.files);
    const folderName = selected[0].webkitRelativePath.split("/")[0] || "Approved folder";
    const files = selected.map((file) => fileToMirrorFile(file));
    const mirror = buildWebMirror(folderName, files);
    mirrors.push(mirror); await saveMirror(mirror);
    setNotice(`${files.length} files are ready from ${folderName}.`, "success");
  } catch (error) { setNotice(readError(error, "The folder files could not be copied. Choose the folder again."), "error"); }
  finally { loading = false; await renderRoute(); }
}

function buildWebMirror(name: string, files: MirrorFile[], handle?: FileSystemDirectoryHandle): Mirror {
  const now = Date.now();
  return { id: `web-${crypto.randomUUID()}`, name, source: "User-approved browser folder", createdAt: now, syncedAt: now, files, history: [{ at: now, count: files.length, bytes: files.reduce((sum, file) => sum + file.size, 0), result: "ready" }], handle };
}

async function readDirectory(handle: FileSystemDirectoryHandle, prefix = ""): Promise<MirrorFile[]> {
  const files: MirrorFile[] = [];
  for await (const entry of handle.values()) {
    const path = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.kind === "file") files.push(fileToMirrorFile(await entry.getFile(), path));
    else files.push(...await readDirectory(entry, path));
  }
  return files;
}

function fileToMirrorFile(file: File, path = file.webkitRelativePath || file.name): MirrorFile {
  return { id: path, name: file.name, path, size: file.size, type: file.type || "application/octet-stream", modifiedAt: file.lastModified, blob: file };
}

function nativeResultToMirror(result: NativeFolderResult, existing?: Mirror): Mirror {
  const bytes = result.files.reduce((sum, file) => sum + file.size, 0);
  return { id: result.id, name: result.name, source: "Android approved folder", createdAt: existing?.createdAt || Date.now(), syncedAt: result.syncedAt, files: result.files, native: true, history: [...(existing?.history || []), { at: result.syncedAt, count: result.files.length, bytes, result: "ready" as const }].slice(-30) };
}

async function refreshMirror(id: string): Promise<void> {
  if (!mirrors.some((item) => item.id === id)) return;
  loading = true; await renderRoute();
  const mirror = mirrors.find((item) => item.id === id)!;
  try {
    if (isDemo) {
      mirror.syncedAt = Date.now(); mirror.history = [...mirror.history, { at: Date.now(), count: mirror.files.length, bytes: mirror.files.reduce((sum, file) => sum + file.size, 0), result: "ready" as const }].slice(-30); saveDemo();
    } else if (mirror.native) {
      const updated = nativeResultToMirror(await NativeBridge.syncFolder({ id }), mirror);
      mirrors = mirrors.map((item) => item.id === id ? updated : item); await saveMirror(updated);
    } else if (mirror.handle) {
      const permission = await mirror.handle.queryPermission({ mode: "read" });
      const allowed = permission === "granted" || await mirror.handle.requestPermission({ mode: "read" }) === "granted";
      if (!allowed) throw new Error("Folder access was not granted. Choose the folder again.");
      mirror.files = await readDirectory(mirror.handle); mirror.syncedAt = Date.now(); mirror.history = [...mirror.history, { at: mirror.syncedAt, count: mirror.files.length, bytes: mirror.files.reduce((sum, file) => sum + file.size, 0), result: "ready" as const }].slice(-30); await saveMirror(mirror);
    } else throw new Error("This browser cannot reopen the folder. Remove this mirror, then choose the folder again.");
    setNotice(`${mirror.name} is ready. The refresh time was updated.`, "success");
  } catch (error) { setNotice(readError(error, "Refresh failed. Reconnect the source, then try again."), "error"); }
  finally { loading = false; await renderRoute(); }
}

async function deleteMirror(id: string): Promise<void> {
  const mirror = mirrors.find((item) => item.id === id);
  if (!mirror || !confirm(`Remove the folder mirror “${mirror.name}”? The source folder will not be changed.`)) return;
  try {
    if (mirror.native) await NativeBridge.removeFolder({ id });
    if (!isDemo) await removeMirror(id);
    mirrors = mirrors.filter((item) => item.id !== id);
    if (isDemo) saveDemo();
    setNotice(`${mirror.name} was removed. Its source folder was not changed.`, "success");
  } catch (error) { setNotice(readError(error, "The mirror could not be removed. Try again."), "error"); }
}

async function openFile(mirrorId: string, fileId: string, trigger: HTMLElement): Promise<void> {
  const mirror = mirrors.find((item) => item.id === mirrorId);
  const file = mirror?.files.find((item) => item.id === fileId);
  if (!mirror || !file) return;
  lastFocused = trigger;
  try {
    if (mirror.native) {
      await NativeBridge.openFile({ id: mirror.id, path: file.path });
      setNotice(`${file.name} was handed to Android. Choose the app that should open it.`, "success");
    } else if (isDemo) {
      await showDemoFile(file);
    } else if (file.blob) {
      const localFile = new File([file.blob], file.name, { type: file.type, lastModified: file.modifiedAt });
      if (navigator.canShare?.({ files: [localFile] })) {
        await navigator.share({ files: [localFile], title: file.name });
        setNotice(`${file.name} was handed to your share menu.`, "success");
      } else {
        downloadBlob(file.blob, file.name);
        setNotice(`${file.name} was saved. Open the copy with a local app.`, "success");
      }
    } else throw new Error("The ready file is missing. Refresh the folder mirror, then open the file again.");
  } catch (error) {
    if ((error as DOMException).name !== "AbortError") setNotice(readError(error, "The file could not open. Refresh the folder, then try again."), "error");
  }
}

async function showDemoFile(file: MirrorFile): Promise<void> {
  const existing = document.querySelector("dialog"); if (existing) existing.remove();
  const dialog = document.createElement("dialog"); dialog.className = "file-dialog";
  const content = file.blob ? await file.blob.text() : "Sample file";
  dialog.innerHTML = `<div class="dialog-body"><p class="annotation">ready file</p><h2>${esc(file.name)}</h2><pre>${esc(content)}</pre></div><div class="dialog-actions"><button class="button small secondary" data-download>Save sample</button><button class="button small" data-close>Close file</button></div>`;
  document.body.append(dialog);
  dialog.querySelector("[data-close]")?.addEventListener("click", () => dialog.close());
  dialog.querySelector("[data-download]")?.addEventListener("click", () => downloadBlob(file.blob!, file.name));
  dialog.addEventListener("close", () => { dialog.remove(); lastFocused?.focus(); });
  dialog.showModal();
  dialog.querySelector<HTMLButtonElement>("[data-close]")?.focus();
}

function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob); const anchor = document.createElement("a"); anchor.href = url; anchor.download = filename; document.body.append(anchor); anchor.click(); anchor.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function setNotice(message: string, type: "success" | "error"): void {
  notice = message; noticeType = type; void renderRoute();
}

function readError(error: unknown, fallback: string): string {
  return error instanceof Error && error.message ? error.message : fallback;
}

async function handleLicenseSubmit(event: SubmitEvent): Promise<void> {
  event.preventDefault(); const form = event.currentTarget as HTMLFormElement; const token = new FormData(form).get("license")?.toString().trim();
  if (!token) {
    licenseFeedback = "Enter the license token from your purchase email, then verify it.";
    await renderRoute();
    document.querySelector<HTMLInputElement>("#license-token")?.focus();
    return;
  }
  licenseFeedback = "";
  localStorage.setItem(LICENSE_KEY, token);
  await verifyLicense(token, true);
  setNotice(license?.valid ? "Bridge Pro is active on this device." : "That license is not active. Check the token and try again.", license?.valid ? "success" : "error");
}

async function verifyLicense(token: string, force = false): Promise<void> {
  const cached = localStorage.getItem(VERDICT_KEY);
  if (cached) {
    const parsed = JSON.parse(cached) as LicenseState;
    if (parsed.token === token) {
      license = parsed;
      if (!force && Date.now() - parsed.checkedAt < 86400000) return;
    }
  }
  try {
    const response = await fetch(`https://api.sociobot.in/api/v1/products/${PRODUCT}/verify?license=${encodeURIComponent(token)}`);
    const result = await response.json() as { valid: boolean };
    license = { token, valid: result.valid, checkedAt: Date.now() }; localStorage.setItem(VERDICT_KEY, JSON.stringify(license));
  } catch {
    if (!license) license = { token, valid: false, checkedAt: 0 };
  }
}

function captureLicense(): void {
  const params = new URLSearchParams(location.search); const fromUrl = params.get("license");
  if (fromUrl) {
    localStorage.setItem(LICENSE_KEY, fromUrl); params.delete("license");
    history.replaceState({}, "", `${location.pathname}${params.size ? `?${params}` : ""}`);
  }
  const token = fromUrl || localStorage.getItem(LICENSE_KEY);
  if (!token) return;
  const cached = localStorage.getItem(VERDICT_KEY);
  if (cached) {
    const parsed = JSON.parse(cached) as LicenseState;
    if (parsed.token === token) license = parsed;
  }
  void verifyLicense(token, Boolean(fromUrl)).then(() => renderRoute());
}

async function loadRelease(): Promise<void> {
  const action = document.querySelector<HTMLElement>("[data-release-action]"); const note = document.querySelector<HTMLElement>("#release-note");
  if (!action || !note) return;
  try {
    const response = await fetch(`${RELEASE_API}/releases/latest`, { headers: { Accept: "application/vnd.github+json" } });
    if (!response.ok) throw new Error("No release");
    const release = await response.json() as { tag_name: string; body?: string; assets: Array<{ name: string; browser_download_url: string }> };
    if (release.tag_name !== RELEASE_TAG) throw new Error("Release version mismatch");
    const apk = release.assets.find((asset) => asset.name === `offline-file-bridge-${RELEASE_TAG}.apk`);
    const sums = release.assets.find((asset) => asset.name === "SHA256SUMS");
    const provenance = release.assets.find((asset) => asset.name === "BUILD-PROVENANCE.json");
    const releaseCommit = await resolveReleaseCommit(RELEASE_TAG);
    const localIdentity = await loadBuildIdentity();
    const publishedIdentity = parseReleaseProvenance(release.body || "");
    if (!apk || !sums || !provenance || releaseCommit !== __BUILD_COMMIT__ ||
      localIdentity.commit !== __BUILD_COMMIT__ || localIdentity.version !== __APP_VERSION__ ||
      publishedIdentity.product !== PRODUCT || publishedIdentity.tag !== RELEASE_TAG ||
      publishedIdentity.version !== __APP_VERSION__ || publishedIdentity.commit !== __BUILD_COMMIT__ ||
      publishedIdentity.payloadFileCount !== localIdentity.payloadFileCount ||
      publishedIdentity.payloadTreeSha256 !== localIdentity.payloadTreeSha256) throw new Error("Release identity mismatch");
    action.innerHTML = `<a class="button" href="${esc(apk.browser_download_url)}">Download APK ${esc(release.tag_name)}</a>`;
    note.innerHTML = `This Android release records this site's exact commit and verified payload fingerprint. <a href="${esc(sums.browser_download_url)}">Download SHA256SUMS</a>.`;
  } catch { action.innerHTML = `<button class="button secondary" disabled>APK ${esc(RELEASE_TAG)} is being published</button>`; note.textContent = "A matching APK is not ready yet. Check again later."; }
}

type BuildIdentity = { product: string; version: string; commit: string; payloadFileCount: number; payloadTreeSha256: string };

async function loadBuildIdentity(): Promise<BuildIdentity> {
  const response = await fetch("/build-identity.json", { cache: "no-store" });
  if (!response.ok) throw new Error("Build identity missing");
  return response.json() as Promise<BuildIdentity>;
}

function parseReleaseProvenance(body: string): BuildIdentity & { tag: string } {
  const marker = body.match(/<!-- offline-file-bridge-provenance:([^>]+) -->/);
  if (!marker) throw new Error("Release provenance missing");
  return JSON.parse(marker[1]) as BuildIdentity & { tag: string };
}

async function resolveReleaseCommit(tag: string): Promise<string> {
  const response = await fetch(`${RELEASE_API}/git/ref/tags/${encodeURIComponent(tag)}`, { headers: { Accept: "application/vnd.github+json" } });
  if (!response.ok) throw new Error("Release tag missing");
  const ref = await response.json() as { object: { type: "commit" | "tag"; sha: string } };
  if (ref.object.type === "commit") return ref.object.sha.toLowerCase();
  const tagResponse = await fetch(`${RELEASE_API}/git/tags/${ref.object.sha}`, { headers: { Accept: "application/vnd.github+json" } });
  if (!tagResponse.ok) throw new Error("Release tag missing");
  const annotated = await tagResponse.json() as { object: { sha: string } };
  return annotated.object.sha.toLowerCase();
}

window.addEventListener("popstate", () => void renderRoute(true));
window.addEventListener("online", () => { online = true; void renderRoute(); });
window.addEventListener("offline", () => { online = false; void renderRoute(); });

async function start(): Promise<void> {
  if (isNative && normalizePath(location.pathname) === "/") history.replaceState({}, "", "/app");
  captureLicense();
  await renderRoute();
  if ("serviceWorker" in navigator && !isNative) {
    navigator.serviceWorker.register("/sw.js").then((registration) => {
      registration.addEventListener("updatefound", () => {
        const worker = registration.installing;
        worker?.addEventListener("statechange", () => { if (worker.state === "installed" && navigator.serviceWorker.controller) setNotice("An update is ready. Reload to use it.", "success"); });
      });
    }).catch(() => { /* The app remains usable when service workers are unavailable. */ });
  }
}

void start();
