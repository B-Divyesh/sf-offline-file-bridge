# Independent verification 8 — PASS

- **Candidate:** `9a0ca69d4f41374750771d74b9237aa4095ef7c5` (`main`, tag `v0.1.8`)
- **Live URL:** <https://offline-file-bridge.sociobot.in/>
- **Verified:** 29 August 2026 UTC
- **Artifact class:** Android APK with PWA landing/app/demo

## Release decision

**PASS.** The prior deployment-only blocker is resolved. The live PWA, the
published `v0.1.8` APK, its release provenance, and the tag all identify the
exact candidate. The smallest useful file-mirror flow works online and
offline, every declared claim test passes, and no release-blocking product
defect was found.

## Mandatory first-read and demo gate

**PASS.** In a new browser context, the first desktop and 390 px screens say:

- what it does: **Keep approved folders ready offline**;
- who it is for: Android users who need cloud files in another app when the
  network disappears; and
- what to do first: **Try it with sample data**.

The action is visible without scrolling. Its adjacent note says a ready folder
will open and nothing will be saved. One click opens `/demo` with the persistent
**Demo — sample data, nothing is saved** banner, Reset demo, Start for real,
the ready **Field notes** mirror, and three realistic files.

## Claims gate

`.factory/claims.json` exists and has 17 entries. After `npm ci`, every literal
`test` command in the file was executed separately from this candidate. All 17
commands exited 0. Browser claim commands ran on desktop Chromium and the 390 px
mobile project.

| Claim | Result | Observable evidence |
| --- | --- | --- |
| `billing-legal` | PASS | Terms names Sociobot/Dodo Payments and automatic license revocation after refund; 2 browser projects passed. |
| `apk-payload-match` | PASS | Matching release enables the APK and a stale fingerprint disables it; 2 browser projects passed. |
| `offline-reload` | PASS | `/demo` reloaded offline and a ready sample remained openable; 2 browser projects passed. |
| `demo-sandbox` | PASS | Only `demo:offline-file-bridge` existed; no real IndexedDB database; 2 browser projects passed. |
| `demo-ready-sample` | PASS | One click opened Field notes with three files and ready state; 2 browser projects passed. |
| `demo-reset` | PASS | Reset restored `synced 12 min ago` and announced `Sample data was reset`; 2 browser projects passed. |
| `local-only` | PASS | Demo and selected-file flows emitted no cross-origin file-data request; 2 browser projects passed. |
| `freshness` | PASS | Refresh changed visible status to just now; 2 browser projects passed. |
| `file-handoff` | PASS | Saving the ready Markdown sample downloaded `handoff-notes.md`; 2 browser projects passed. |
| `scoped-folder-access` | PASS | Manifest has no broad storage permission and the plugin uses Android SAF; 2 browser projects passed. |
| `free-tier` | PASS | One-folder free limit, eight-folder Pro copy, 30 records, $14 once, and checkout URL were asserted; 2 browser projects passed. |
| `browser-persistence` | PASS | Two selected files remained after `/app` reload; 2 browser projects passed. |
| `native-refresh-safety` | PASS | Staged-copy source regression passed (`1 passed`, 7 filtered/skipped). |
| `license-verification-privacy` | PASS | The fixture token's sole foreign request was the documented Sociobot verify URL; 2 browser projects passed. |
| `checkout` | PASS | Checkout returned 303 to a hosted Dodo session; 2 browser projects passed. |
| `consent-removal` | PASS | Native regression asserted deletion, exact SAF-grant release, then preference removal (`1 passed`). |
| `native-handoff` | PASS | Native regression asserted private FileProvider URI, `ACTION_VIEW`, chooser, and read grant (`1 passed`). |

The landing page and README were cross-checked against the manifest. No
unlisted user-reliance claim was found.

## Clean-checkout gates

| Command | Result |
| --- | --- |
| `npm ci` | PASS — 148 packages installed; npm reported 0 vulnerabilities. |
| every `.factory/claims.json` command | PASS — 17/17 commands. |
| `npm test` | PASS — 76/76 Playwright checks in desktop and mobile projects. |
| `npm run test:unit` | PASS — 8/8 Vitest checks. |
| `npm run lint` | PASS — TypeScript no-emit check. |
| `npm run build` | PASS — exact production command wrote `dist/`. |
| `npm audit --omit=dev` | PASS — 0 vulnerabilities. |
| `npm run test:release-artifact` | PASS — `@claim:apk-payload-match PASS v0.1.8 dc23bd79…`. |
| `npm run test:android` | Environment limitation — this disposable verifier has no Java runtime. The exact-candidate release CI evidence below covers the Android tests. |

Production output is 39,279 bytes JavaScript (13,840 gzip), 14,431 bytes CSS
(4,449 gzip), a 74,932-byte self-hosted font, and an 83,164-byte hero image.
All are within the product budgets.

## Independent product exercise

- Demo normal path: refreshed Field notes, previewed the Markdown sample,
  downloaded it as `handoff-notes.md`, closed the modal, and reset the sample.
- Demo offline path: obtained a service-worker controller, disabled networking,
  reloaded `/demo`, saw **Offline — ready files still open**, and opened the
  ready Markdown preview.
- Real browser path: `/app` began with the useful empty state, imported the two
  fixture files into `offline-file-bridge-real`, showed counts/bytes/freshness,
  and removed the mirror after the specific confirmation without changing the
  source.
- Boundary/recovery: attempting a second free mirror showed the one-folder
  limit and recovery choices. A whitespace-only license made no request,
  announced the corrective message, and returned focus to the labelled input.
- Service-worker update: an isolated production-build server served a changed
  `sw.js`; registration update completed and the app announced **An update is
  ready. Reload to use it.** with no console error.

The Android path cannot be manually driven in this image because it has no JDK,
SDK, ADB, or emulator. GitHub Actions run `33253516356` is for this exact SHA and
completed successfully, including **Run installed-APK Android instrumentation**
and **Build the APK and app bundle**. Those installed-app checks cover SAF/no
broad permission, failed-refresh preservation, FileProvider chooser handoff,
and consent removal.

## Deployment and Android artifact identity

- Live `build-identity.json` equals local output and records version `0.1.8`,
  candidate commit `9a0ca69d4f41374750771d74b9237aa4095ef7c5`, 17 payload files, and payload
  SHA-256 `dc23bd79ab4210aaf34e750ba3d85747739dda6714db08e8d7aca1fbb9d43d37`.
- All 17 publicly served build files were fetched and compared byte-for-byte
  with `dist`; there were zero mismatches. `staticwebapp.config.json` is a host
  configuration file and is not a public asset.
- Tag `v0.1.8` resolves to the candidate commit. The latest GitHub release is
  `v0.1.8` and the live install check exposes its APK only after validating the
  commit and payload fingerprint.
- Published APK: 7,586,793 bytes; SHA-256
  `512b8b088249732e4c5d3304fc224194f37111a41ab33bf83a6f12afba4b09e1`,
  exactly matching `SHA256SUMS` and `BUILD-PROVENANCE.json`.
- APK inspection found `AndroidManifest.xml`, app id
  `in.sociobot.offline_file_bridge`, version `0.1.8`, version code `8`, and the
  candidate build identity. The release-artifact test also compared every
  embedded web file with local `dist`.

## Privacy, endpoint allowance, and headers

- Cold landing plus the whole demo refresh/preview/save/reset/offline flow made
  only same-origin requests. There were no analytics, CDN fonts, console errors,
  page errors, or failed requests.
- Real selected-folder import/remove made no foreign request. The install check
  contacted only documented public GitHub API endpoints. License verification
  is scoped to `https://api.sociobot.in/api/v1/products/offline-file-bridge/verify`.
- Fresh rate-limit probe: requests 1–30 returned 200; requests 31–40 returned
  429 and included `Retry-After: 4`. Observed allowance: **30 requests per
  client/window**.
- The checkout URL returned 303 to a hosted Dodo Payments checkout.
- HTML responses include CSP, header-delivered `frame-ancestors 'none'`, HSTS,
  `nosniff`, strict-origin referrer policy, and a restrictive permissions
  policy. HTML uses `max-age=30, must-revalidate`; hashed JS/CSS/font use
  one-year immutable caching; `sw.js` uses `no-cache`.
- No sign-in and no product-owned backend exist, so identity-provider,
  concurrency, persistence-boundary, and health-endpoint checks do not apply.

## Accessibility, responsive behavior, and performance

- Live light and dark audits covered `/`, `/demo`, `/app`, `/privacy`, `/terms`,
  `/install`, and the 404 route at 390 px: one H1 and main landmark per route,
  no horizontal overflow, no visible target below 44×44 px, and zero axe
  serious/critical findings.
- Keyboard-only use reached the skip link and primary demo action. Focus used a
  visible 3 px accent outline. The preview dialog focused **Close file** on open,
  Escape closed it, and focus returned to the invoking file button.
- The browser suite passed 200% text reflow and 16 px minimum secondary text.
  Reduced-motion contexts had zero running document animations.
- Known routes loaded without console/page errors. The intentionally unknown
  route returned HTTP 404 and rendered the styled recovery page.
- Mobile Lighthouse (cold live `/`): performance **97**, accessibility **100**,
  best practices **100**, SEO **100**; FCP 1.1 s, LCP 1.7 s, CLS 0, total
  blocking time 200 ms, total transfer 192 KiB. There was no Lighthouse runtime
  error.
- Every discovered internal link returned 200; the APK/checksum links returned
  their expected GitHub download redirects; the buy link returned its expected
  303 checkout redirect; external Param Factory returned 200.

## Defects by severity

- **P0 / release blockers:** none.
- **P1 / major:** none.
- **P2 / minor:** none found.

## Verification limitation

The worker image lacks Java and Android tooling, so local Gradle JVM/device
commands could not execute. This is not a candidate failure: the immutable
public APK matches the candidate, and the exact-candidate Android release job
completed both JVM build/test and installed-APK instrumentation successfully.
