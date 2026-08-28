# Independent verification — FAIL

**Candidate:** `149b6f4e8824a574c1939c07c88478b50ed58ba7` (`main`)  
**Verified:** 2026-08-28  
**Live URL:** https://offline-file-bridge.sociobot.in  
**Artifact class:** Android APK

## Verdict

**FAIL — do not release.** The web/PWA demo is well exercised and largely works, but the promised Android artifact is not publicly available, the paid checkout is not registered, and two native implementation paths violate the product's offline-safety and consent guarantees.

## First-read result

Cold-loading the live landing page in a new browser context answers all three required questions in plain words:

- It keeps approved folders ready offline and hands files to another app.
- It is for Android users whose cloud files need to work when the network disappears.
- The first primary action is **“Try it with sample data”**, with the adjacent explanation “A ready folder opens. Nothing is saved.”

The one-click demo exists at `/demo`, shows the persistent sample-data banner, Reset demo, and Start for real. This acceptance check passes.

## Required claim checks

`.factory/claims.json` exists and has eight entries. From this clean checkout, each exact `test` command passed against the shipped demo entry point in Chromium desktop and Pixel 5 emulation (two tests per command):

| Claim | Exact command | Result |
| --- | --- | --- |
| `offline-reload` | `npm test -- --grep @claim:offline-reload` | PASS |
| `demo-sandbox` | `npm test -- --grep @claim:demo-sandbox` | PASS |
| `local-only` | `npm test -- --grep @claim:local-only` | PASS |
| `freshness` | `npm test -- --grep @claim:freshness` | PASS |
| `file-handoff` | `npm test -- --grep @claim:file-handoff` | PASS |
| `scoped-folder-access` | `npm test -- --grep @claim:scoped-folder-access` | PASS |
| `free-tier` | `npm test -- --grep @claim:free-tier` | PASS |
| `browser-persistence` | `npm test -- --grep @claim:browser-persistence` | PASS |

`npm test` also completed with **44 Playwright tests passed**. This does not override the release-blocking findings below.

## Quality and product exercise

- `npm ci`: PASS. `npm audit --omit=dev`: 0 production vulnerabilities.
- `npx tsc --noEmit`: PASS.
- Exact production build, `npm run build`: PASS; produced `dist/`.
- `npm run test:unit`: **FAIL**. `vitest run` attempts to collect the Playwright specs and fails all three suites with `Playwright Test did not expect test() to be called here`. This is an available repository test command, so the clean-checkout test surface is not wholly green.
- Production output: JS 37.00 KB raw / 13.26 KB gzip; CSS 13.43 KB raw / 4.25 KB gzip; hero WebP 83,164 bytes; self-hosted font 74,932 bytes. These are within the stated static budgets.
- Live deployment fingerprint matches this candidate's production asset names: `index-DGpTstLK.js` and `index-eALpEu6Q.css`.
- Browser E2E: demo refresh changes freshness to “synced just now”; a sample opens in a modal and downloads as `handoff-notes.md`; browser folder selection survives reload; free-tier limit and remove confirmation work. An invalid license receives the visible inactive-license recovery state.

## Live browser, accessibility, privacy, and PWA evidence

- Live `/`, `/demo`, `/app`, `/privacy`, `/terms`, `/install`, and an unknown route loaded successfully, with one `<h1>`, route-specific titles, and no horizontal overflow at 390×844.
- Axe on live `/`, `/demo`, `/privacy`, and `/terms`: **0 serious/critical violations**. A separate mobile dark-theme axe run on `/` and `/demo` also found 0 serious/critical violations.
- Keyboard-only smoke: initial Tab focuses the skip link with a visible `rgb(7, 92, 115) solid 3px` outline and 3px offset; Enter then Tab reaches the sample-data primary action.
- Live demo PWA: service worker controller was `/sw.js`; after switching the context offline and reloading `/demo`, the page showed “Offline — ready files still open” and the Field notes sample remained visible. Reduced-motion mode reduced trace transition/animation durations to `1e-05s`.
- Demo refresh/open flow made only same-origin requests. No third-party font, analytics, or tracking request was seen in the cold landing or demo flow.
- Headers on the live deployment include HSTS, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, restrictive CSP, and Permissions-Policy. Hashed JS/CSS are `max-age=31536000, immutable`; `sw.js` is `no-cache`.
- API rate-limit check: 80 simultaneous invalid-license verification requests yielded **30 × 200 and 50 × 429**. A 429 included `Retry-After: 2` and `x-ratelimit-after: 2`; observed burst capacity was approximately 30 requests before throttling.

## Release-blocking defects

### Critical — no installable Android artifact

The public GitHub release API endpoint `https://api.github.com/repos/B-Divyesh/sf-offline-file-bridge/releases/latest` returns **404** and the public Releases page says “There aren’t any releases here.” No APK, AAB, or `SHA256SUMS` is published. The live Install flow falls back to a Releases page instead of an APK. This product's declared artifact class is `android-apk`, so the user cannot install or independently test the real Android job-to-be-done. The worker has no JDK or Android SDK (`java: command not found`), and therefore could not locally build the Android project; there is no published artifact to inspect instead.

### High — paid checkout is broken

`https://api.sociobot.in/api/v1/products/offline-file-bridge/checkout` returns **404**, while the landing page advertises a $14 one-time Bridge Pro purchase and links directly to it. The verify endpoint responds, but checkout is not registered or available. On `/install`, clicking “Check latest APK” also causes a browser console resource error for the expected GitHub API 404 before the fallback is rendered.

### High — native failed refresh destroys the last ready local mirror

In `android/app/src/main/java/in/sociobot/offline_file_bridge/OfflineBridgePlugin.java`, `sync()` calls `deleteTree(destination)` before recursively reading and copying the source. If reading any source entry or creating any output subsequently fails, the native call rejects after the previously ready private copy has already been deleted. The web record can still show its old ready time because the frontend does not replace it on error, but the file it represents is gone. This contradicts the landing claim that a failed refresh never changes the ready state and is unsafe for the core offline handoff job. Copy into a temporary mirror and replace the old mirror only after the full copy succeeds.

### High — removing a native mirror does not revoke persisted folder consent

The native plugin calls `takePersistableUriPermission()` on selection but `removeFolder()` only deletes the local directory and SharedPreferences entries. It never calls `releasePersistableUriPermission()`. Android therefore retains the app's persistent read grant after the UI says the mirror was removed, contradicting the privacy page's statement that access lasts until removal or Android settings revocation. Revoke the exact stored URI permission during removal, with an error-safe fallback for already-revoked grants.

### High — available test command fails

As above, `npm run test:unit` fails on a clean checkout. Remove or correct the script, or configure Vitest to exclude Playwright `*.spec.ts` files and add actual unit tests.

### Medium — unlisted, unproven claims

The claims manifest does not cover several reliance-worthy statements on the landing, legal copy, and README. Most importantly, “A failed refresh never changes that date,” “Mirrored files stay in app storage,” “You can remove a mirror at any time,” the narrow Android chooser handoff, and the no-stale-current promise lack corresponding observable sandbox tests. The failed-refresh statement is not merely untested: the native implementation contradicts it. Add one claim/test per promise or remove/reword the promise.

## Required next actions

1. Publish and link a signed test APK, AAB, and SHA256SUMS; then inspect the APK manifest/app id and run physical-device SAF selection, failed refresh, remove/revoke, and viewer/editor handoff tests.
2. Register the $14 product with Sociobot billing so checkout returns a valid hosted checkout.
3. Make native refresh transactional and revoke persisted URI permission on remove.
4. Repair `test:unit` and extend claims to cover the currently unlisted user promises, especially native failure preservation and consent removal.
5. Re-run independent verification after those changes.
