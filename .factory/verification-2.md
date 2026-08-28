# Independent verification 2 — FAIL

**Candidate:** `344ba1552febc62d31d085f871af98d7f0ac6081` (`main`)

**Verified:** 2026-08-28

**Live URL:** <https://offline-file-bridge.sociobot.in>

**Artifact class:** Android APK

## Verdict

**FAIL — do not release this candidate.** Three mandatory claim commands exit before running their tests. Manual accessibility checks also found broken 200% reflow, an invisible keyboard focus stop, and undersized mobile targets. The live web/PWA, billing rate limiting, and published Android artifacts otherwise tested well.

## Mandatory first-read result

**PASS.** A cold 1440×900 load says:

- What it does: **“Keep approved folders ready offline.”**
- Who it is for: **“For Android users who need cloud files in another app when the network disappears.”**
- What to do first: **“Try it with sample data,”** followed by “A ready folder opens. Nothing is saved.”

One click opened `/demo` with a populated **Field notes** mirror, three ready files, a freshness time, storage totals, and **Share / open** actions. The persistent banner says **“Demo — sample data, nothing is saved”** and provides **Reset demo** and **Start for real**. No console or page error occurred. Screenshots were captured at `/tmp/offline-file-bridge-cold-desktop.png` and `/tmp/offline-file-bridge-demo-click.png`.

## Required claim checks

`.factory/claims.json` exists and contains 12 entries. The untouched checkout initially had no dependencies, so the first literal command probe exited 127 on missing `tsc`/`vitest`; `npm ci` then installed the lockfile. The table below records the acceptance runs after installation. Full command output is at `/tmp/offline-file-bridge-claims.log` and the full-suite HTML output is at `playwright-report/index.html` in this workspace.

| Claim | Exact command | Result | Evidence |
| --- | --- | --- | --- |
| `offline-reload` | `npm test -- --grep @claim:offline-reload` | PASS | 2/2, desktop and mobile |
| `demo-sandbox` | `npm test -- --grep @claim:demo-sandbox` | PASS | 2/2, desktop and mobile |
| `local-only` | `npm test -- --grep @claim:local-only` | PASS | 2/2, desktop and mobile |
| `freshness` | `npm test -- --grep @claim:freshness` | PASS | 2/2, desktop and mobile |
| `file-handoff` | `npm test -- --grep @claim:file-handoff` | PASS | 2/2, desktop and mobile |
| `scoped-folder-access` | `npm test -- --grep @claim:scoped-folder-access` | PASS | 2/2, desktop and mobile |
| `free-tier` | `npm test -- --grep @claim:free-tier` | PASS | 2/2, desktop and mobile |
| `browser-persistence` | `npm test -- --grep @claim:browser-persistence` | PASS | 2/2, desktop and mobile |
| `native-refresh-safety` | `npm run test:unit -- --grep @claim:native-refresh-safety` | **FAIL** | Vitest 3.0.5: `CACError: Unknown option --grep`; no test ran |
| `checkout` | `npm test -- --grep @claim:checkout` | PASS | 2/2, desktop and mobile; endpoint returned 303 |
| `consent-removal` | `npm run test:unit -- --grep @claim:consent-removal` | **FAIL** | Vitest 3.0.5: `CACError: Unknown option --grep`; no test ran |
| `native-handoff` | `npm run test:unit -- --grep @claim:native-handoff` | **FAIL** | Vitest 3.0.5: `CACError: Unknown option --grep`; no test ran |

The same three native assertions do pass when the unfiltered unit suite runs, but the claims contract requires every exact command in `claims.json` to run successfully. The supported Vitest name filter is `-t`/`--testNamePattern`, not `--grep`.

There is also a claim-scope mismatch: `local-only` is worded and exercised only for demo files, while the landing page says **“Files stay on your device”** and `/privacy` says all folder names and files are not sent. Fresh manual browser interception found no unexpected request, but the broad published privacy promise is not represented by an equally broad claim test.

## Clean install, tests, and production build

- `npm ci`: PASS; 150 packages installed from the lockfile.
- `npm run test:unit`: PASS, 3/3 Vitest tests.
- `npm test`: PASS, 46/46 Playwright tests across desktop Chromium and Pixel 5 emulation.
- `npx tsc --noEmit`: PASS.
- No lint script exists.
- `npm run build`: PASS; `dist/` produced.
- `npm run test:android`: not runnable in this worker because Java/JDK and Android SDK are absent. The repository's Android GitHub Action ran the JVM tests successfully instead.
- `npm audit --omit=dev`: PASS, zero production vulnerabilities.
- Full `npm audit`: **FAIL**, five development-tool findings: 1 moderate, 2 high, and 2 critical. Direct affected packages include Vite 6.1.0 and Vitest 3.0.5; Capacitor CLI brings the vulnerable `tar` tree.

Production sizes are within budget:

- JS: 37,048 B raw / 13.26 KB gzip.
- CSS: 13,441 B raw / 4.25 KB gzip.
- Font: 74,932 B.
- Hero WebP: 83,164 B.
- Lighthouse initial transfer: 179,458 B, with no third-party bytes.

## End-to-end product exercise

Fresh live-browser checks passed the following:

- Demo refresh changes `Ready · synced 12 min ago` to `Ready · synced just now`.
- The Markdown sample opens in a modal, downloads as `handoff-notes.md`, closes with Escape, and restores focus.
- Reset demo restores the seed. Start for real deletes `demo:offline-file-bridge` and opens `/app`.
- A representative two-file browser folder imports, survives reload in IndexedDB, and keeps both file names.
- A second free-tier folder is rejected with a specific recovery message.
- Canceling mirror removal preserves the record; confirming removes it and explains that the source was unchanged.
- After reload, a browser fallback mirror that cannot reopen its source reports exactly how to recover while keeping its existing ready copy.
- An invalid license gets a 200 verification response and the visible “not active” recovery message.
- `/install` resolves **Check latest APK** to the v0.1.1 APK without console errors.
- All rendered links returned 200, an intentional checkout 303, or `mailto:`. The unknown-route UI is usable, though its HTTP status is incorrectly 200 (see findings).

## Privacy, network, and response policy

- Cold landing and demo refresh/open produced same-origin requests only.
- Real browser folder import/reload produced same-origin requests only.
- The only runtime external fetches found in source and observed where used are GitHub public release metadata and Sociobot license verification. There are no analytics, trackers, CDN scripts, or CDN fonts.
- Demo data uses only `demo:offline-file-bridge`; the real IndexedDB was absent in demo mode. Leaving demo removed the demo key.
- Secret-pattern scan found no committed key or private key.
- Live headers include HSTS, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, a restrictive CSP, and a camera/microphone/geolocation Permissions Policy.
- Hashed JS/CSS return `cache-control: public, max-age=31536000, immutable`; `sw.js` returns `no-cache`; HTML revalidates after 30 seconds.
- Billing checkout returned 303 to `checkout.dodopayments.com`.
- A fresh burst of 100 invalid-license verification requests returned **30×200 and 70×429**. A sampled 429 included `Retry-After: 4` and `x-ratelimit-after: 4`. Concurrency ordering made the first array position nondeterministic, but the observed burst capacity was 30.
- Sign-in is not part of this product, so Entra authority validation is not applicable.

## PWA and offline behavior

- Live `/demo` registered and controlled the page with `/sw.js`.
- After the browser was switched offline, `/demo` reloaded, showed **“Offline — ready files still open,”** retained the sample, and opened `ridge-route.pdf`.
- The service worker uses a versioned cache, removes older caches, calls `skipWaiting()` and `clients.claim()`, and the app contains an `updatefound` notice path.
- A forced local service-worker replacement did not activate within the verification window, so the visible update-toast path was not independently demonstrated. This is recorded as a verification gap, not the reason for the FAIL verdict.

## Accessibility, mobile, console, and performance

- `/opt/fleet/lib/verify-url.sh` against live: PASS in 703 ms; one h1, one main landmark, `lang=en`, title present, no missing alt, no unlabeled button, no console errors. Evidence: `/tmp/offline-file-bridge-verify-url/`.
- Live `/`, `/demo`, `/app`, `/privacy`, `/terms`, `/install`, and the not-found screen each had one h1/main, route-correct title, and no console/page errors.
- Axe on desktop/mobile and light/dark landing/demo found **0 serious or critical violations**; the repository's eight route/profile axe tests also passed.
- Keyboard focus rings measured 3px with a 3px offset. Demo actions, file actions, Escape close, and dialog focus restoration worked by keyboard.
- Reduced motion set transition/animation duration to `0.01ms`; no looping motion remains.
- At normal 390×844 sizing, landing and demo had no horizontal overflow.
- **Manual 200% text resize failed:** the 390px demo grew to 537px scroll width and all three **Share / open** controls moved outside the viewport.
- **Keyboard focus failed on the hidden picker:** Tab enters the 1×1 `#folder-input`, creating an invisible focus stop between **Choose a folder** and the file actions.
- **Touch targets failed the 44px baseline:** at 390px, header links measured 40px high and footer links 22px high; the Demo link was also only 42px wide.
- Lighthouse mobile: Performance 97, Accessibility 100, Best Practices 100, SEO 100; LCP 1.654 s, FCP 1.267 s, CLS 0, TBT 185 ms. Evidence: `/tmp/offline-file-bridge-lighthouse.json`.

## Deployment and Android artifact identity

- The live HTML, JS, and CSS are byte-for-byte identical to this candidate's production build:
  - HTML SHA-256 `2e6c05c88293ac2066f80e08da041ac43bd6ec1ef609fd100b7c1bfca5ddd802`
  - JS SHA-256 `534b839e910cd337d11cfe07a3a58581b651ffd69e043247184dfb2e7d016743`
  - CSS SHA-256 `4988af789e37f64666e64d7f3a9ca8e6ff9d57b387fa762074484dc18beccb5a`
- Git tag `v0.1.1` resolves to `b00b303868da2883be14bcb32601cb473fa69ba4`. The only product-tree difference from that tag to candidate `344ba155...` is `.factory/handoff.md`, so the release contains the candidate product code.
- GitHub Action run `33191438619` completed successfully for the tag and ran Android JVM tests before the release builds.
- Published APK: 7,403,321 B, SHA-256 `edd01b824744d78e0f8d12a1995fed934c4ff70380f9526f57cbfd871cca1d75`.
- Published AAB: 7,250,771 B, SHA-256 `59d654a1e8791ffad67b3a179e420e77b3d5bf08c6138864056a2a188b32ff7f`.
- Both hashes match `SHA256SUMS` and GitHub's asset digests; both ZIP containers pass integrity checks.
- The APK embeds the same candidate HTML/JS/CSS hashes. Its Capacitor metadata names `in.sociobot.offline_file_bridge`; source declares version 0.1.1 and only `INTERNET`, with a non-exported narrow `FileProvider`.
- The APK certificate is the documented self-signed test certificate, `CN=Param Factory Test, O=Sociobot, C=IN`, valid 2026-08-28 through 2054-01-13.
- No emulator, `adb`, JDK, or Android SDK is installed in this worker. Physical-device SAF selection, unreadable-provider recovery, permission revocation, and chooser delivery remain unexecuted here.

## Defects by severity

### Critical — three required claim commands cannot run

The exact commands at `.factory/claims.json` lines 62, 76, and 83 use Playwright's `--grep` flag with Vitest. Each exits 1 with `CACError: Unknown option --grep` before running a test. The acceptance contract says any failing claim command blocks release.

### High — 200% text resize loses mobile controls

At 390px with the root text size set to 200%, document width becomes 537px and all three file handoff controls are outside the viewport. This fails the explicit “text resizes to 200% without loss” accessibility requirement and impairs the core file-opening job.

### High — broad privacy copy is not covered by the listed privacy claim

The manifest promises only that **demo** files stay on device, and its interception test runs only `/demo`. The landing and privacy pages make the broader promise for user-selected files and folder names. Although fresh manual interception found no leak, the published claim and mandatory automated claim are not equivalent.

### Medium — keyboard focus lands on an invisible file input

`#folder-input` is 1×1, transparent, and pointer-disabled, but remains in sequential keyboard navigation. It receives the designed focus outline where users cannot see it. Remove it from tab order and keep the visible **Choose a folder** control as the operable trigger.

### Medium — mobile touch targets are below 44px

The mobile rule explicitly reduces header links to 40px high. Footer links measured 22px high; the Demo link measured 42×40px. This violates the product's 44×44px target baseline.

### Medium — development/build dependencies have known high and critical vulnerabilities

Full `npm audit` reports vulnerable Vite, Vitest, and the `tar` dependency reached through Capacitor CLI. Production dependencies audit clean, but the affected packages execute in development, test, and release workflows.

### Low — displayed build version is stale

Every footer renders `v0.1.0`, while the package, install page, APK/AAB, and release are v0.1.1. This weakens build identity and contradicts the handoff.

### Low — unknown routes are soft 404s

`/missing-page` renders the designed not-found screen but returns HTTP 200. The page is usable, but crawlers and clients cannot distinguish it from a valid route.

## Required next actions

1. Replace `--grep` with Vitest's supported name filter in all three native claim commands and rerun every exact entry.
2. Make the demo reflow at 200% without horizontal scrolling or off-screen file actions.
3. Remove the hidden input from sequential focus and bring every mobile target to at least 44×44px.
4. Expand the automated privacy claim to cover real browser import/open and the native network surface, or narrow the public copy.
5. Upgrade vulnerable build/test dependencies, correct the footer version, and return a true 404 for unknown routes.
6. Run the published APK's SAF, failed-refresh, removal/revocation, and chooser flows on physical Android before store distribution.
